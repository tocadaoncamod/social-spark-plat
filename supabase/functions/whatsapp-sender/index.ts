import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendMessageRequest {
  campaignId?: string;
  instanceId?: string;
  contacts: Array<{
    phone: string;
    name?: string;
    variables?: Record<string, string>;
  }>;
  message: string;
  mediaUrl?: string;
  mediaType?: string;
  delayMin?: number;
  delayMax?: number;
}

interface SingleMessageRequest {
  instanceId: string;
  phone: string;
  message: string;
  mediaUrl?: string;
  mediaType?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const evolutionApiUrl = Deno.env.get("EVOLUTION_API_URL");
    const evolutionApiKey = Deno.env.get("EVOLUTION_API_KEY");

    if (!evolutionApiUrl || !evolutionApiKey) {
      return new Response(
        JSON.stringify({ error: "Evolution API não configurada. Configure as secrets EVOLUTION_API_URL e EVOLUTION_API_KEY." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await req.json();
    const { action } = body;

    // Single message send
    if (action === "single") {
      const { instanceId, phone, message, mediaUrl, mediaType } = body as SingleMessageRequest;
      
      // Get instance name
      const { data: instance } = await supabase
        .from("whatsapp_instances")
        .select("instance_name")
        .eq("id", instanceId)
        .single();

      if (!instance) {
        return new Response(
          JSON.stringify({ error: "Instância não encontrada" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const result = await sendMessage(
        evolutionApiUrl,
        evolutionApiKey,
        instance.instance_name,
        phone,
        message,
        mediaUrl,
        mediaType
      );

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Bulk send
    if (action === "bulk") {
      const { 
        campaignId, 
        instanceId, 
        contacts, 
        message, 
        messageTemplate,
        useCustomMessage,
        customMessages,
        mediaUrl, 
        mediaType, 
        delayMin = 2, 
        delayMax = 5 
      } = body;

      // Get instance
      const { data: instance } = await supabase
        .from("whatsapp_instances")
        .select("instance_name")
        .eq("id", instanceId)
        .single();

      if (!instance) {
        return new Response(
          JSON.stringify({ error: "Instância não encontrada" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update campaign status
      if (campaignId) {
        await supabase
          .from("whatsapp_campaigns")
          .update({ status: "running", started_at: new Date().toISOString() })
          .eq("id", campaignId);
      }

      const results = [];
      let sentCount = 0;
      let failedCount = 0;

      for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        
        // Determine message to send
        let personalizedMessage: string;
        
        if (useCustomMessage && customMessages && customMessages[contact.phone]) {
          // Use pre-personalized custom message for this contact
          personalizedMessage = customMessages[contact.phone];
        } else {
          // Use template with variable replacement
          personalizedMessage = messageTemplate || message || "";
          
          // Replace variables
          if (contact.variables) {
            for (const [key, value] of Object.entries(contact.variables)) {
              personalizedMessage = personalizedMessage.replace(new RegExp(`\\{\\{${key}\\}\\}`, "gi"), String(value));
              personalizedMessage = personalizedMessage.replace(new RegExp(`\\{${key}\\}`, "gi"), String(value));
            }
          }
          
          // Also replace {nome} and {{nome}} with contact name
          if (contact.name) {
            personalizedMessage = personalizedMessage.replace(/\{\{?nome\}?\}/gi, contact.name);
          }
        }

        try {
          const result = await sendMessage(
            evolutionApiUrl,
            evolutionApiKey,
            instance.instance_name,
            contact.phone,
            personalizedMessage,
            mediaUrl,
            mediaType
          );

          results.push({ phone: contact.phone, status: "sent", result });
          sentCount++;

          // Update campaign contact status if campaign exists
          if (campaignId) {
            await supabase
              .from("whatsapp_campaign_contacts")
              .update({ status: "sent", sent_at: new Date().toISOString() })
              .eq("campaign_id", campaignId)
              .eq("phone", contact.phone);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          results.push({ phone: contact.phone, status: "failed", error: errorMessage });
          failedCount++;

          if (campaignId) {
            await supabase
              .from("whatsapp_campaign_contacts")
              .update({ status: "failed", error_message: errorMessage })
              .eq("campaign_id", campaignId)
              .eq("phone", contact.phone);
          }
        }

        // Delay between messages (except for last one)
        if (i < contacts.length - 1) {
          const delay = Math.floor(Math.random() * (delayMax - delayMin + 1) + delayMin) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      // Update campaign final status
      if (campaignId) {
        await supabase
          .from("whatsapp_campaigns")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
            sent_count: sentCount,
            failed_count: failedCount,
          })
          .eq("id", campaignId);
      }

      return new Response(
        JSON.stringify({ success: true, sent: sentCount, failed: failedCount, results }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check number status
    if (action === "check") {
      const { instanceId, phone } = body;

      const { data: instance } = await supabase
        .from("whatsapp_instances")
        .select("instance_name")
        .eq("id", instanceId)
        .single();

      if (!instance) {
        return new Response(
          JSON.stringify({ error: "Instância não encontrada" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const response = await fetch(
        `${evolutionApiUrl}/chat/whatsappNumbers/${instance.instance_name}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: evolutionApiKey,
          },
          body: JSON.stringify({ numbers: [phone] }),
        }
      );

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Ação não reconhecida" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function sendMessage(
  apiUrl: string,
  apiKey: string,
  instanceName: string,
  phone: string,
  message: string,
  mediaUrl?: string,
  mediaType?: string
) {
  // Format phone number (remove non-digits, ensure country code)
  const formattedPhone = phone.replace(/\D/g, "");
  const remoteJid = `${formattedPhone}@s.whatsapp.net`;

  if (mediaUrl && mediaType) {
    // Send media message
    const endpoint = mediaType === "image" 
      ? "sendMedia" 
      : mediaType === "video" 
        ? "sendMedia" 
        : mediaType === "audio" 
          ? "sendWhatsAppAudio" 
          : "sendMedia";

    const response = await fetch(`${apiUrl}/message/${endpoint}/${instanceName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify({
        number: formattedPhone,
        mediatype: mediaType,
        mimetype: getMimeType(mediaType),
        caption: message,
        media: mediaUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to send media: ${error}`);
    }

    return await response.json();
  } else {
    // Send text message
    const response = await fetch(`${apiUrl}/message/sendText/${instanceName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify({
        number: formattedPhone,
        text: message,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to send text: ${error}`);
    }

    return await response.json();
  }
}

function getMimeType(mediaType: string): string {
  const mimeTypes: Record<string, string> = {
    image: "image/jpeg",
    video: "video/mp4",
    audio: "audio/mpeg",
    document: "application/pdf",
  };
  return mimeTypes[mediaType] || "application/octet-stream";
}

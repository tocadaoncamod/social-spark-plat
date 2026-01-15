import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WebhookEvent {
  event: string;
  instance: string;
  data: {
    key: {
      remoteJid: string;
      fromMe: boolean;
      id: string;
    };
    pushName?: string;
    message?: {
      conversation?: string;
      extendedTextMessage?: {
        text: string;
      };
      imageMessage?: {
        caption?: string;
        url?: string;
      };
      videoMessage?: {
        caption?: string;
        url?: string;
      };
      audioMessage?: {
        url?: string;
      };
      documentMessage?: {
        title?: string;
        url?: string;
      };
    };
    messageTimestamp?: number;
    status?: string;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseKey);
    const event: WebhookEvent = await req.json();

    console.log("Received webhook event:", event.event, event.instance);

    // Get instance from database
    const { data: instance } = await supabase
      .from("whatsapp_instances")
      .select("id, user_id")
      .eq("instance_name", event.instance)
      .single();

    if (!instance) {
      console.log("Instance not found:", event.instance);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle different event types
    if (event.event === "messages.upsert") {
      const messageData = event.data;
      const isFromMe = messageData.key.fromMe;
      const remoteJid = messageData.key.remoteJid;
      const phone = remoteJid.replace("@s.whatsapp.net", "").replace("@g.us", "");

      // Extract message content
      let content = "";
      let mediaUrl = "";
      let mediaType = "";

      if (messageData.message?.conversation) {
        content = messageData.message.conversation;
      } else if (messageData.message?.extendedTextMessage?.text) {
        content = messageData.message.extendedTextMessage.text;
      } else if (messageData.message?.imageMessage) {
        content = messageData.message.imageMessage.caption || "";
        mediaUrl = messageData.message.imageMessage.url || "";
        mediaType = "image";
      } else if (messageData.message?.videoMessage) {
        content = messageData.message.videoMessage.caption || "";
        mediaUrl = messageData.message.videoMessage.url || "";
        mediaType = "video";
      } else if (messageData.message?.audioMessage) {
        mediaUrl = messageData.message.audioMessage.url || "";
        mediaType = "audio";
      } else if (messageData.message?.documentMessage) {
        content = messageData.message.documentMessage.title || "";
        mediaUrl = messageData.message.documentMessage.url || "";
        mediaType = "document";
      }

      // Find or create contact
      let contactId = null;
      const { data: existingContact } = await supabase
        .from("whatsapp_contacts")
        .select("id")
        .eq("user_id", instance.user_id)
        .eq("phone", phone)
        .single();

      if (existingContact) {
        contactId = existingContact.id;
        // Update last seen
        await supabase
          .from("whatsapp_contacts")
          .update({ last_seen: new Date().toISOString() })
          .eq("id", contactId);
      } else if (!isFromMe) {
        // Create new contact
        const { data: newContact } = await supabase
          .from("whatsapp_contacts")
          .insert({
            user_id: instance.user_id,
            phone,
            name: messageData.pushName || null,
            source: "chat",
          })
          .select("id")
          .single();
        
        if (newContact) {
          contactId = newContact.id;
        }
      }

      // Save message
      await supabase.from("whatsapp_messages").insert({
        user_id: instance.user_id,
        instance_id: instance.id,
        contact_id: contactId,
        remote_jid: remoteJid,
        content,
        media_url: mediaUrl || null,
        media_type: mediaType || null,
        direction: isFromMe ? "outbound" : "inbound",
        status: "delivered",
        sent_at: messageData.messageTimestamp
          ? new Date(messageData.messageTimestamp * 1000).toISOString()
          : new Date().toISOString(),
      });

      // If inbound message and chatbot is active, process with AI
      if (!isFromMe && content && lovableApiKey) {
        const { data: chatbotConfig } = await supabase
          .from("whatsapp_chatbot_config")
          .select("*")
          .eq("user_id", instance.user_id)
          .eq("instance_id", instance.id)
          .eq("is_active", true)
          .single();

        if (chatbotConfig) {
          // Check working hours
          const now = new Date();
          const currentHour = now.getHours();
          const currentDay = now.getDay();

          const workingDays = chatbotConfig.working_days || [1, 2, 3, 4, 5];
          let isWorkingHours = workingDays.includes(currentDay);

          if (isWorkingHours && chatbotConfig.working_hours_start && chatbotConfig.working_hours_end) {
            const startHour = parseInt(chatbotConfig.working_hours_start.split(":")[0]);
            const endHour = parseInt(chatbotConfig.working_hours_end.split(":")[0]);
            isWorkingHours = currentHour >= startHour && currentHour < endHour;
          }

          // Check if contact is excluded
          const excludedContacts = chatbotConfig.excluded_contacts || [];
          const isExcluded = excludedContacts.includes(phone);

          if (isWorkingHours && !isExcluded) {
            // Get conversation history for context
            const { data: history } = await supabase
              .from("whatsapp_messages")
              .select("content, direction")
              .eq("instance_id", instance.id)
              .eq("remote_jid", remoteJid)
              .order("sent_at", { ascending: false })
              .limit(10);

            const messages = [
              { role: "system", content: chatbotConfig.system_prompt || "Você é um assistente virtual prestativo." },
              ...(history || []).reverse().map((msg) => ({
                role: msg.direction === "inbound" ? "user" : "assistant",
                content: msg.content || "",
              })),
            ];

            // Call AI
            const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${lovableApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "google/gemini-3-flash-preview",
                messages,
              }),
            });

            if (aiResponse.ok) {
              const aiData = await aiResponse.json();
              const replyContent = aiData.choices?.[0]?.message?.content;

              if (replyContent) {
                // Send reply via Evolution API
                const evolutionApiUrl = Deno.env.get("EVOLUTION_API_URL");
                const evolutionApiKey = Deno.env.get("EVOLUTION_API_KEY");

                if (evolutionApiUrl && evolutionApiKey) {
                  await fetch(`${evolutionApiUrl}/message/sendText/${event.instance}`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      apikey: evolutionApiKey,
                    },
                    body: JSON.stringify({
                      number: phone,
                      text: replyContent,
                    }),
                  });

                  // Save AI response
                  await supabase.from("whatsapp_messages").insert({
                    user_id: instance.user_id,
                    instance_id: instance.id,
                    contact_id: contactId,
                    remote_jid: remoteJid,
                    content: replyContent,
                    direction: "outbound",
                    status: "sent",
                  });
                }
              }
            }

            // Classify lead if enabled
            if (chatbotConfig.auto_classify_leads && contactId) {
              await classifyLead(supabase, instance.user_id, contactId, content);
            }
          }
        }
      }
    }

    // Handle message status updates
    if (event.event === "messages.update") {
      const statusMap: Record<string, string> = {
        "DELIVERY_ACK": "delivered",
        "READ": "read",
        "PLAYED": "read",
      };

      const newStatus = statusMap[event.data.status || ""];
      if (newStatus) {
        await supabase
          .from("whatsapp_messages")
          .update({
            status: newStatus,
            ...(newStatus === "delivered" ? { delivered_at: new Date().toISOString() } : {}),
            ...(newStatus === "read" ? { read_at: new Date().toISOString() } : {}),
          })
          .eq("remote_jid", event.data.key.remoteJid)
          .eq("instance_id", instance.id);
      }
    }

    // Handle connection status
    if (event.event === "connection.update") {
      const statusData = event.data as unknown as { state?: string; statusReason?: number };
      const connectionStatus = statusData.state;
      
      if (connectionStatus) {
        const statusMap: Record<string, string> = {
          "open": "connected",
          "close": "disconnected",
          "connecting": "connecting",
        };

        await supabase
          .from("whatsapp_instances")
          .update({ status: statusMap[connectionStatus] || "disconnected" })
          .eq("instance_name", event.instance);
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function classifyLead(
  supabase: any,
  userId: string,
  contactId: string,
  message: string
) {
  // Get lead rules
  const { data: rules } = await supabase
    .from("whatsapp_lead_rules")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true);

  if (!rules || rules.length === 0) return;

  const lowerMessage = message.toLowerCase();
  let matchedKeywords: string[] = [];
  let classification = "new";
  let totalScoreChange = 0;

  for (const rule of rules as any[]) {
    const keywords = rule.keywords || [];
    const matched = keywords.filter((kw: string) => lowerMessage.includes(kw.toLowerCase()));
    
    if (matched.length > 0) {
      matchedKeywords = [...matchedKeywords, ...matched];
      classification = rule.classification;
      totalScoreChange += rule.score_change || 0;
    }
  }

  // Upsert lead
  const { data: existingLead } = await supabase
    .from("whatsapp_leads")
    .select("id, score")
    .eq("user_id", userId)
    .eq("contact_id", contactId)
    .single();

  if (existingLead) {
    await supabase
      .from("whatsapp_leads")
      .update({
        score: ((existingLead as any).score || 0) + totalScoreChange,
        classification: matchedKeywords.length > 0 ? classification : undefined,
        keywords_matched: matchedKeywords.length > 0 ? matchedKeywords : undefined,
        last_interaction: new Date().toISOString(),
      })
      .eq("id", (existingLead as any).id);
  } else {
    await supabase.from("whatsapp_leads").insert({
      user_id: userId,
      contact_id: contactId,
      score: totalScoreChange,
      classification: matchedKeywords.length > 0 ? classification : "new",
      keywords_matched: matchedKeywords.length > 0 ? matchedKeywords : null,
      last_interaction: new Date().toISOString(),
    });
  }
}

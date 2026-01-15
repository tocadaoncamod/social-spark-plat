import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encode as encodeHex } from "https://deno.land/std@0.168.0/encoding/hex.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// TikTok Shop API Base URLs by market
const TIKTOK_API_BASES: Record<string, string> = {
  "BR": "https://open-api.tiktokglobalshop.com",
  "US": "https://open-api.tiktokglobalshop.com",
  "UK": "https://open-api.tiktokglobalshop.com",
  "ID": "https://open-api.tiktokglobalshop.com",
  "MY": "https://open-api.tiktokglobalshop.com",
  "TH": "https://open-api.tiktokglobalshop.com",
  "VN": "https://open-api.tiktokglobalshop.com",
  "PH": "https://open-api.tiktokglobalshop.com",
  "SG": "https://open-api.tiktokglobalshop.com",
};

interface TikTokAppCredentials {
  app_id: string;
  app_key: string;
  app_secret: string;
  access_token: string;
  refresh_token?: string;
  shop_id?: string;
  market?: string;
}

// Generate TikTok API signature using HMAC-SHA256
async function generateSignature(
  path: string,
  timestamp: number,
  appSecret: string,
  params: Record<string, string> = {},
  body?: string
): Promise<string> {
  // Sort parameters by key
  const sortedParams = Object.keys(params)
    .filter(key => key !== 'sign' && key !== 'access_token')
    .sort()
    .map((key) => `${key}${params[key]}`)
    .join("");

  // Build sign string: appSecret + path + sortedParams + body + appSecret
  let signString = appSecret + path + sortedParams;
  if (body) {
    signString += body;
  }
  signString += appSecret;

  // Generate HMAC-SHA256 signature using Web Crypto API
  const encoder = new TextEncoder();
  const keyData = encoder.encode(appSecret);
  const messageData = encoder.encode(signString);
  
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", key, messageData);
  const hexBytes = encodeHex(new Uint8Array(signature));
  return new TextDecoder().decode(hexBytes);
}

async function callTikTokAPI(
  credentials: TikTokAppCredentials,
  endpoint: string,
  method: string = "GET",
  body?: object
) {
  const timestamp = Math.floor(Date.now() / 1000);
  const market = credentials.market || "BR";
  const baseUrl = TIKTOK_API_BASES[market] || TIKTOK_API_BASES["BR"];
  
  const baseParams: Record<string, string> = {
    app_key: credentials.app_key,
    timestamp: timestamp.toString(),
  };
  
  if (credentials.access_token) {
    baseParams["access_token"] = credentials.access_token;
  }
  
  if (credentials.shop_id) {
    baseParams["shop_id"] = credentials.shop_id;
  }

  const bodyString = body ? JSON.stringify(body) : undefined;
  
  const signature = await generateSignature(
    endpoint,
    timestamp,
    credentials.app_secret,
    baseParams,
    bodyString
  );

  const queryParams = new URLSearchParams({
    ...baseParams,
    sign: signature,
  });

  const url = `${baseUrl}${endpoint}?${queryParams}`;

  console.log(`Calling TikTok API: ${method} ${endpoint}`);

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-tts-access-token": credentials.access_token || "",
    },
    body: bodyString,
  });

  const result = await response.json();
  
  if (result.code !== 0) {
    console.error("TikTok API Error:", result);
  }

  return result;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user from JWT
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, appId, ...params } = await req.json();

    // Get app credentials from database
    const { data: appData, error: appError } = await supabaseClient
      .from("tiktok_apps")
      .select("*")
      .eq("user_id", user.id)
      .eq("id", appId)
      .single();

    if (appError || !appData) {
      return new Response(
        JSON.stringify({ error: "TikTok app not found or not configured" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const credentials: TikTokAppCredentials = {
      app_id: appData.app_id,
      app_key: appData.app_key,
      app_secret: appData.app_secret || "",
      access_token: appData.access_token || "",
      shop_id: appData.shop_id,
      market: appData.market || "BR",
    };

    let result;

    switch (action) {
      case "test_connection":
        // Test API connection
        result = await callTikTokAPI(credentials, "/api/shop/get_authorized_shop");
        break;

      case "get_products":
        // Get product list
        result = await callTikTokAPI(credentials, "/api/products/search", "POST", {
          page_number: params.page || 1,
          page_size: params.limit || 20,
        });
        break;

      case "get_product_detail":
        // Get single product details
        result = await callTikTokAPI(
          credentials,
          "/api/products/details",
          "GET"
        );
        break;

      case "get_orders":
        // Get order list
        result = await callTikTokAPI(credentials, "/api/orders/search", "POST", {
          page_size: params.limit || 20,
          page_token: params.pageToken,
          order_status: params.status,
        });
        break;

      case "get_order_detail":
        // Get single order details
        result = await callTikTokAPI(
          credentials,
          `/api/orders/${params.orderId}/detail`,
          "GET"
        );
        break;

      case "get_shop_info":
        // Get shop information
        result = await callTikTokAPI(credentials, "/api/shop/get_authorized_shop");
        break;

      case "get_categories":
        // Get product categories
        result = await callTikTokAPI(credentials, "/api/products/categories");
        break;

      case "get_sellers":
        // Get seller info
        result = await callTikTokAPI(credentials, "/api/seller/info");
        break;

      case "get_finance_overview":
        // Get financial overview
        result = await callTikTokAPI(credentials, "/api/finance/overview");
        break;

      case "get_affiliates":
        // Get affiliate creators
        result = await callTikTokAPI(credentials, "/api/affiliate/creators", "POST", {
          page_size: params.limit || 20,
        });
        break;

      case "get_videos":
        // Get promotional videos
        result = await callTikTokAPI(credentials, "/api/video/list", "POST", {
          page_size: params.limit || 20,
        });
        break;

      case "sync_products":
        // Sync products to local database
        const productsResult = await callTikTokAPI(
          credentials,
          "/api/products/search",
          "POST",
          { page_size: 100 }
        );

        if (productsResult.data?.products) {
          for (const product of productsResult.data.products) {
            await supabaseClient.from("tiktok_products").upsert({
              user_id: user.id,
              tiktok_product_id: product.id,
              name: product.title,
              description: product.description,
              price: parseFloat(product.sale_price?.amount || 0),
              compare_at_price: parseFloat(product.original_price?.amount || 0),
              stock_quantity: product.stock_info?.available_stock || 0,
              status: product.status,
              category: product.category_name,
              image_url: product.main_images?.[0]?.url,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: "tiktok_product_id",
            });
          }
        }
        result = { success: true, synced: productsResult.data?.products?.length || 0 };
        break;

      case "sync_orders":
        // Sync orders to local database
        const ordersResult = await callTikTokAPI(
          credentials,
          "/api/orders/search",
          "POST",
          { page_size: 100 }
        );

        if (ordersResult.data?.orders) {
          for (const order of ordersResult.data.orders) {
            await supabaseClient.from("tiktok_sales").upsert({
              user_id: user.id,
              tiktok_order_id: order.id,
              total_amount: parseFloat(order.payment?.total_amount || 0),
              unit_price: parseFloat(order.sku_list?.[0]?.sale_price || 0),
              quantity: order.sku_list?.reduce((sum: number, sku: any) => sum + (sku.quantity || 0), 0) || 1,
              status: order.status,
              payment_status: order.payment?.status || "pending",
              customer_name: order.recipient_address?.name,
              customer_phone: order.recipient_address?.phone,
              sale_date: new Date(order.create_time * 1000).toISOString(),
              created_at: new Date().toISOString(),
            }, {
              onConflict: "tiktok_order_id",
            });
          }
        }
        result = { success: true, synced: ordersResult.data?.orders?.length || 0 };
        break;

      case "exchange_code": {
        // Exchange authorization code for access token using TikTok Shop API v2
        // Reference: https://partner.tiktokshop.com/docv2/page/6507ead7b99d5302be949ba9
        const tokenUrl = "https://auth.tiktok-shops.com/api/v2/token/get";
        
        const tokenBody = {
          app_key: credentials.app_key,
          app_secret: credentials.app_secret || "",
          auth_code: params.code,
          grant_type: "authorized_code",
        };

        console.log("Exchanging code for tokens via TikTok Shop API v2...");
        console.log("Token URL:", tokenUrl);
        console.log("App Key:", credentials.app_key);
        
        const tokenResponse = await fetch(tokenUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tokenBody),
        });

        const tokenData = await tokenResponse.json();
        console.log("Token response:", JSON.stringify(tokenData));

        if (tokenData.code !== 0) {
          console.error("Token exchange failed:", tokenData);
          return new Response(
            JSON.stringify({ 
              error: tokenData.message || "Token exchange failed", 
              code: tokenData.code,
              details: tokenData 
            }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const tokenInfo = tokenData.data;
        
        if (tokenInfo?.access_token) {
          const expiresAt = new Date(Date.now() + (tokenInfo.access_token_expire_in || 86400) * 1000).toISOString();
          
          // Update the app with tokens
          const { error: updateError } = await supabaseClient
            .from("tiktok_apps")
            .update({
              access_token: tokenInfo.access_token,
              refresh_token: tokenInfo.refresh_token,
              token_expires_at: expiresAt,
              status: "connected",
              updated_at: new Date().toISOString(),
            })
            .eq("id", appId);

          if (updateError) {
            console.error("Error updating app with tokens:", updateError);
          }

          result = {
            access_token: tokenInfo.access_token,
            refresh_token: tokenInfo.refresh_token,
            expires_at: expiresAt,
            open_id: tokenInfo.open_id,
            seller_name: tokenInfo.seller_name,
          };
        } else {
          return new Response(
            JSON.stringify({ error: "No access token received", details: tokenData }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      }

      case "refresh_token": {
        // Refresh access token using TikTok Shop API v2
        const refreshUrl = "https://auth.tiktok-shops.com/api/v2/token/refresh";
        
        const refreshBody = {
          app_key: credentials.app_key,
          app_secret: credentials.app_secret || "",
          refresh_token: credentials.refresh_token || params.refresh_token,
          grant_type: "refresh_token",
        };

        console.log("Refreshing token via TikTok Shop API v2...");

        const refreshResponse = await fetch(refreshUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(refreshBody),
        });

        const refreshData = await refreshResponse.json();
        console.log("Refresh response:", JSON.stringify(refreshData));

        if (refreshData.code !== 0) {
          return new Response(
            JSON.stringify({ error: "Failed to refresh token", details: refreshData }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const refreshInfo = refreshData.data;

        if (refreshInfo?.access_token) {
          const expiresAt = new Date(Date.now() + (refreshInfo.access_token_expire_in || 86400) * 1000).toISOString();
          
          // Update the app with new tokens
          await supabaseClient
            .from("tiktok_apps")
            .update({
              access_token: refreshInfo.access_token,
              refresh_token: refreshInfo.refresh_token,
              token_expires_at: expiresAt,
              updated_at: new Date().toISOString(),
            })
            .eq("id", appId);

          result = {
            access_token: refreshInfo.access_token,
            refresh_token: refreshInfo.refresh_token,
            expires_at: expiresAt,
          };
        } else {
          return new Response(
            JSON.stringify({ error: "Failed to refresh token", details: refreshData }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
    }

    // Update last validated timestamp
    await supabaseClient
      .from("tiktok_apps")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", appId);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("TikTok Shop API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-paystack-signature",
};

async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  
  return hashHex === signature;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
  if (!paystackSecretKey) {
    console.error("PAYSTACK_SECRET_KEY not configured");
    return new Response("Configuration error", { status: 500 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    // Verify webhook signature
    if (signature) {
      const isValid = await verifySignature(body, signature, paystackSecretKey);
      if (!isValid) {
        console.error("Invalid webhook signature");
        return new Response("Invalid signature", { status: 401 });
      }
    }

    const event = JSON.parse(body);
    console.log("Webhook event received:", event.event);

    if (event.event === "charge.success") {
      const { reference, metadata, amount, customer } = event.data;
      const missionId = metadata?.mission_id;
      const missionType = metadata?.mission_type;
      const location = metadata?.location;

      console.log("Payment successful:", { reference, missionId, amount });

      // Update mission status or create completion record
      await supabase.from("activity_logs").insert({
        action: "PAYMENT_COMPLETED",
        description: `Payment of ₦${amount / 100} received for ${missionType} mission at ${location}`,
        metadata: {
          mission_id: missionId,
          reference,
          amount_kobo: amount,
          amount_ngn: amount / 100,
          customer_email: customer?.email,
          payment_status: "completed",
        },
      });

      // Create success alert
      await supabase.from("alerts").insert({
        title: `Mission Funded: ${missionType}`,
        description: `₦${amount / 100} received for ${missionType} mission at ${location}. Mission can proceed.`,
        severity: "info",
        status: "resolved",
        location,
        metadata: {
          mission_id: missionId,
          reference,
          funded: true,
        },
      });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Webhook processing error", { status: 500 });
  }
});

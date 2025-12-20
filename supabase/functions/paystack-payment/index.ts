import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  email: string;
  missionId: string;
  missionType: string;
  location: string;
  amount?: number; // Optional for fixed pricing
}

// Fixed pricing in kobo (₦5,000 per mission = 500000 kobo)
const MISSION_PRICE_KOBO = 500000;
const MISSION_PRICE_NGN = 5000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
  if (!paystackSecretKey) {
    console.error("PAYSTACK_SECRET_KEY not configured");
    return new Response(
      JSON.stringify({ error: "Payment gateway not configured" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { email, missionId, missionType, location } = await req.json() as PaymentRequest;

    console.log("Processing payment for mission:", { missionId, missionType, location, email });

    // Initialize Paystack transaction
    const reference = `mission_${missionId}_${Date.now()}`;
    
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: MISSION_PRICE_KOBO,
        reference,
        callback_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/paystack-webhook`,
        metadata: {
          mission_id: missionId,
          mission_type: missionType,
          location,
          custom_fields: [
            {
              display_name: "Mission Type",
              variable_name: "mission_type",
              value: missionType,
            },
            {
              display_name: "Location",
              variable_name: "location",
              value: location,
            },
          ],
        },
      }),
    });

    const paystackData = await paystackResponse.json();
    console.log("Paystack response:", paystackData);

    if (!paystackData.status) {
      throw new Error(paystackData.message || "Failed to initialize payment");
    }

    // Log the payment attempt
    await supabase.from("activity_logs").insert({
      action: "PAYMENT_INITIATED",
      description: `Payment initiated for ${missionType} mission at ${location}`,
      metadata: {
        mission_id: missionId,
        reference,
        amount_ngn: MISSION_PRICE_NGN,
        email,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
        amount: MISSION_PRICE_NGN,
        currency: "NGN",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Payment error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

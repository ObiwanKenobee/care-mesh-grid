import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "donation_receipt" | "impact_report" | "subscription_welcome" | "subscription_cancelled";
  email: string;
  donorName?: string;
  amount?: number;
  currency?: string;
  missionType?: string;
  location?: string;
  donationId?: string;
  subscriptionId?: string;
  interval?: string;
  impactStats?: {
    totalRaised: number;
    missionsCount: number;
    teamsDeployed: number;
    locationsServed: number;
  };
}

const formatCurrency = (amount: number, currency: string = "NGN") => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

const generateDonationReceiptHtml = (data: EmailRequest) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Donation Receipt - CIE</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #faf9f7;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #c45c3e 0%, #d4a574 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
      <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 12px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 24px;">❤️</span>
      </div>
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">CIE</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Compassion Infrastructure Engine</p>
    </div>
    
    <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
      <h2 style="color: #1a1a1a; margin: 0 0 24px; font-size: 24px;">Thank you, ${data.donorName || "Friend"}!</h2>
      
      <p style="color: #666; line-height: 1.6; margin: 0 0 24px;">
        Your generous donation has been received and will directly support our mission to transform crisis response across Africa.
      </p>
      
      <div style="background: #faf9f7; border-radius: 12px; padding: 24px; margin: 0 0 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 14px;">Amount</td>
            <td style="padding: 8px 0; color: #1a1a1a; font-size: 18px; font-weight: 600; text-align: right;">${formatCurrency(data.amount || 0, data.currency)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 14px;">Mission Type</td>
            <td style="padding: 8px 0; color: #1a1a1a; text-align: right;">${data.missionType || "General Support"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 14px;">Location</td>
            <td style="padding: 8px 0; color: #1a1a1a; text-align: right;">${data.location || "Where needed most"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 14px;">Date</td>
            <td style="padding: 8px 0; color: #1a1a1a; text-align: right;">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>
          </tr>
        </table>
      </div>
      
      <p style="color: #666; line-height: 1.6; margin: 0 0 24px; font-size: 14px;">
        Your contribution helps deploy response teams, provide emergency relief, and build resilient communities. Together, we're making compassion infrastructure a reality.
      </p>
      
      <div style="text-align: center; padding-top: 16px; border-top: 1px solid #eee;">
        <p style="color: #888; font-size: 12px; margin: 0;">Love as infrastructure, not sentiment.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

const generateImpactReportHtml = (data: EmailRequest) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Impact Report - CIE</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #faf9f7;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #c45c3e 0%, #d4a574 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Your Impact Report</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">See how your support is making a difference</p>
    </div>
    
    <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
      <h2 style="color: #1a1a1a; margin: 0 0 24px; font-size: 20px;">Hello ${data.donorName || "Friend"},</h2>
      
      <p style="color: #666; line-height: 1.6; margin: 0 0 24px;">
        Thanks to supporters like you, we've been able to expand our compassion infrastructure across Africa. Here's a snapshot of our collective impact:
      </p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 0 0 24px;">
        <div style="background: linear-gradient(135deg, #fef3e8 0%, #fce8d8 100%); border-radius: 12px; padding: 20px; text-align: center;">
          <div style="font-size: 32px; font-weight: 700; color: #c45c3e;">${formatCurrency(data.impactStats?.totalRaised || 0)}</div>
          <div style="color: #888; font-size: 12px; margin-top: 4px;">Total Raised</div>
        </div>
        <div style="background: linear-gradient(135deg, #fef3e8 0%, #fce8d8 100%); border-radius: 12px; padding: 20px; text-align: center;">
          <div style="font-size: 32px; font-weight: 700; color: #c45c3e;">${data.impactStats?.missionsCount || 0}</div>
          <div style="color: #888; font-size: 12px; margin-top: 4px;">Missions Funded</div>
        </div>
        <div style="background: linear-gradient(135deg, #fef3e8 0%, #fce8d8 100%); border-radius: 12px; padding: 20px; text-align: center;">
          <div style="font-size: 32px; font-weight: 700; color: #c45c3e;">${data.impactStats?.teamsDeployed || 0}</div>
          <div style="color: #888; font-size: 12px; margin-top: 4px;">Teams Deployed</div>
        </div>
        <div style="background: linear-gradient(135deg, #fef3e8 0%, #fce8d8 100%); border-radius: 12px; padding: 20px; text-align: center;">
          <div style="font-size: 32px; font-weight: 700; color: #c45c3e;">${data.impactStats?.locationsServed || 0}</div>
          <div style="color: #888; font-size: 12px; margin-top: 4px;">Locations Served</div>
        </div>
      </div>
      
      <p style="color: #666; line-height: 1.6; margin: 0 0 24px; font-size: 14px;">
        Every donation, whether one-time or recurring, helps us respond faster and reach further. Thank you for being part of our mission.
      </p>
      
      <div style="text-align: center;">
        <a href="#" style="display: inline-block; background: linear-gradient(135deg, #c45c3e 0%, #d4a574 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">View Full Dashboard</a>
      </div>
      
      <div style="text-align: center; padding-top: 24px; margin-top: 24px; border-top: 1px solid #eee;">
        <p style="color: #888; font-size: 12px; margin: 0;">Compassion Infrastructure Engine</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

const generateSubscriptionWelcomeHtml = (data: EmailRequest) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome Monthly Sponsor - CIE</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #faf9f7;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #c45c3e 0%, #d4a574 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
      <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 12px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 24px;">🌟</span>
      </div>
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Welcome, Mission Sponsor!</h1>
    </div>
    
    <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
      <h2 style="color: #1a1a1a; margin: 0 0 24px; font-size: 20px;">Thank you, ${data.donorName || "Friend"}!</h2>
      
      <p style="color: #666; line-height: 1.6; margin: 0 0 24px;">
        You've joined our community of monthly mission sponsors. Your recurring support of <strong>${formatCurrency(data.amount || 0, data.currency)}/${data.interval || "month"}</strong> will help us maintain consistent response capabilities across Africa.
      </p>
      
      <div style="background: #faf9f7; border-radius: 12px; padding: 24px; margin: 0 0 24px;">
        <h3 style="color: #1a1a1a; margin: 0 0 16px; font-size: 16px;">As a monthly sponsor, you'll receive:</h3>
        <ul style="color: #666; margin: 0; padding-left: 20px; line-height: 1.8;">
          <li>Monthly impact reports delivered to your inbox</li>
          <li>Priority updates on missions you've helped fund</li>
          <li>Exclusive access to field stories and testimonials</li>
          <li>Annual tax receipt for your contributions</li>
        </ul>
      </div>
      
      <p style="color: #666; line-height: 1.6; margin: 0 0 24px; font-size: 14px;">
        Your first payment has been processed, and your next contribution will be on the same date next ${data.interval || "month"}.
      </p>
      
      <div style="text-align: center; padding-top: 16px; border-top: 1px solid #eee;">
        <p style="color: #888; font-size: 12px; margin: 0;">Love as infrastructure, not sentiment.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: EmailRequest = await req.json();
    console.log("Sending email:", data.type, "to:", data.email);

    let html: string;
    let subject: string;

    switch (data.type) {
      case "donation_receipt":
        html = generateDonationReceiptHtml(data);
        subject = `Thank you for your donation - CIE`;
        break;
      case "impact_report":
        html = generateImpactReportHtml(data);
        subject = `Your Impact Report - CIE`;
        break;
      case "subscription_welcome":
        html = generateSubscriptionWelcomeHtml(data);
        subject = `Welcome, Monthly Mission Sponsor! - CIE`;
        break;
      case "subscription_cancelled":
        html = `<p>Your subscription has been cancelled. Thank you for your past support!</p>`;
        subject = `Subscription Cancelled - CIE`;
        break;
      default:
        throw new Error("Invalid email type");
    }

    const emailResponse = await resend.emails.send({
      from: "CIE <onboarding@resend.dev>",
      to: [data.email],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    // Log to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from("email_logs").insert({
      email: data.email,
      subject,
      email_type: data.type,
      related_id: data.donationId || data.subscriptionId || null,
      status: "sent",
      resend_id: emailResponse.data?.id || null,
      sent_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true, id: emailResponse.data?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

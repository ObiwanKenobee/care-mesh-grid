import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface Subscription {
  id: string;
  email: string;
  donor_name: string | null;
  amount_kobo: number;
  mission_type: string | null;
  notify_email: boolean | null;
}

const formatCurrency = (kobo: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(kobo / 100);
};

const generateImpactReportHtml = (
  donorName: string,
  stats: {
    totalRaised: number;
    missionsCount: number;
    teamsDeployed: number;
    locationsServed: number;
  },
  donorAmount: number,
  missionType: string
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Monthly Impact Report</title>
</head>
<body style="margin: 0; padding: 0; background-color: #1a1a1a; font-family: Georgia, 'Times New Roman', serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #242424; border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="padding: 40px 40px 20px; background: linear-gradient(135deg, #c9684a 0%, #d4a574 100%);">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: normal;">
                Monthly Impact Report
              </h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 40px 20px;">
              <p style="margin: 0; color: #e8e8e8; font-size: 18px; line-height: 1.6;">
                Dear ${donorName || "Valued Sponsor"},
              </p>
              <p style="margin: 20px 0 0; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                Thank you for your continued support of ${formatCurrency(donorAmount)}/month towards ${missionType === "multi-purpose" ? "where needed most" : missionType + " programs"}. 
                Here's how your generosity has made an impact this month.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="width: 48%; padding: 20px; background-color: #2a2a2a; border-radius: 12px; vertical-align: top;">
                    <p style="margin: 0; color: #c9684a; font-size: 32px; font-weight: bold;">${formatCurrency(stats.totalRaised)}</p>
                    <p style="margin: 8px 0 0; color: #a0a0a0; font-size: 14px;">Total Raised</p>
                  </td>
                  <td style="width: 4%;"></td>
                  <td style="width: 48%; padding: 20px; background-color: #2a2a2a; border-radius: 12px; vertical-align: top;">
                    <p style="margin: 0; color: #4a9d7c; font-size: 32px; font-weight: bold;">${stats.missionsCount}</p>
                    <p style="margin: 8px 0 0; color: #a0a0a0; font-size: 14px;">Missions Funded</p>
                  </td>
                </tr>
                <tr><td colspan="3" style="height: 16px;"></td></tr>
                <tr>
                  <td style="width: 48%; padding: 20px; background-color: #2a2a2a; border-radius: 12px; vertical-align: top;">
                    <p style="margin: 0; color: #d4a574; font-size: 32px; font-weight: bold;">${stats.teamsDeployed}</p>
                    <p style="margin: 8px 0 0; color: #a0a0a0; font-size: 14px;">Teams Deployed</p>
                  </td>
                  <td style="width: 4%;"></td>
                  <td style="width: 48%; padding: 20px; background-color: #2a2a2a; border-radius: 12px; vertical-align: top;">
                    <p style="margin: 0; color: #7a9ec9; font-size: 32px; font-weight: bold;">${stats.locationsServed}</p>
                    <p style="margin: 8px 0 0; color: #a0a0a0; font-size: 14px;">Locations Served</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="https://cie.lovable.app/donors" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #c9684a 0%, #d4a574 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px;">
                      View Your Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background-color: #1a1a1a; border-top: 1px solid #333;">
              <p style="margin: 0; color: #666; font-size: 14px; text-align: center;">
                Compassion Intelligence Engine • Making impact visible
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

async function sendEmail(to: string, subject: string, html: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "CIE Impact <impact@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Starting monthly impact report generation...");

    const { data: subscriptions, error: subsError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("status", "active")
      .eq("notify_email", true);

    if (subsError) {
      console.error("Error fetching subscriptions:", subsError);
      throw new Error(`Failed to fetch subscriptions: ${subsError.message}`);
    }

    console.log(`Found ${subscriptions?.length || 0} active subscriptions with email notifications`);

    const { data: donations } = await supabase
      .from("donations")
      .select("amount_kobo, mission_type, location")
      .eq("status", "completed");

    const stats = {
      totalRaised: donations?.reduce((sum, d) => sum + (d.amount_kobo || 0), 0) || 0,
      missionsCount: donations?.length || 0,
      teamsDeployed: donations?.length || 0,
      locationsServed: new Set(donations?.map((d) => d.location).filter(Boolean)).size || 0,
    };

    const results: { email: string; success: boolean; error?: string }[] = [];

    for (const sub of (subscriptions as Subscription[]) || []) {
      const html = generateImpactReportHtml(
        sub.donor_name || "Valued Sponsor",
        stats,
        sub.amount_kobo,
        sub.mission_type || "multi-purpose"
      );

      const subject = `Your Monthly Impact Report - ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
      const result = await sendEmail(sub.email, subject, html);

      if (result.success) {
        console.log(`Successfully sent impact report to ${sub.email}`);
        results.push({ email: sub.email, success: true });

        await supabase.from("email_logs").insert({
          email: sub.email,
          email_type: "monthly_impact_report",
          subject,
          status: "sent",
          sent_at: new Date().toISOString(),
          related_id: sub.id,
          metadata: { stats, month: new Date().getMonth() + 1, year: new Date().getFullYear() },
        });
      } else {
        console.error(`Failed to send to ${sub.email}:`, result.error);
        results.push({ email: sub.email, success: false, error: result.error });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    console.log(`Completed: ${successCount} sent, ${failCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: successCount,
        failed: failCount,
        results,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Monthly impact report error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

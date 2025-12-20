import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmailOptions {
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

export const useResendEmail = () => {
  const [isSending, setIsSending] = useState(false);

  const sendEmail = async (options: EmailOptions): Promise<boolean> => {
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: options,
      });

      if (error) throw error;

      console.log("Email sent successfully:", data);
      return true;
    } catch (error: any) {
      console.error("Failed to send email:", error);
      toast.error("Failed to send email notification");
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const sendDonationReceipt = async (
    email: string,
    donorName: string,
    amount: number,
    currency: string = "NGN",
    missionType?: string,
    location?: string,
    donationId?: string
  ) => {
    return sendEmail({
      type: "donation_receipt",
      email,
      donorName,
      amount,
      currency,
      missionType,
      location,
      donationId,
    });
  };

  const sendImpactReport = async (
    email: string,
    donorName: string,
    impactStats: EmailOptions["impactStats"]
  ) => {
    return sendEmail({
      type: "impact_report",
      email,
      donorName,
      impactStats,
    });
  };

  const sendSubscriptionWelcome = async (
    email: string,
    donorName: string,
    amount: number,
    currency: string = "NGN",
    interval: string = "monthly",
    subscriptionId?: string
  ) => {
    return sendEmail({
      type: "subscription_welcome",
      email,
      donorName,
      amount,
      currency,
      interval,
      subscriptionId,
    });
  };

  return {
    isSending,
    sendEmail,
    sendDonationReceipt,
    sendImpactReport,
    sendSubscriptionWelcome,
  };
};

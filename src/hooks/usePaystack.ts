import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PaymentRequest {
  email: string;
  missionId: string;
  missionType: string;
  location: string;
}

interface PaymentResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
  amount: number;
  currency: string;
}

export const usePaystack = () => {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async (request: PaymentRequest): Promise<PaymentResponse | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("paystack-payment", {
        body: request,
      });

      if (error) {
        console.error("Payment error:", error);
        toast.error("Failed to initiate payment");
        return null;
      }

      if (!data.success) {
        toast.error(data.error || "Payment initialization failed");
        return null;
      }

      return data as PaymentResponse;
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Failed to initiate payment");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const openPaymentPage = async (request: PaymentRequest) => {
    const result = await initiatePayment(request);
    if (result) {
      // Open Paystack payment page in new tab
      window.open(result.authorization_url, "_blank");
      toast.success(`Redirecting to payment (₦${result.amount})`);
      return result;
    }
    return null;
  };

  return { initiatePayment, openPaymentPage, loading };
};

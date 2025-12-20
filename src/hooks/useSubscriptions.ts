import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Subscription {
  id: string;
  email: string;
  donor_name: string | null;
  donor_phone: string | null;
  amount_kobo: number;
  currency: string;
  interval: string;
  subscription_code: string | null;
  status: string;
  next_payment_date: string | null;
  mission_type: string | null;
  location: string | null;
  notify_sms: boolean | null;
  notify_email: boolean | null;
  created_at: string;
  cancelled_at: string | null;
}

export const useSubscriptions = (email?: string) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, [email]);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("subscriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (email) {
        query = query.eq("email", email);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error: any) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Failed to load subscriptions");
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async (subscriptionData: {
    email: string;
    donor_name?: string;
    donor_phone?: string;
    amount_kobo: number;
    currency?: string;
    interval?: string;
    mission_type?: string;
    location?: string;
    notify_sms?: boolean;
    notify_email?: boolean;
  }) => {
    try {
      const nextPaymentDate = new Date();
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

      const { data, error } = await supabase
        .from("subscriptions")
        .insert({
          ...subscriptionData,
          status: "active",
          next_payment_date: nextPaymentDate.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Subscription created successfully!");
      await fetchSubscriptions();
      return data;
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      toast.error("Failed to create subscription");
      return null;
    }
  };

  const cancelSubscription = async (subscriptionId: string) => {
    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
        })
        .eq("id", subscriptionId);

      if (error) throw error;

      toast.success("Subscription cancelled");
      await fetchSubscriptions();
      return true;
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);
      toast.error("Failed to cancel subscription");
      return false;
    }
  };

  const getActiveSubscriptionsCount = () => {
    return subscriptions.filter((s) => s.status === "active").length;
  };

  const getTotalMonthlyAmount = () => {
    return subscriptions
      .filter((s) => s.status === "active")
      .reduce((sum, s) => sum + s.amount_kobo / 100, 0);
  };

  return {
    subscriptions,
    isLoading,
    createSubscription,
    cancelSubscription,
    getActiveSubscriptionsCount,
    getTotalMonthlyAmount,
    refetch: fetchSubscriptions,
  };
};

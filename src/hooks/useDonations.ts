import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Donation {
  id: string;
  email: string;
  amount_kobo: number;
  amount_ngn: number | null;
  currency: string;
  payment_reference: string | null;
  mission_id: string | null;
  mission_type: string | null;
  location: string | null;
  status: string;
  donor_name: string | null;
  donor_phone: string | null;
  notify_sms: boolean | null;
  is_recurring: boolean | null;
  recurring_interval: string | null;
  subscription_code: string | null;
  metadata: unknown;
  created_at: string;
  completed_at: string | null;
}

export const useDonations = (email?: string) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, [email]);

  const fetchDonations = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("donations")
        .select("*")
        .eq("status", "completed")
        .order("created_at", { ascending: false });

      if (email) {
        query = query.eq("email", email);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDonations(data || []);
    } catch (error: any) {
      console.error("Error fetching donations:", error);
      toast.error("Failed to load donation history");
    } finally {
      setIsLoading(false);
    }
  };

  const getStats = () => {
    const totalRaised = donations.reduce((sum, d) => sum + d.amount_kobo / 100, 0);
    const missionsFunded = new Set(donations.map(d => d.mission_id).filter(Boolean)).size;
    const locations = new Set(donations.map(d => d.location).filter(Boolean));
    const recurringCount = donations.filter(d => d.is_recurring).length;

    return {
      totalRaised,
      missionsFunded,
      locationsServed: locations.size,
      totalDonations: donations.length,
      recurringDonations: recurringCount,
    };
  };

  const getDonationsByMissionType = () => {
    const byType: Record<string, number> = {};
    donations.forEach((d) => {
      const type = d.mission_type || "general";
      byType[type] = (byType[type] || 0) + d.amount_kobo / 100;
    });
    return byType;
  };

  return {
    donations,
    isLoading,
    getStats,
    getDonationsByMissionType,
    refetch: fetchDonations,
  };
};

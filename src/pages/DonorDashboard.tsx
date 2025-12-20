import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  RefreshCw,
  CreditCard,
  Mail,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useDonations } from "@/hooks/useDonations";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useResendEmail } from "@/hooks/useResendEmail";
import { usePaystack } from "@/hooks/usePaystack";
import { formatDistanceToNow, format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { z } from "zod";

const subscriptionSchema = z.object({
  email: z.string().email("Invalid email address"),
  donor_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  amount: z.number().min(1000, "Minimum amount is ₦1,000").max(10000000, "Maximum amount is ₦10,000,000"),
});

const formatCurrency = (amount: number, currency: string = "NGN") => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

const missionTypeColors: Record<string, string> = {
  medical: "bg-red-500/20 text-red-400",
  nutrition: "bg-green-500/20 text-green-400",
  shelter: "bg-blue-500/20 text-blue-400",
  water: "bg-cyan-500/20 text-cyan-400",
  education: "bg-purple-500/20 text-purple-400",
  "multi-purpose": "bg-amber-500/20 text-amber-400",
  general: "bg-muted text-muted-foreground",
};

const DonorDashboard = () => {
  const { donations, isLoading: donationsLoading, getStats, getDonationsByMissionType, refetch: refetchDonations } = useDonations();
  const { subscriptions, isLoading: subsLoading, createSubscription, cancelSubscription, getTotalMonthlyAmount } = useSubscriptions();
  const { sendImpactReport, isSending: isEmailSending } = useResendEmail();
  const { openPaymentPage, loading: isProcessing } = usePaystack();

  const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false);
  const [newSub, setNewSub] = useState({
    email: "",
    donor_name: "",
    amount: 5000,
    interval: "monthly",
    mission_type: "multi-purpose",
    notify_email: true,
    notify_sms: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [emailForReport, setEmailForReport] = useState("");

  const stats = getStats();
  const donationsByType = getDonationsByMissionType();
  const activeSubscriptions = subscriptions.filter((s) => s.status === "active");

  const handleCreateSubscription = async () => {
    try {
      const validationResult = subscriptionSchema.safeParse({
        email: newSub.email,
        donor_name: newSub.donor_name,
        amount: newSub.amount,
      });

      if (!validationResult.success) {
        const errors: Record<string, string> = {};
        validationResult.error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors(errors);
        return;
      }

      setFormErrors({});

      // Initialize payment first
      const result = await openPaymentPage({
        email: newSub.email,
        amount: newSub.amount,
        donorName: newSub.donor_name,
        missionType: newSub.mission_type,
        location: "Monthly Sponsor",
        notifySms: newSub.notify_sms,
      });

      if (result?.success) {
        // Create subscription record
        await createSubscription({
          email: newSub.email,
          donor_name: newSub.donor_name,
          amount_kobo: newSub.amount * 100,
          interval: newSub.interval,
          mission_type: newSub.mission_type,
          notify_email: newSub.notify_email,
          notify_sms: newSub.notify_sms,
        });

        setSubscribeDialogOpen(false);
        setNewSub({
          email: "",
          donor_name: "",
          amount: 5000,
          interval: "monthly",
          mission_type: "multi-purpose",
          notify_email: true,
          notify_sms: false,
        });
        refetchDonations();
      }
    } catch (error) {
      console.error("Subscription error:", error);
    }
  };

  const handleCancelSubscription = async (subId: string) => {
    if (confirm("Are you sure you want to cancel this subscription?")) {
      await cancelSubscription(subId);
    }
  };

  const handleRequestImpactReport = async () => {
    if (!emailForReport) {
      toast.error("Please enter your email address");
      return;
    }

    const success = await sendImpactReport(emailForReport, "Donor", {
      totalRaised: stats.totalRaised,
      missionsCount: stats.missionsFunded,
      teamsDeployed: stats.totalDonations,
      locationsServed: stats.locationsServed,
    });

    if (success) {
      toast.success("Impact report sent to your email!");
      setEmailForReport("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold">Donor Dashboard</h1>
              <p className="text-muted-foreground">Track your impact and manage your support</p>
            </div>

            <div className="flex items-center gap-3">
              <Dialog open={subscribeDialogOpen} onOpenChange={setSubscribeDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-terracotta to-amber text-primary-foreground">
                    <RefreshCw className="w-4 h-4" />
                    Become a Monthly Sponsor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-serif text-xl">Monthly Mission Sponsor</DialogTitle>
                    <DialogDescription>
                      Join our community of recurring supporters and make a lasting impact.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="sub-name">Your Name</Label>
                      <Input
                        id="sub-name"
                        value={newSub.donor_name}
                        onChange={(e) => setNewSub({ ...newSub, donor_name: e.target.value })}
                        placeholder="Enter your name"
                      />
                      {formErrors.donor_name && (
                        <p className="text-xs text-red-500">{formErrors.donor_name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sub-email">Email Address</Label>
                      <Input
                        id="sub-email"
                        type="email"
                        value={newSub.email}
                        onChange={(e) => setNewSub({ ...newSub, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                      {formErrors.email && (
                        <p className="text-xs text-red-500">{formErrors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sub-amount">Monthly Amount (₦)</Label>
                      <Select
                        value={newSub.amount.toString()}
                        onValueChange={(v) => setNewSub({ ...newSub, amount: parseInt(v) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2500">₦2,500 /month</SelectItem>
                          <SelectItem value="5000">₦5,000 /month</SelectItem>
                          <SelectItem value="10000">₦10,000 /month</SelectItem>
                          <SelectItem value="25000">₦25,000 /month</SelectItem>
                          <SelectItem value="50000">₦50,000 /month</SelectItem>
                          <SelectItem value="100000">₦100,000 /month</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.amount && (
                        <p className="text-xs text-red-500">{formErrors.amount}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Support Area</Label>
                      <Select
                        value={newSub.mission_type}
                        onValueChange={(v) => setNewSub({ ...newSub, mission_type: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multi-purpose">Where Needed Most</SelectItem>
                          <SelectItem value="medical">Medical Response</SelectItem>
                          <SelectItem value="nutrition">Nutrition Programs</SelectItem>
                          <SelectItem value="water">Clean Water</SelectItem>
                          <SelectItem value="shelter">Emergency Shelter</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <Label htmlFor="notify-email" className="cursor-pointer">
                        Send me monthly impact reports
                      </Label>
                      <Switch
                        id="notify-email"
                        checked={newSub.notify_email}
                        onCheckedChange={(c) => setNewSub({ ...newSub, notify_email: c })}
                      />
                    </div>

                    <Button
                      onClick={handleCreateSubscription}
                      className="w-full gap-2 bg-gradient-to-r from-terracotta to-amber"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CreditCard className="w-4 h-4" />
                      )}
                      Start Monthly Donation
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 bg-card/50 rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-terracotta/20 to-amber/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-terracotta" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold">{formatCurrency(stats.totalRaised)}</div>
              <div className="text-xs text-muted-foreground mt-1">Total Contributed</div>
            </div>

            <div className="p-6 bg-card/50 rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-forest/15 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-forest" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold">{stats.missionsFunded}</div>
              <div className="text-xs text-muted-foreground mt-1">Missions Funded</div>
            </div>

            <div className="p-6 bg-card/50 rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber/15 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-amber" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold">{formatCurrency(getTotalMonthlyAmount())}</div>
              <div className="text-xs text-muted-foreground mt-1">Monthly Recurring</div>
            </div>

            <div className="p-6 bg-card/50 rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold">{stats.locationsServed}</div>
              <div className="text-xs text-muted-foreground mt-1">Locations Reached</div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="donations" className="space-y-6">
            <TabsList className="bg-card/50 border border-border">
              <TabsTrigger value="donations">Donation History</TabsTrigger>
              <TabsTrigger value="subscriptions">
                Monthly Subscriptions
                {activeSubscriptions.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeSubscriptions.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="impact">Impact Report</TabsTrigger>
            </TabsList>

            <TabsContent value="donations" className="space-y-4">
              {/* Breakdown by mission type */}
              <div className="p-6 bg-card/50 rounded-xl border border-border">
                <h3 className="font-serif text-lg font-semibold mb-4">Donations by Mission Type</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(donationsByType).map(([type, amount]) => (
                    <div key={type} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <Badge className={cn("capitalize", missionTypeColors[type] || missionTypeColors.general)}>
                        {type}
                      </Badge>
                      <span className="font-mono text-sm">{formatCurrency(amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Donation list */}
              <div className="space-y-3">
                {donationsLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading donations...
                  </div>
                ) : donations.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No donations yet</p>
                    <p className="text-sm mt-1">Your contribution history will appear here</p>
                  </div>
                ) : (
                  donations.map((donation) => (
                    <div
                      key={donation.id}
                      className="p-4 bg-card/50 rounded-xl border border-border flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-terracotta/20 to-amber/20 flex items-center justify-center">
                          <Heart className="w-5 h-5 text-terracotta" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{formatCurrency(donation.amount_kobo / 100, donation.currency)}</span>
                            <Badge className={cn("text-xs", missionTypeColors[donation.mission_type || "general"])}>
                              {donation.mission_type || "General"}
                            </Badge>
                            {donation.is_recurring && (
                              <Badge variant="outline" className="text-xs">
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Recurring
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {donation.location || "General support"} • {formatDistanceToNow(new Date(donation.created_at), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-500">Completed</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="subscriptions" className="space-y-4">
              {subsLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading subscriptions...
                </div>
              ) : subscriptions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <RefreshCw className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No active subscriptions</p>
                  <p className="text-sm mt-1">Become a monthly sponsor to see your subscriptions here</p>
                  <Button
                    className="mt-4 gap-2"
                    onClick={() => setSubscribeDialogOpen(true)}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Start Monthly Donation
                  </Button>
                </div>
              ) : (
                subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-6 bg-card/50 rounded-xl border border-border"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-terracotta/20 to-amber/20 flex items-center justify-center">
                          <RefreshCw className="w-6 h-6 text-terracotta" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">
                              {formatCurrency(sub.amount_kobo / 100, sub.currency)}
                            </span>
                            <span className="text-muted-foreground">/ {sub.interval}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={cn("text-xs", missionTypeColors[sub.mission_type || "general"])}>
                              {sub.mission_type || "General"}
                            </Badge>
                            <Badge
                              variant={sub.status === "active" ? "default" : "secondary"}
                              className={sub.status === "active" ? "bg-green-500/20 text-green-400" : ""}
                            >
                              {sub.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end gap-2">
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {sub.next_payment_date
                            ? `Next: ${format(new Date(sub.next_payment_date), "MMM d, yyyy")}`
                            : "No upcoming payment"}
                        </div>
                        {sub.status === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-400"
                            onClick={() => handleCancelSubscription(sub.id)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Cancel Subscription
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="impact" className="space-y-6">
              <div className="p-6 bg-card/50 rounded-xl border border-border">
                <h3 className="font-serif text-xl font-semibold mb-4">Request Impact Report</h3>
                <p className="text-muted-foreground mb-4">
                  Get a detailed report of how your contributions are making a difference, sent directly to your email.
                </p>
                <div className="flex gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={emailForReport}
                    onChange={(e) => setEmailForReport(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button
                    onClick={handleRequestImpactReport}
                    disabled={isEmailSending}
                    className="gap-2"
                  >
                    {isEmailSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                    Send Report
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-terracotta/10 to-amber/10 rounded-xl border border-terracotta/20">
                  <h4 className="font-serif text-lg font-semibold mb-3">Your Collective Impact</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Contributed</span>
                      <span className="font-semibold">{formatCurrency(stats.totalRaised)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Missions Supported</span>
                      <span className="font-semibold">{stats.missionsFunded}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Communities Reached</span>
                      <span className="font-semibold">{stats.locationsServed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Donations</span>
                      <span className="font-semibold">{stats.totalDonations}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-forest/10 rounded-xl border border-forest/20">
                  <h4 className="font-serif text-lg font-semibold mb-3">What Your Support Enables</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-forest mt-0.5" />
                      <span>Rapid deployment of response teams to crisis zones</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-forest mt-0.5" />
                      <span>AI-powered crisis support in 47 local languages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-forest mt-0.5" />
                      <span>Solar-powered kiosks with clean water and storage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-forest mt-0.5" />
                      <span>Nutrition programs and medical supplies distribution</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DonorDashboard;

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { usePaystack } from "@/hooks/usePaystack";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import {
  CheckCircle,
  Loader2,
  CreditCard,
  FileText,
  Star,
  MapPin,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MissionCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missionId: string;
  missionType: string;
  location: string;
  teamsDeployed: number;
}

const MISSION_PRICE = 5000; // ₦5,000 per mission

export const MissionCompletionDialog = ({
  open,
  onOpenChange,
  missionId,
  missionType,
  location,
  teamsDeployed,
}: MissionCompletionDialogProps) => {
  const { openPaymentPage, loading: paymentLoading } = usePaystack();
  const { notifyPayment } = usePushNotifications();
  const [step, setStep] = useState<"summary" | "sponsor" | "complete">("summary");
  const [report, setReport] = useState({
    beneficiaries: "",
    outcome: "",
    challenges: "",
    rating: 5,
  });
  const [email, setEmail] = useState("");

  const handleSponsor = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    const result = await openPaymentPage({
      email,
      missionId,
      missionType,
      location,
    });

    if (result) {
      notifyPayment(MISSION_PRICE, missionType);
      setStep("complete");
    }
  };

  const handleClose = () => {
    setStep("summary");
    setReport({ beneficiaries: "", outcome: "", challenges: "", rating: 5 });
    setEmail("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif">
            <FileText className="w-5 h-5 text-forest" />
            Mission Completion
          </DialogTitle>
          <DialogDescription>
            Complete the mission report and sponsor future missions.
          </DialogDescription>
        </DialogHeader>

        {step === "summary" && (
          <div className="space-y-6 py-4">
            {/* Mission Summary */}
            <div className="p-4 bg-forest/10 rounded-xl border border-forest/20">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-forest" />
                Mission Summary
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{teamsDeployed} Team(s)</span>
                </div>
              </div>
              <Badge variant="outline" className="mt-3 capitalize">
                {missionType}
              </Badge>
            </div>

            {/* Report Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="beneficiaries">People Helped</Label>
                <Input
                  id="beneficiaries"
                  type="number"
                  placeholder="Number of beneficiaries"
                  value={report.beneficiaries}
                  onChange={(e) => setReport({ ...report, beneficiaries: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outcome">Mission Outcome</Label>
                <Textarea
                  id="outcome"
                  placeholder="Describe the mission outcomes..."
                  value={report.outcome}
                  onChange={(e) => setReport({ ...report, outcome: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Mission Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReport({ ...report, rating: star })}
                      className="p-1"
                    >
                      <Star
                        className={cn(
                          "w-6 h-6 transition-colors",
                          star <= report.rating
                            ? "text-amber fill-amber"
                            : "text-muted-foreground"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Save Report
              </Button>
              <Button onClick={() => setStep("sponsor")} className="flex-1 gap-2">
                <CreditCard className="w-4 h-4" />
                Sponsor Next Mission
              </Button>
            </div>
          </div>
        )}

        {step === "sponsor" && (
          <div className="space-y-6 py-4">
            {/* Pricing Card */}
            <div className="p-6 bg-gradient-to-br from-terracotta/20 to-amber/10 rounded-xl border border-terracotta/30 text-center">
              <div className="text-4xl font-bold mb-2">₦{MISSION_PRICE.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">per mission</div>
              <div className="mt-4 text-sm space-y-1">
                <p>✓ Full mission coverage</p>
                <p>✓ Team deployment costs</p>
                <p>✓ Medical supplies & equipment</p>
                <p>✓ Impact report delivery</p>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email for receipt"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You'll receive a receipt and mission update at this email.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("summary")} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleSponsor}
                disabled={paymentLoading || !email.trim()}
                className="flex-1 gap-2 bg-terracotta hover:bg-terracotta/90"
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Pay with Paystack
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Secure payment powered by Paystack. Supports cards, bank transfer, and USSD.
            </p>
          </div>
        )}

        {step === "complete" && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
              <p className="text-muted-foreground text-sm">
                Your sponsorship helps deploy response teams to those in need.
                You'll receive an impact report via email.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full mt-4">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

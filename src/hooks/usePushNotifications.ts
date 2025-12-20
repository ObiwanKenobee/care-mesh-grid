import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported("Notification" in window);
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      toast.error("Notifications not supported in this browser");
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === "granted") {
        toast.success("Notifications enabled!");
        // Send a welcome notification
        new Notification("Compassion Grid", {
          body: "You'll now receive alerts for deployments and emergencies.",
          icon: "/favicon.ico",
          tag: "welcome",
        });
        return true;
      } else {
        toast.error("Notification permission denied");
        return false;
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast.error("Failed to enable notifications");
      return false;
    }
  }, [isSupported]);

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!isSupported || permission !== "granted") {
        console.log("Notifications not available, using toast instead");
        toast(title, { description: options?.body });
        return;
      }

      try {
        new Notification(title, {
          icon: "/favicon.ico",
          ...options,
        });
      } catch (error) {
        console.error("Error sending notification:", error);
        toast(title, { description: options?.body });
      }
    },
    [isSupported, permission]
  );

  const notifyDeployment = useCallback(
    (teamCount: number, location: string, missionType: string) => {
      sendNotification("🚀 Response Team Deployed", {
        body: `${teamCount} team(s) dispatched to ${location} for ${missionType} mission`,
        tag: `deployment-${Date.now()}`,
      });
    },
    [sendNotification]
  );

  const notifyAlert = useCallback(
    (title: string, severity: string, location?: string) => {
      const emoji = severity === "critical" ? "🚨" : severity === "warning" ? "⚠️" : "ℹ️";
      sendNotification(`${emoji} ${title}`, {
        body: location ? `Location: ${location}` : undefined,
        tag: `alert-${Date.now()}`,
      });
    },
    [sendNotification]
  );

  const notifyPayment = useCallback(
    (amount: number, missionType: string) => {
      sendNotification("💰 Payment Received", {
        body: `₦${amount.toLocaleString()} received for ${missionType} mission`,
        tag: `payment-${Date.now()}`,
      });
    },
    [sendNotification]
  );

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
    notifyDeployment,
    notifyAlert,
    notifyPayment,
  };
};

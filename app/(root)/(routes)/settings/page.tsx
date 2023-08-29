import SubscriptionButton from "@/components/SubscriptionButton";
import { checkSubscription } from "@/lib/subscription";

async function SettingsPage() {
  const isPro = await checkSubscription();

  return (
    <div className="h-full p-4 space-y-2">
      <h3 className="text-lg font-medium">Settings</h3>
      <div className="text-muted-foreground text-sm">
        {`You are currently on a ${isPro ? "Pro" : "free"} plan.`}
      </div>
      <SubscriptionButton isPro={isPro} />
    </div>
  );
}

export default SettingsPage;

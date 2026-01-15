import { Twitter } from "lucide-react";
import { PlatformPage } from "@/components/platforms/PlatformPage";

export default function TwitterPage() {
  return (
    <PlatformPage
      name="Twitter/X"
      icon={Twitter}
      color="text-foreground"
      bgColor="bg-foreground/10"
      description="Manage your Twitter/X posts and trends"
    />
  );
}

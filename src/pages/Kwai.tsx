import { Zap } from "lucide-react";
import { PlatformPage } from "@/components/platforms/PlatformPage";

export default function KwaiPage() {
  return (
    <PlatformPage
      name="Kwai"
      icon={Zap}
      color="text-orange-500"
      bgColor="bg-orange-500/10"
      description="Manage your Kwai short videos and content"
    />
  );
}

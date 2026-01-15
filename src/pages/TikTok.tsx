import { Music } from "lucide-react";
import { PlatformPage } from "@/components/platforms/PlatformPage";

export default function TikTokPage() {
  return (
    <PlatformPage
      name="TikTok"
      icon={Music}
      color="text-tiktok"
      bgColor="bg-tiktok/10"
      description="Manage your TikTok content and trends"
    />
  );
}

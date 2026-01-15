import { Youtube } from "lucide-react";
import { PlatformPage } from "@/components/platforms/PlatformPage";

export default function YouTubePage() {
  return (
    <PlatformPage
      name="YouTube"
      icon={Youtube}
      color="text-youtube"
      bgColor="bg-youtube/10"
      description="Manage your YouTube channel, videos, and analytics"
    />
  );
}

import { Instagram } from "lucide-react";
import { PlatformPage } from "@/components/platforms/PlatformPage";

export default function InstagramPage() {
  return (
    <PlatformPage
      name="Instagram"
      icon={Instagram}
      color="text-instagram"
      bgColor="bg-instagram/10"
      description="Manage your Instagram feed, stories, and reels"
    />
  );
}

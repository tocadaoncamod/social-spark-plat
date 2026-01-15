import { Send } from "lucide-react";
import { PlatformPage } from "@/components/platforms/PlatformPage";

export default function TelegramPage() {
  return (
    <PlatformPage
      name="Telegram"
      icon={Send}
      color="text-telegram"
      bgColor="bg-telegram/10"
      description="Manage your Telegram channels and groups"
    />
  );
}

import { MessageCircle } from "lucide-react";
import { PlatformPage } from "@/components/platforms/PlatformPage";

export default function WhatsAppPage() {
  return (
    <PlatformPage
      name="WhatsApp"
      icon={MessageCircle}
      color="text-whatsapp"
      bgColor="bg-whatsapp/10"
      description="Manage your WhatsApp Business messages and broadcasts"
    />
  );
}

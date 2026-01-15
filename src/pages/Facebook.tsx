import { Facebook } from "lucide-react";
import { PlatformPage } from "@/components/platforms/PlatformPage";

export default function FacebookPage() {
  return (
    <PlatformPage
      name="Facebook"
      icon={Facebook}
      color="text-facebook"
      bgColor="bg-facebook/10"
      description="Manage your Facebook pages, posts, and ads"
    />
  );
}

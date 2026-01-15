import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success("Recovery email sent!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">MarketFlow</span>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold">
              {sent ? "Check your email" : "Forgot password?"}
            </CardTitle>
            <CardDescription>
              {sent
                ? "We've sent a password recovery link to your email address."
                : "Enter your email and we'll send you a recovery link."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="space-y-4">
                <div className="flex justify-center py-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setSent(false)}
                    className="text-primary hover:underline"
                  >
                    try again
                  </button>
                </p>
                <Link to="/login">
                  <Button variant="outline" className="w-full gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Send recovery link"
                  )}
                </Button>

                <Link to="/login">
                  <Button variant="ghost" className="w-full gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                  </Button>
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

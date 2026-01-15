import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Lock, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user came from a valid recovery link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setHasSession(true);
      }
    });

    // Listen for auth state changes (recovery link click)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setHasSession(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      setSuccess(true);
      toast.success("Password updated successfully!");
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
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
              {success ? "Password updated!" : "Reset your password"}
            </CardTitle>
            <CardDescription>
              {success
                ? "Your password has been successfully updated."
                : "Enter your new password below."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4">
                <div className="flex justify-center py-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Redirecting you to the dashboard...
                </p>
                <Link to="/dashboard">
                  <Button className="w-full gap-2">
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : !hasSession ? (
              <div className="space-y-4">
                <p className="text-center text-muted-foreground">
                  This link is invalid or has expired. Please request a new password reset.
                </p>
                <Link to="/forgot-password">
                  <Button className="w-full">Request new link</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Update password
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

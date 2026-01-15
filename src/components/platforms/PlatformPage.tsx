import { LucideIcon } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  BarChart3, 
  MessageSquare, 
  Image,
  FileText,
  Calendar
} from "lucide-react";

interface PlatformPageProps {
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
}

export function PlatformPage({ name, icon: Icon, color, bgColor, description }: PlatformPageProps) {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${bgColor}`}>
            <Icon className={`h-7 w-7 ${color}`} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5K</div>
            <p className="text-xs text-muted-foreground">+2.5% this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2%</div>
            <p className="text-xs text-muted-foreground">+0.8% this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">12 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.3K</div>
            <p className="text-xs text-muted-foreground">+15% this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="posts" className="gap-2">
            <FileText className="h-4 w-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="messages" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="media" className="gap-2">
            <Image className="h-4 w-4" />
            Media
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>Manage your {name} content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${bgColor} mb-4`}>
                  <FileText className={`h-8 w-8 ${color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-4 max-w-sm">
                  Connect your {name} account to start managing your posts and content.
                </p>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Connect Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Track your {name} performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${bgColor} mb-4`}>
                  <BarChart3 className={`h-8 w-8 ${color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Analytics coming soon</h3>
                <p className="text-muted-foreground max-w-sm">
                  Connect your account to view detailed analytics and insights.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Manage your {name} conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${bgColor} mb-4`}>
                  <MessageSquare className={`h-8 w-8 ${color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">No messages</h3>
                <p className="text-muted-foreground max-w-sm">
                  Your inbox is empty. Connect your account to manage messages.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>Your {name} media assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${bgColor} mb-4`}>
                  <Image className={`h-8 w-8 ${color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">No media uploaded</h3>
                <p className="text-muted-foreground max-w-sm">
                  Upload images and videos to use in your posts.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Posts</CardTitle>
              <CardDescription>Upcoming {name} content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${bgColor} mb-4`}>
                  <Calendar className={`h-8 w-8 ${color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Nothing scheduled</h3>
                <p className="text-muted-foreground max-w-sm">
                  Plan ahead by scheduling your posts for optimal engagement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

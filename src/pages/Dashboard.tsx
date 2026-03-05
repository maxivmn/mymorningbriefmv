import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { SectorExposure } from "@/components/dashboard/SectorExposure";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { GlobalMarketNews } from "@/components/dashboard/GlobalMarketNews";
import { PortfolioNews } from "@/components/dashboard/PortfolioNews";
import { RecentPurchases } from "@/components/dashboard/RecentPurchases";
import { AIPriorityFeed } from "@/components/dashboard/AIPriorityFeed";
import { Globe, Briefcase, ShoppingCart, Sparkles } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Morning Briefing</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <PortfolioOverview />

          <Tabs defaultValue="global" className="w-full">
            <TabsList className="w-full justify-start bg-muted/50">
              <TabsTrigger value="global" className="gap-1.5 text-xs">
                <Globe className="h-3.5 w-3.5" /> Global
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="gap-1.5 text-xs">
                <Briefcase className="h-3.5 w-3.5" /> Portfolio
              </TabsTrigger>
              <TabsTrigger value="recent" className="gap-1.5 text-xs">
                <ShoppingCart className="h-3.5 w-3.5" /> Recent
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-1.5 text-xs">
                <Sparkles className="h-3.5 w-3.5" /> AI Priority
              </TabsTrigger>
            </TabsList>

            <TabsContent value="global" className="mt-4">
              <GlobalMarketNews />
            </TabsContent>
            <TabsContent value="portfolio" className="mt-4">
              <PortfolioNews />
            </TabsContent>
            <TabsContent value="recent" className="mt-4">
              <RecentPurchases />
            </TabsContent>
            <TabsContent value="ai" className="mt-4">
              <AIPriorityFeed />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <SectorExposure />
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
}

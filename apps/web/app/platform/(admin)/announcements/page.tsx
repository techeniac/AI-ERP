"use client";

import { useQuery } from "@tanstack/react-query";
import { Megaphone, Info, AlertTriangle, Wrench, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockPlatformAnnouncements, type PlatformAnnouncement } from "@/lib/mock/platform";
import { formatDate, formatDateTime } from "@/lib/utils/format";
import { toast } from "sonner";

const typeIcon: Record<PlatformAnnouncement["type"], React.ElementType> = {
  info: Info,
  warning: AlertTriangle,
  maintenance: Wrench,
  feature: Sparkles,
};

const typeColor: Record<PlatformAnnouncement["type"], string> = {
  info: "bg-blue-100 text-blue-700",
  warning: "bg-amber-100 text-amber-700",
  maintenance: "bg-red-100 text-red-700",
  feature: "bg-violet-100 text-violet-700",
};

const statusColor: Record<PlatformAnnouncement["status"], string> = {
  draft: "bg-gray-100 text-gray-600",
  scheduled: "bg-indigo-100 text-indigo-700",
  sent: "bg-emerald-100 text-emerald-700",
};

export default function AnnouncementsPage() {
  const { data: announcements } = useQuery({ queryKey: ["platform-announcements"], queryFn: () => mockPlatformAnnouncements });
  const allItems = announcements ?? [];

  const kpis = [
    { label: "Total", value: allItems.length },
    { label: "Sent", value: allItems.filter((a) => a.status === "sent").length },
    { label: "Scheduled", value: allItems.filter((a) => a.status === "scheduled").length },
    { label: "Drafts", value: allItems.filter((a) => a.status === "draft").length },
  ];

  const sorted = [...allItems].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Announcements</h1>
          <p className="text-sm text-muted-foreground mt-1">Platform-wide messages sent to tenant organisations</p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => toast.info("Announcement composer coming in Phase 2")}
        >
          <Megaphone className="mr-2 h-4 w-4" />
          New Announcement
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className="text-2xl font-bold mt-1">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {sorted.map((item) => {
          const Icon = typeIcon[item.type];
          return (
            <Card key={item.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${typeColor[item.type]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-sm leading-tight">{item.title}</h3>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${typeColor[item.type]}`}>{item.type}</span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColor[item.status]}`}>{item.status}</span>
                        {item.targetPlan !== "all" && (
                          <Badge variant="outline" className="text-xs capitalize">{item.targetPlan} only</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{item.body}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span>Created {formatDate(item.createdAt)} by {item.createdBy}</span>
                      {item.sentAt && <span>Sent {formatDateTime(item.sentAt)}</span>}
                      {item.scheduledFor && <span className="text-indigo-600 font-medium">Scheduled {formatDateTime(item.scheduledFor)}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {item.status === "draft" && (
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toast.success("Announcement sent!")}>
                        Send Now
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

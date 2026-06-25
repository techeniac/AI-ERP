"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, UserPlus, MoreHorizontal, UserX, UserCheck, KeyRound, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockPlatformUsers, mockPlatformOrgs, type PlatformUser } from "@/lib/mock/platform";
import { formatDate, formatRelative } from "@/lib/utils/format";
import { toast } from "sonner";
import Link from "next/link";

const statusColor: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-gray-100 text-gray-500",
  invited: "bg-blue-100 text-blue-700",
};

type UserStatus = "active" | "inactive" | "invited" | "all";

export default function PlatformUsersPage() {
  const { data: users } = useQuery({ queryKey: ["platform-users"], queryFn: () => mockPlatformUsers });
  const { data: orgs } = useQuery({ queryKey: ["platform-orgs"], queryFn: () => mockPlatformOrgs });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus>("all");

  // local status overrides: userId → new status
  const [statusOverrides, setStatusOverrides] = useState<Record<string, PlatformUser["status"]>>({});

  // invite dialog
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteOrg, setInviteOrg] = useState("");
  const [inviteRole, setInviteRole] = useState("Super Admin");
  const [extraUsers, setExtraUsers] = useState<PlatformUser[]>([]);

  const allUsers = [...extraUsers, ...(users ?? [])];

  function getStatus(u: PlatformUser): PlatformUser["status"] {
    return statusOverrides[u.id] ?? u.status;
  }

  function toggleActive(u: PlatformUser) {
    const current = getStatus(u);
    const next = current === "active" ? "inactive" : "active";
    setStatusOverrides((s) => ({ ...s, [u.id]: next }));
    toast.success(`${u.name} ${next === "active" ? "reactivated" : "deactivated"}`);
  }

  function resetPassword(u: PlatformUser) {
    toast.success(`Password reset email sent to ${u.email}`);
  }

  function resendInvite(u: PlatformUser) {
    toast.success(`Invite resent to ${u.email}`);
  }

  function handleInvite() {
    if (!inviteName.trim() || !inviteEmail.trim() || !inviteOrg) return;
    const org = (orgs ?? []).find((o) => o.id === inviteOrg);
    const newUser: PlatformUser = {
      id: `user-new-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      orgId: inviteOrg,
      orgName: org?.name ?? "",
      status: "invited",
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setExtraUsers((prev) => [newUser, ...prev]);
    toast.success(`Invite sent to ${inviteEmail.trim()}`);
    setInviteOpen(false);
    setInviteName(""); setInviteEmail(""); setInviteOrg(""); setInviteRole("Super Admin");
  }

  const filtered = allUsers.filter((u) => {
    const st = getStatus(u);
    const matchSearch = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.orgName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || st === statusFilter;
    return matchSearch && matchStatus;
  });

  const kpis = [
    { label: "Total Users", value: allUsers.length },
    { label: "Active", value: allUsers.filter((u) => getStatus(u) === "active").length },
    { label: "Inactive", value: allUsers.filter((u) => getStatus(u) === "inactive").length },
    { label: "Invited", value: allUsers.filter((u) => getStatus(u) === "invited").length },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Platform Users</h1>
          <p className="text-sm text-muted-foreground mt-1">All users across all tenant organisations</p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shrink-0"
          onClick={() => setInviteOpen(true)}
        >
          <UserPlus className="h-4 w-4" />
          Invite User
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

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or org…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as UserStatus)}>
          <SelectTrigger className="w-40 h-9"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="invited">Invited</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                {["Name", "Email", "Organisation", "Role", "Status", "Last Login", "Joined", ""].map((h) => (
                  <th key={h} className="h-10 px-4 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const st = getStatus(u);
                return (
                  <tr key={u.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{u.email}</td>
                    <td className="px-4 py-3">
                      <Link href={`/platform/organizations/${u.orgId}`} className="text-indigo-600 hover:underline text-xs">{u.orgName}</Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.role}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColor[st]}`}>{st}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{formatRelative(u.lastLoginAt)}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          {st === "invited" ? (
                            <DropdownMenuItem onClick={() => resendInvite(u)} className="gap-2">
                              <Send className="h-3.5 w-3.5" /> Resend Invite
                            </DropdownMenuItem>
                          ) : st === "active" ? (
                            <DropdownMenuItem onClick={() => toggleActive(u)} className="gap-2 text-red-600 focus:text-red-600">
                              <UserX className="h-3.5 w-3.5" /> Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => toggleActive(u)} className="gap-2 text-emerald-600 focus:text-emerald-600">
                              <UserCheck className="h-3.5 w-3.5" /> Reactivate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => resetPassword(u)} className="gap-2">
                            <KeyRound className="h-3.5 w-3.5" /> Reset Password
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">No users match the current filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invite User dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="inv-name">Full Name <span className="text-red-500">*</span></Label>
              <Input id="inv-name" placeholder="e.g. Rahul Sharma" value={inviteName} onChange={(e) => setInviteName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inv-email">Email <span className="text-red-500">*</span></Label>
              <Input id="inv-email" type="email" placeholder="rahul@company.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inv-org">Organisation <span className="text-red-500">*</span></Label>
              <Select value={inviteOrg} onValueChange={setInviteOrg}>
                <SelectTrigger id="inv-org"><SelectValue placeholder="Select organisation" /></SelectTrigger>
                <SelectContent>
                  {(orgs ?? []).map((o) => (
                    <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inv-role">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger id="inv-role"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Super Admin", "Finance", "Sales Manager", "Support Agent", "HR", "Operations"].map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
              onClick={handleInvite}
              disabled={!inviteName.trim() || !inviteEmail.trim() || !inviteOrg}
            >
              <Send className="h-4 w-4" />
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Settings, User, Shield, Bell, Building2, Palette, Globe, Key, Webhook, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { useAuth } from "@/lib/hooks/use-auth";
import { toast } from "sonner";

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState("TechNova MENA FZ LLC");
  const [timezone, setTimezone] = useState("Asia/Dubai");
  const [currency, setCurrency] = useState("AED");
  const [language, setLanguage] = useState("en");
  const [emirate, setEmirate] = useState("Dubai");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slaAlerts, setSlaAlerts] = useState(true);
  const [approvalNotifications, setApprovalNotifications] = useState(true);
  const [slackIntegration, setSlackIntegration] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [auditLog, setAuditLog] = useState(true);

  function handleSave() {
    toast.success("Settings saved successfully");
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your ERP platform preferences and integrations"
      />

      <Tabs defaultValue="company">
        <div className="flex gap-6">
          {/* Sidebar nav */}
          <div className="hidden lg:block w-48 shrink-0">
            <TabsList className="flex flex-col h-auto bg-transparent gap-0.5 w-full">
              {[
                { value: "company", label: "Company", icon: Building2 },
                { value: "profile", label: "My Profile", icon: User },
                { value: "notifications", label: "Notifications", icon: Bell },
                { value: "security", label: "Security", icon: Shield },
                { value: "integrations", label: "Integrations", icon: Webhook },
                { value: "billing", label: "Billing", icon: Database },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="justify-start gap-2 px-3 py-2 text-sm w-full data-[state=active]:bg-[var(--brand-navy)] data-[state=active]:text-white"
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Mobile tabs */}
          <div className="lg:hidden w-full">
            <TabsList className="w-full h-9 grid grid-cols-3">
              <TabsTrigger value="company" className="text-xs">Company</TabsTrigger>
              <TabsTrigger value="profile" className="text-xs">Profile</TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs">Alerts</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 min-w-0">
            <TabsContent value="company" className="mt-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Company Information</CardTitle>
                  <CardDescription>Your organisation details used across the platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>TRN (Tax Registration Number)</Label>
                      <Input placeholder="100234567890001" />
                    </div>
                    <div className="space-y-2">
                      <Label>Trade License Number</Label>
                      <Input placeholder="CN-123456/2024/AE" />
                    </div>
                    <div className="space-y-2">
                      <Label>CR Number (Commercial Registration)</Label>
                      <Input placeholder="2024/123456" />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Address Line 1</Label>
                      <Input placeholder="Office 2401, Marina Plaza" />
                    </div>
                    <div className="space-y-2">
                      <Label>Address Line 2</Label>
                      <Input placeholder="Dubai Marina" />
                    </div>
                    <div className="space-y-2">
                      <Label>Emirate</Label>
                      <Select value={emirate} onValueChange={setEmirate}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dubai">Dubai</SelectItem>
                          <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                          <SelectItem value="Sharjah">Sharjah</SelectItem>
                          <SelectItem value="Ajman">Ajman</SelectItem>
                          <SelectItem value="Ras Al Khaimah">Ras Al Khaimah</SelectItem>
                          <SelectItem value="Fujairah">Fujairah</SelectItem>
                          <SelectItem value="Umm Al Quwain">Umm Al Quwain</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>P.O. Box</Label>
                      <Input placeholder="12345" />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input defaultValue="United Arab Emirates" readOnly className="bg-muted/40" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input placeholder="+971 4 XXX XXXX" />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>IBAN</Label>
                      <Input placeholder="AE070331234567890123456" />
                    </div>
                    <div className="space-y-2">
                      <Label>Bank Name</Label>
                      <Input placeholder="First Abu Dhabi Bank (FAB)" />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Default Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AED">AED: UAE Dirham</SelectItem>
                          <SelectItem value="USD">USD: US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR: Euro</SelectItem>
                          <SelectItem value="GBP">GBP: British Pound</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Dubai">Asia/Dubai (GST +4:00)</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                          <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                          <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ar">Arabic (عربي)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Fiscal Year Start</Label>
                      <Select defaultValue="january">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="january">January (UAE Standard)</SelectItem>
                          <SelectItem value="july">July (Free Zone option)</SelectItem>
                          <SelectItem value="april">April</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={handleSave} className="bg-[var(--brand-navy)] hover:bg-[var(--brand-navy)]/90 text-white">
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Invoice Configuration</CardTitle>
                </CardHeader>
                <CardContent className="divide-y">
                  <SettingRow label="Invoice Prefix" description="Prefix applied to all invoice numbers">
                    <Input className="w-32 h-8 text-sm" defaultValue="INV-" />
                  </SettingRow>
                  <SettingRow label="Default Payment Terms" description="Applied to new invoices">
                    <Select defaultValue="30">
                      <SelectTrigger className="w-32 h-8 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Net 7</SelectItem>
                        <SelectItem value="15">Net 15</SelectItem>
                        <SelectItem value="30">Net 30</SelectItem>
                        <SelectItem value="45">Net 45</SelectItem>
                        <SelectItem value="60">Net 60</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingRow>
                  <SettingRow label="VAT Rate" description="UAE Value Added Tax — standard rate">
                    <Select defaultValue="5">
                      <SelectTrigger className="w-32 h-8 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0% (Exempt / Zero-rated)</SelectItem>
                        <SelectItem value="5">5% (Standard VAT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingRow>
                  <SettingRow label="Tax Invoice Label" description="Label printed on tax invoices (FTA requirement)">
                    <Input className="w-40 h-8 text-sm" defaultValue="Tax Invoice" />
                  </SettingRow>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="mt-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">My Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-[var(--brand-navy)] text-white text-lg font-bold">
                        {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                      <Badge className="mt-1 text-xs" variant="outline">{user?.role?.replace("_", " ")}</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input defaultValue={user?.name} />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input defaultValue={user?.email} type="email" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input defaultValue={user?.phone} placeholder="+971 50 XXX XXXX" />
                    </div>
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input defaultValue={user?.jobTitle} />
                    </div>
                  </div>

                  <Button onClick={handleSave} className="bg-[var(--brand-navy)] hover:bg-[var(--brand-navy)]/90 text-white">
                    Update Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notification Preferences</CardTitle>
                  <CardDescription>Choose when and how you get notified</CardDescription>
                </CardHeader>
                <CardContent className="divide-y">
                  <SettingRow label="Email Notifications" description="Receive notifications via email">
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </SettingRow>
                  <SettingRow label="SLA Breach Alerts" description="Alert when a support ticket breaches SLA">
                    <Switch checked={slaAlerts} onCheckedChange={setSlaAlerts} />
                  </SettingRow>
                  <SettingRow label="Approval Notifications" description="Notify when items require your approval">
                    <Switch checked={approvalNotifications} onCheckedChange={setApprovalNotifications} />
                  </SettingRow>
                  <SettingRow label="Invoice Due Reminders" description="Remind 3 days before invoice due date">
                    <Switch defaultChecked />
                  </SettingRow>
                  <SettingRow label="Task Due Reminders" description="Remind 1 day before task due date">
                    <Switch defaultChecked />
                  </SettingRow>
                  <SettingRow label="New Lead Assignments" description="Notify when a lead is assigned to you">
                    <Switch defaultChecked />
                  </SettingRow>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="divide-y">
                  <SettingRow label="Two-Factor Authentication" description="Require 2FA for all admin accounts">
                    <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                  </SettingRow>
                  <SettingRow label="Audit Log" description="Log all user actions for compliance">
                    <Switch checked={auditLog} onCheckedChange={setAuditLog} />
                  </SettingRow>
                  <SettingRow label="Session Timeout" description="Auto-logout after inactivity">
                    <Select defaultValue="60">
                      <SelectTrigger className="w-36 h-8 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingRow>
                  <SettingRow label="Password Policy" description="Minimum password strength requirements">
                    <Select defaultValue="strong">
                      <SelectTrigger className="w-36 h-8 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic (8 chars)</SelectItem>
                        <SelectItem value="strong">Strong (12 chars + symbols)</SelectItem>
                        <SelectItem value="very_strong">Very Strong</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingRow>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="mt-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Integrations</CardTitle>
                  <CardDescription>Connect third-party tools and services</CardDescription>
                </CardHeader>
                <CardContent className="divide-y">
                  <SettingRow label="Slack" description="Post alerts to #erp-alerts channel">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">Connected</Badge>
                      <Switch checked={slackIntegration} onCheckedChange={setSlackIntegration} />
                    </div>
                  </SettingRow>
                  <SettingRow label="Network International" description="Payment gateway for UAE transactions">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">Connected</Badge>
                      <Switch defaultChecked />
                    </div>
                  </SettingRow>
                  <SettingRow label="UAE FTA e-Invoicing" description="Federal Tax Authority e-invoicing API">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">Pending</Badge>
                      <Button variant="outline" size="sm" className="h-7 text-xs">Configure</Button>
                    </div>
                  </SettingRow>
                  <SettingRow label="AWS S3" description="Document storage and backups">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">Connected</Badge>
                      <Switch defaultChecked />
                    </div>
                  </SettingRow>
                  <SettingRow label="OpenAI" description="AI assistant and automation">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">Connected</Badge>
                      <Switch defaultChecked />
                    </div>
                  </SettingRow>
                  <SettingRow label="Zoom" description="Video call integration for customer meetings">
                    <Button variant="outline" size="sm" className="h-7 text-xs">Connect</Button>
                  </SettingRow>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Billing & Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4 bg-[var(--brand-navy)]/5">
                    <div>
                      <p className="font-semibold">Enterprise Plan</p>
                      <p className="text-sm text-muted-foreground">Unlimited users · All modules · Priority support</p>
                    </div>
                    <Badge className="bg-[var(--brand-navy)] text-white border-0">Active</Badge>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3 text-center">
                    {[
                      { label: "Active Users", value: "19 / unlimited" },
                      { label: "Storage Used", value: "12.4 GB / 500 GB" },
                      { label: "Next Renewal", value: "31 Mar 2027" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-lg border p-4">
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="font-semibold mt-1">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full">Manage Subscription</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

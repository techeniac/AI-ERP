"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, FileText, Download, Eye, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { mockDocuments } from "@/lib/mock/documents";
import { formatDate, formatFileSize, formatRelative } from "@/lib/utils/format";
import type { Document } from "@/lib/types";

const DOCUMENT_TYPES = [
  "all", "contract", "invoice", "hr_document", "policy", "report",
  "purchase_order", "certificate", "legal", "technical", "presentation", "design", "training",
];

const TYPE_LABELS: Record<string, string> = {
  contract: "Contract",
  invoice: "Invoice",
  hr_document: "HR Document",
  policy: "Policy",
  report: "Report",
  purchase_order: "Purchase Order",
  certificate: "Certificate",
  legal: "Legal",
  technical: "Technical",
  presentation: "Presentation",
  design: "Design",
  training: "Training",
};

const CLASSIFICATION_COLORS: Record<string, string> = {
  public: "bg-emerald-100 text-emerald-800",
  internal: "bg-blue-100 text-blue-800",
  confidential: "bg-amber-100 text-amber-800",
  restricted: "bg-red-100 text-red-800",
};

function FileIcon({ mimeType }: { mimeType: string }) {
  const ext = mimeType.includes("pdf")
    ? "PDF"
    : mimeType.includes("spreadsheet") || mimeType.includes("excel")
    ? "XLS"
    : mimeType.includes("presentation")
    ? "PPT"
    : mimeType.includes("word")
    ? "DOC"
    : "FILE";

  const colors: Record<string, string> = {
    PDF: "bg-red-100 text-red-700",
    XLS: "bg-emerald-100 text-emerald-700",
    PPT: "bg-orange-100 text-orange-700",
    DOC: "bg-blue-100 text-blue-700",
    FILE: "bg-gray-100 text-gray-700",
  };

  return (
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${colors[ext]}`}>
      {ext}
    </div>
  );
}

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [view, setView] = useState<"grid" | "list">("list");

  const { data: documents } = useQuery({
    queryKey: ["documents"],
    queryFn: () => mockDocuments,
  });

  const filtered = (documents ?? []).filter((d) => {
    const matchSearch =
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.entityName?.toLowerCase().includes(search.toLowerCase()) ||
      d.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === "all" || d.type === typeFilter;
    const matchClass = classFilter === "all" || d.classification === classFilter;
    return matchSearch && matchType && matchClass;
  });

  const totalSize = (documents ?? []).reduce((s, d) => s + (d.fileSize ?? 0), 0);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Documents"
        description="Store, search, and manage all business documents"
        actions={
          <Button className="bg-[var(--brand-navy)] hover:bg-[var(--brand-navy)]/90 text-white gap-2">
            <Plus className="h-4 w-4" />
            Upload Document
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Documents", value: (documents ?? []).length.toString() },
          { label: "Contracts", value: (documents ?? []).filter((d) => d.type === "contract").length.toString() },
          { label: "Reports", value: (documents ?? []).filter((d) => d.type === "report").length.toString() },
          { label: "Storage Used", value: formatFileSize(totalSize) },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents, tags…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44 h-9">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {DOCUMENT_TYPES.filter((t) => t !== "all").map((t) => (
              <SelectItem key={t} value={t}>{TYPE_LABELS[t] ?? t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder="All classifications" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
            <SelectItem value="confidential">Confidential</SelectItem>
            <SelectItem value="restricted">Restricted</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex rounded-md border overflow-hidden">
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1.5 text-sm font-medium ${view === "list" ? "bg-[var(--brand-navy)] text-white" : "text-muted-foreground hover:bg-muted"}`}
          >
            List
          </button>
          <button
            onClick={() => setView("grid")}
            className={`px-3 py-1.5 text-sm font-medium ${view === "grid" ? "bg-[var(--brand-navy)] text-white" : "text-muted-foreground hover:bg-muted"}`}
          >
            Grid
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No documents found"
          description="Try adjusting your search or filters"
          icon={<FolderOpen className="h-8 w-8" />}
        />
      ) : view === "list" ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  {["Document", "Type", "Related To", "Classification", "Size", "Uploaded By", "Date", ""].map((h) => (
                    <th key={h} className="h-10 px-4 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => (
                  <tr key={doc.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <FileIcon mimeType={doc.mimeType ?? ""} />
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate max-w-[200px]">{doc.name}</p>
                          <div className="flex gap-1 mt-0.5 flex-wrap">
                            {doc.tags?.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-xs bg-muted px-1.5 rounded text-muted-foreground">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{TYPE_LABELS[doc.type] ?? doc.type}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{doc.entityName ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Badge className={`text-xs border-0 ${CLASSIFICATION_COLORS[doc.classification ?? "internal"] ?? ""}`}>
                        {doc.classification}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs tabular-nums">{formatFileSize(doc.fileSize ?? 0)}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{doc.uploadedByName}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(doc.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <FileIcon mimeType={doc.mimeType ?? ""} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-tight line-clamp-2">{doc.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{doc.entityName}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Badge className={`text-xs border-0 ${CLASSIFICATION_COLORS[doc.classification ?? "internal"] ?? ""}`}>
                    {doc.classification}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatFileSize(doc.fileSize ?? 0)}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{formatDate(doc.createdAt)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

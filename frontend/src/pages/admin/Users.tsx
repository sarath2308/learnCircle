"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import DataTable, { type Column } from "@/components/PaginatedTable";
import { 
  Search, ShieldAlert, ShieldCheck, FileText, 
  UserCheck, UserX, Filter, AlertTriangle, Users as UsersIcon 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Hooks
import { useAdminUsers } from "@/hooks/admin/users/useAdminUsers";
import { useBlockUser } from "@/hooks/admin/users/useBlockUser";
import { useUnblockUser } from "@/hooks/admin/users/useUnblock";
import { useApproveProfessional } from "@/hooks/admin/users/useApproveProfessional";
import { useRejectProfessional } from "@/hooks/admin/users/useRejectProfessional";
import { cn } from "@/lib/utils";

type UserType = {
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  status: string;
  resumeUrl?: string;
  totalSessions?: number;
  state?: string;
};

const Users = () => {
  const [role, setRole] = useState<"learner" | "professional">("learner");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState(1);

  // Modal States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const handler = window.setTimeout(() => setDebouncedSearch(search), 500);
    return () => window.clearTimeout(handler);
  }, [search]);

  useEffect(() => { setPage(1); }, [role, debouncedSearch]);

  const { mutateAsync: blockUser } = useBlockUser();
  const { mutateAsync: unblockUser } = useUnblockUser();
  const { mutateAsync: ApproveProfessional } = useApproveProfessional();
  const { mutateAsync: rejectUser } = useRejectProfessional();

  const { data, isLoading, refetch } = useAdminUsers({
    userType: role,
    page,
    search: debouncedSearch,
  });

  const users = data?.data ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / 10));

  // Logic Handlers
  const triggerBlockConfirmation = (userId: string, userName: string) => {
    setTargetUser({ id: userId, name: userName });
    setIsConfirmOpen(true);
  };

  const handleConfirmBlock = async () => {
    if (targetUser) {
      await blockUser({ userId: targetUser.id });
      setIsConfirmOpen(false);
      setTargetUser(null);
      refetch();
    }
  };

  const handleUnblock = async (userId: string) => {
    await unblockUser({ userId });
    refetch();
  };

  const handleApprove = async (userId: string) => {
    await ApproveProfessional({ userId });
    refetch();
  };

  const handleReject = async (userId: string) => {
    await rejectUser({ userId });
    refetch();
  };

  const columns: Column<UserType>[] =
    role === "learner"
      ? [
          { header: "Name", accessor: "name" },
          { header: "Email", accessor: "email" },
          {
            header: "Status",
            accessor: "isBlocked",
            cell: (value) => (
              <div className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                value 
                  ? "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20" 
                  : "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20"
              )}>
                <div className={cn("h-1.5 w-1.5 rounded-full", value ? "bg-rose-500" : "bg-emerald-500")} />
                {value ? "Blocked" : "Active"}
              </div>
            ),
          },
        ]
      : [
          { header: "Name", accessor: "name" },
          { header: "Email", accessor: "email" },
          {
            header: "Status",
            accessor: "status",
            cell: (val) => (
              <span className={cn(
                "text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded border",
                val === "approved" ? "text-indigo-600 bg-indigo-50 border-indigo-100" : "text-amber-600 bg-amber-50 border-amber-100"
              )}>
                {val}
              </span>
            )
          },
          { header: "Total Sessions", accessor: "totalSessions" },
          { header: "Role", accessor: "role" },
          {
            header: "State",
            accessor: "state",
            cell: (value) => (
              <span className={cn(
                "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                value === "Blocked" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
              )}>
                {value === "Blocked" ? "Blocked" : "Active"}
              </span>
            ),
          },
        ];

  const renderActions = (user: any) => {
    const isBlocked = user.isBlocked || user.state === "Blocked";
    const isApproved = user.status === "approved";
    const isRejected = user.status === "rejected";

    return (
      <div className="flex items-center gap-2">
        {role === "professional" && user.resumeUrl && (
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-200" onClick={() => window.open(user.resumeUrl, "_blank")}>
            <FileText size={14} className="text-slate-500" />
          </Button>
        )}

        {!isBlocked ? (
          <Button
            variant="ghost"
            className="h-8 px-3 text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 rounded-lg"
            onClick={() => triggerBlockConfirmation(user.userId, user.name)}
          >
            <ShieldAlert size={14} className="mr-1.5" /> Block
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            className="h-8 px-3 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 rounded-lg"
            onClick={() => handleUnblock(user.userId)}
          >
            <ShieldCheck size={14} className="mr-1.5" /> Unblock
          </Button>
        )}

        {role === "professional" && (
          <div className="flex gap-1 ml-2 pl-2 border-l border-slate-200">
            {isApproved ? (
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                <UserCheck size={12} /> Approved
              </div>
            ) : isRejected ? (
              <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                <UserX size={12} /> Rejected
              </div>
            ) : (
              <div className="flex gap-1">
                <Button size="sm" className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-lg" onClick={() => handleApprove(user.userId)}>Approve</Button>
                <Button variant="outline" size="sm" className="h-8 text-[10px] font-black rounded-lg border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => handleReject(user.userId)}>Reject</Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* HEADER & FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3 uppercase">
            <UsersIcon className="text-indigo-600" size={32} /> User Directory
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
            System Administration & Verification
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200/60 backdrop-blur-md">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              placeholder="Filter by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 border-none shadow-none focus-visible:ring-0 text-xs font-bold"
            />
          </div>
          <div className="h-6 w-[1px] bg-slate-200" />
          <Select value={role} onValueChange={(val) => setRole(val as "learner" | "professional")}>
            <SelectTrigger className="w-40 h-10 border-none shadow-none focus:ring-0 font-black text-[10px] uppercase tracking-widest">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="learner" className="text-[10px] font-black uppercase">Learners</SelectItem>
              <SelectItem value="professional" className="text-[10px] font-black uppercase">Professionals</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        <DataTable
          columns={columns}
          page={page}
          total={totalPages}
          pageSize={10}
          rowKey={(v) => v.id}
          data={users}
          isLoading={isLoading}
          renderActions={renderActions}
          onPageChange={setPage}
        />
      </div>

      {/* CONFIRMATION MODAL */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-[350px] rounded-[2rem] border-none bg-white/90 backdrop-blur-2xl shadow-2xl p-8">
          <DialogHeader className="flex flex-col items-center space-y-4">
            <div className="h-16 w-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 animate-pulse">
              <AlertTriangle size={32} />
            </div>
            <DialogTitle className="text-xl font-black tracking-tighter text-center">CONFIRM BLOCK</DialogTitle>
            <DialogDescription className="text-center text-slate-500 text-xs font-bold leading-relaxed uppercase tracking-tighter">
              Are you sure you want to restrict <span className="text-slate-900 font-black underline underline-offset-4">"{targetUser?.name}"</span>? 
              This action prevents all platform access immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 mt-6 sm:flex-col">
            <Button className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] tracking-widest rounded-xl" onClick={handleConfirmBlock}>
              RESTRICT ACCESS
            </Button>
            <Button variant="ghost" className="w-full h-10 text-[10px] font-black tracking-widest text-slate-400" onClick={() => setIsConfirmOpen(false)}>
              CANCEL
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
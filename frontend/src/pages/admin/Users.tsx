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
import { useAdminUsers } from "@/hooks/admin/users/useAdminUsers";
import { useBlockUser } from "@/hooks/admin/users/useBlockUser";
import { useUnblockUser } from "@/hooks/admin/users/useUnblock";
import { useApproveProfessional } from "@/hooks/admin/users/useApproveProfessional";
import { useRejectProfessional } from "@/hooks/admin/users/useRejectProfessional";

type UserType = {
  id:string,
  name: string,
  email: string,
  role: string,
  isBlocked: boolean,
  status: string,
  resumeUrl?: string,
  totalSessions?: number,
  state?: string,

}
const Users = () => {
  const [role, setRole] = useState<"learner" | "professional">("learner");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const handler = window.setTimeout(() => setDebouncedSearch(search), 500);
    return () => window.clearTimeout(handler);
  }, [search]);

  // Reset page when role or search changes
  useEffect(() => {
    setPage(1);
  }, [role, debouncedSearch]);

  // Mutations
  const { mutateAsync: blockUser } = useBlockUser();
  const { mutateAsync: unblockUser } = useUnblockUser();
  const { mutateAsync: ApproveProfessional } = useApproveProfessional();
  const { mutateAsync: rejectUser } = useRejectProfessional();

  // Fetch users
  const { data, isLoading, isError } = useAdminUsers({
    userType: role,
    page,
    search: debouncedSearch,
  });

  const users = data?.data ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / 10)); // Adjust page size if needed

  // Handlers
  const handleBlock = async (userId: string) => await blockUser({ userId });
  const handleUnblock = async (userId: string) => await unblockUser({ userId });
  const handleApprove = async (userId: string) => await ApproveProfessional({ userId });
  const handleReject = async (userId: string) => await rejectUser({ userId });
  const handleViewCV = (url: string) => window.open(url, "_blank");

  // Headers
  const columns:Column<UserType>[] = role === "learner"
      ? [{
        header: "Name",
        accessor: "name",
      }, {
        header: "Email",
        accessor: "email",
      }, {
      header: "Status",
      accessor: "isBlocked",
      cell: (value) => (
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            value
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {value ? "Blocked" : "Active"}
        </span>
      ),
    },]
      : [{
        header: "Name",
        accessor: "name",
      }, {
        header: "Email",
        accessor: "email",
      }, {
        header: "Status",
        accessor: "status",
      }, {
        header: "Total Sessions",
        accessor: "totalSessions",
      }, {
        header: "Role",
        accessor: "role",
      }, {
        header: "State",
        accessor: "state",
          cell: (value) => (
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            value === "Blocked"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {value === "Blocked" ? "Blocked" : "Active"}
        </span>
      ),
      }];
  // Action Renderer
  const renderActions = (user: any) => {
    const isBlocked = user.isBlocked;
    const isApproved = user.status === "approved";
    const isRejected = user.status === "rejected";

    return (
      <div className="flex items-center gap-2">
        {!isBlocked ? (
          <Button variant="destructive"  className="bg-red-600" size="sm" onClick={() => handleBlock(user.userId)}>
            Block
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => handleUnblock(user.userId)}>
            Unblock
          </Button>
        )}

        {role === "professional" && user.resumeUrl && (
          <Button variant="outline" size="sm" onClick={() => handleViewCV(user.resumeUrl)}>
            View CV
          </Button>
        )}

        {role === "professional" && (
          <div className="flex gap-2">
            {isApproved ? (
              <Button
                variant="secondary"
                size="sm"
                className="bg-green-400 text-white cursor-not-allowed"
                disabled
              >
                Approved
              </Button>
            ) : isRejected ? (
              <Button
                variant="secondary"
                size="sm"
                className="bg-orange-500 text-white cursor-not-allowed"
                disabled
              >
                Rejected
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => handleApprove(user.userId)}
                >
                  Approve
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={() => handleReject(user.userId)}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-4">
      {/* Search + Role Filter */}
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-md"
        />

        <Select value={role} onValueChange={(val) => setRole(val as "learner" | "professional")}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="learner">Learner</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
          </SelectContent>
        </Select>
      </div>

            <DataTable 
            columns={columns}  
            page={page}
             total={totalPages}
              pageSize={10} 
              rowKey={(value)=> value.id}
               data={users} 
               isLoading={isLoading} 
               emptyState={<p className="text-center py-10">No users found</p>}
               renderActions={renderActions} 
               onPageChange={setPage} />

    </div>
  );
};

export default Users;

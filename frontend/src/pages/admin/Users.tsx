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
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaginatedTable } from "@/components/PaginatedTable";
import { useAdminUsers } from "@/hooks/admin/users/useAdminUsers";
import { useBlockUser } from "@/hooks/admin/users/useBlockUser";
import { useUnblockUser } from "@/hooks/admin/users/useUnblock";
import { useApproveProfessional } from "@/hooks/admin/users/useApproveProfessional";
import { useRejectProfessional } from "@/hooks/admin/users/useRejectProfessional";

const Users = () => {
  const [role, setRole] = useState<"learner" | "professional">("learner");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // 🧠 Debounce logic (runs after 500ms of inactivity)
  useEffect(() => {
    const handler = window.setTimeout(() => setDebouncedSearch(search), 500);
    return () => window.clearTimeout(handler);
  }, [search]);

  const { mutateAsync: blockUser } = useBlockUser();
  const { mutateAsync: unblockUser } = useUnblockUser();
  const { mutateAsync: ApproveProfessional } = useApproveProfessional();
  const { mutateAsync: rejectUser } = useRejectProfessional();

  // ✅ Fetch users dynamically based on role + debounced search
  const { data, isLoading, isError } = useAdminUsers({
    userType: role,
    page: 1,
    search: debouncedSearch, // 👈 use debounced value
  });

  const users = data?.data ?? [];

  // 🧾 Action handlers
  const handleBlock = async (userId: string) => await blockUser({ userId });
  const handleUnblock = async (userId: string) => await unblockUser({ userId });
  const handleApprove = async (userId: string) => await ApproveProfessional({ userId });
  const handleReject = async (userId: string) => await rejectUser({ userId });
  const handleViewCV = (url: string) => window.open(url, "_blank");

  // 🧾 Table headers
  const headers =
    role === "learner"
      ? ["name", "email", "role", "status"]
      : ["name", "email", "status", "totalSessions", "role", "state"];

  // 🧠 Render actions
  const renderActions = (user: any) => {
    const isBlocked = user.isBlocked;
    const isApproved = user.status === "approved";
    const isRejected = user.status === "rejected";

    return (
      <div className="flex items-center gap-2">
        {!isBlocked ? (
          <Button variant="destructive" size="sm" onClick={() => handleBlock(user.userId)}>
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

  if (isLoading) return <div className="p-6">Loading users...</div>;
  if (isError) return <div className="p-6 text-red-500">Failed to fetch users.</div>;

  return (
    <div className="p-6 space-y-4">
      {/* Search + Role Filter */}
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
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

      {/* Table */}
      <Card className="p-4">
        {users.length > 0 ? (
          <PaginatedTable headers={headers} data={users} renderActions={renderActions} />
        ) : (
          <p className="text-gray-500 text-sm text-center">No users found.</p>
        )}
      </Card>
    </div>
  );
};

export default Users;

"use client";

import React, { useState, useMemo } from "react";
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
import { useGetUsers } from "@/hooks/admin/users/useGetUsers";
import toast from "react-hot-toast";
import { useBlockUser } from "@/hooks/admin/users/useBlockUser";
import { useUnblockUser } from "@/hooks/admin/users/useUnblock";
import { useApproveProfessional } from "@/hooks/admin/users/useApproveProfessional";
import { useRejectProfessional } from "@/hooks/admin/users/useRejectProfessional";

const Users = () => {
  const [role, setRole] = useState<"learner" | "professional">("learner");
  const [search, setSearch] = useState("");
  const { mutateAsync: blockUser } = useBlockUser();
  const { mutateAsync: unblockUser } = useUnblockUser();
  const { mutateAsync: ApproveProfessional } = useApproveProfessional();
  const { mutateAsync: rejectUser } = useRejectProfessional();
  // 🧠 Fetch all users
  const { data, isLoading, isError } = useGetUsers();

  // ✅ Handle actions
  const handleBlock = async (userId: string) => {
    await blockUser({ userId });
  };

  const handleUnblock = async (userId: string) => {
    await unblockUser({ userId });
  };

  const handleApprove = async (userId: string) => {
    await ApproveProfessional({ userId });
  };
  const handleReject = async (userId: string) => [await rejectUser({ userId })];
  const handleViewCV = (url: string) => {
    window.open(url, "_blank");
  };

  // Normalize data
  const learners = data?.learners || [];
  const professionals = data?.professionals || [];

  const users = role === "learner" ? learners : professionals;

  // 🔍 Filter users by search term
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const query = search.toLowerCase();
    return users.filter((user: any) =>
      Object.values(user)
        .filter((v) => typeof v === "string")
        .some((val) => val.toLowerCase().includes(query)),
    );
  }, [users, search]);

  // 🧾 Table headers
  const headers =
    role === "learner"
      ? ["name", "email", "role", "status"]
      : ["name", "email", "status", "totalSessions", "role", "state"];

  // 🧠 Render actions per row
  const renderActions = (user: any) => {
    const isBlocked = user.isBlocked;
    const isApproved = user.status === "approved";
    const isRejected = user.status === "rejected";

    return (
      <div className="flex items-center gap-2">
        {/* Block / Unblock */}
        {!isBlocked ? (
          <Button variant="destructive" size="sm" onClick={() => handleBlock(user.userId)}>
            Block
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => handleUnblock(user.userId)}>
            Unblock
          </Button>
        )}

        {/* View CV */}
        {role === "professional" && user.resumeUrl && (
          <Button variant="outline" size="sm" onClick={() => handleViewCV(user.resumeUrl)}>
            View CV
          </Button>
        )}

        {/* Approve / Reject logic */}
        {role === "professional" && (
          <div className="flex gap-2">
            {isApproved ? (
              // ✅ Show only Approved (disabled)
              <Button
                variant="secondary"
                size="sm"
                className="bg-green-400 text-white cursor-not-allowed"
                disabled
              >
                Approved
              </Button>
            ) : isRejected ? (
              // ❌ Show only Rejected (disabled)
              <Button
                variant="secondary"
                size="sm"
                className="bg-orange-500 text-white cursor-not-allowed"
                disabled
              >
                Rejected
              </Button>
            ) : (
              // 🟡 Show both Approve and Reject if pending
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

  // 🌀 Loading & Error states
  if (isLoading) return <div className="p-6">Loading users...</div>;
  if (isError) return <div className="p-6 text-red-500">Failed to fetch users.</div>;

  return (
    <div className="p-6 space-y-4">
      {/* 🔍 Search + Role Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-48">
          <Select value={role} onValueChange={(val) => setRole(val as "learner" | "professional")}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="learner">Learner</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 🧾 Table */}
      <Card className="p-4">
        {filteredUsers.length > 0 ? (
          <PaginatedTable
            headers={headers}
            data={filteredUsers}
            rowsPerPage={5}
            renderActions={renderActions}
          />
        ) : (
          <p className="text-gray-500 text-sm text-center">No users found.</p>
        )}
      </Card>
    </div>
  );
};

export default Users;

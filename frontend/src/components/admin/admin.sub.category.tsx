"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import DataTable from "@/components/PaginatedTable";
import type { Column } from "@/components/PaginatedTable";

import { useListCategory } from "@/hooks/admin/category/useListCategory";
import { useCreateCategory } from "@/hooks/admin/category/useCreateCategory";
import { useUpdateCategory } from "@/hooks/admin/category/useUpdateCategory";
import { useBlockCategory } from "@/hooks/admin/category/useBlockCategory";
import { useUnBlockCategory } from "@/hooks/admin/category/useUnBlockCategory";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/* ---------------- TYPES ---------------- */

type Category = {
  id: string;
  name: string;
  categroy: string;
  isBlocked: boolean;
};

/* ---------------- COMPONENT ---------------- */

const AdminSubCategoryManagement = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | null>(null);
  const [name, setName] = useState("");

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "block" | "unblock";
    id: string;
    name: string;
  }>({ open: false, action: "block", id: "", name: "" });

  /* ---------------- DEBOUNCE SEARCH ---------------- */

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  /* ---------------- API HOOKS ---------------- */

  const { data, isLoading, refetch } = useListCategory({
    page,
    limit: 10,
    search: debouncedSearch,
  });

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const blockCategory = useBlockCategory();
  const unblockCategory = useUnBlockCategory();

  const items: Category[] = data?.categoryData ?? [];
  const totalCount = data?.total ?? 0;

  /* ---------------- COLUMNS ---------------- */

  const columns: Column<Category>[] = [
    {
      header: "Sub Category Name",
      accessor: "name",
    },
    {
        header:"Category",
        accessor:"category",
    }
    {
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
    },
  ];

  /* ---------------- ACTIONS ---------------- */

  const renderActions = (item: Category) => (
    <div className="flex gap-2">
      <Button
        size="sm"
      className={`font-semibold ${
    item.isBlocked
      ? "text-green-600"
      : "bg-red-600"
  }`}
        variant={item.isBlocked ? "outline" : "destructive"}
        onClick={() =>
          setConfirmDialog({
            open: true,
            action: item.isBlocked ? "unblock" : "block",
            id: item.id,
            name: item.name,
          })
        }
        disabled={blockCategory.isPending || unblockCategory.isPending}
      >
        {item.isBlocked ? "Unblock" : "Block"}
      </Button>

      <Button className="bg-yellow-300" size="sm" onClick={() => openEditDialog(item)}>
        Edit
      </Button>
    </div>
  );

  /* ---------------- HANDLERS ---------------- */

  const resetForm = () => setName("");

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    await createCategory.mutateAsync({ name: name.trim() });
    refetch();
    setCreateOpen(false);
    resetForm();
  };

  const handleEdit = async () => {
    if (!editingItem || !name.trim()) {
      toast.error("Category name is required");
      return;
    }

    await updateCategory.mutateAsync({
      id: editingItem.id,
      payload: { name: name.trim() },
    });

    refetch();
    setEditOpen(false);
    setEditingItem(null);
    resetForm();
  };

  const handleBlockUnblock = async () => {
    try {
      if (confirmDialog.action === "block") {
        await blockCategory.mutateAsync({ id: confirmDialog.id });
        toast.success(`${confirmDialog.name} blocked`);
      } else {
        await unblockCategory.mutateAsync({ id: confirmDialog.id });
        toast.success(`${confirmDialog.name} unblocked`);
      }
      refetch();
    } finally {
      setConfirmDialog((p) => ({ ...p, open: false }));
    }
  };

  const openEditDialog = (item: Category) => {
    setEditingItem(item);
    setName(item.name);
    setEditOpen(true);
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Category Management</h1>
            <p className="text-gray-500">Manage your product categories</p>
          </div>

          <div className="flex gap-3">
            <Input
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />

            <Dialog
            open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="px-2 py-1 rounded text-sm font-medium outline-2 bg-green-600 dark:bg-blue-400 text-white">Create Category</Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-gray-50">
                <DialogHeader>
                  <DialogTitle>Create Category</DialogTitle>
                </DialogHeader>

                <Input
                  placeholder="Category name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate}>
                    {createCategory.isPending ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Table */}
        
          <DataTable<Category>
            columns={columns}
            data={items}
            page={page}
            pageSize={10}
            total={totalCount}
            rowKey={(row) => row.id}
            onPageChange={setPage}
            renderActions={renderActions}
            isLoading={isLoading}
            emptyState={<p className="text-center py-10">No categories found</p>}
          />

        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="bg-white dark:bg-gray-50">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>

            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit}>
                {updateCategory.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirm Dialog */}
        <AlertDialog
          open={confirmDialog.open}
          onOpenChange={(o) => setConfirmDialog((p) => ({ ...p, open: o }))}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmDialog.action === "block" ? "Block" : "Unblock"} Category
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to {confirmDialog.action}{" "}
                <strong>{confirmDialog.name}</strong>?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleBlockUnblock}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminSubCategoryManagement;

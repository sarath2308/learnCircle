"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaginatedTable } from "@/components/PaginatedTable";

import { useListCategory } from "@/hooks/admin/category/useListCategory";
import { useCreateCategory } from "@/hooks/admin/category/useCreateCategory";
import { useUpdateCategory } from "@/hooks/admin/category/useUpdateCategory";
import { useBlockCategory } from "@/hooks/admin/category/useBlockCategory";
import { useUnBlockCategory } from "@/hooks/admin/category/useUnBlockCategory";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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

const CategoryManagement = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [name, setName] = useState("");

  // Confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "block" | "unblock";
    id: string;
    name: string;
  }>({ open: false, action: "block", id: "", name: "" });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => setPage(1), [debouncedSearch]);

  // Category hooks
  const {
    data,
    isLoading,
    refetch: refetchCategories,
  } = useListCategory({
    page,
    limit: 10,
    search: debouncedSearch,
  });

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const blockMutation = useBlockCategory();
  const unblockMutation = useUnBlockCategory();

  // Correct data extraction
  const items = data?.categoryData ?? [];
  const totalCount = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / 10));

  const resetForm = () => setName("");

  // Handlers
  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    await createCategory.mutateAsync({ name: name.trim() });
    refetchCategories();
    setCreateOpen(false);
    resetForm();
  };

  const handleEdit = async () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    await updateCategory.mutateAsync({ id: editingItem.id, payload: { name: name.trim() } });
    refetchCategories();
    setEditOpen(false);
    setEditingItem(null);
    resetForm();
  };

  const handleBlockUnblock = async () => {
    try {
      if (confirmDialog.action === "block") {
        await blockMutation.mutateAsync({ id: confirmDialog.id });
        toast.success(`${confirmDialog.name} has been blocked`);
      } else {
        await unblockMutation.mutateAsync({ id: confirmDialog.id });
        toast.success(`${confirmDialog.name} has been unblocked`);
      }
      refetchCategories();
    } catch (error: any) {
      toast.error(error?.message || "Action failed");
    } finally {
      setConfirmDialog((prev) => ({ ...prev, open: false }));
    }
  };

  const openEditDialog = (item: any) => {
    setEditingItem(item);
    setName(item.name);
    setEditOpen(true);
  };

  // Table headers
  const headers = ["No", "Name", "Status"];

  // Transform raw data → table-ready format with serial number
  const tableData = items.map((item: any, index: number) => ({
    id: item.id,
    No: (page - 1) * 10 + index + 1,
    Name: item.name,
    Status: item.isBlocked ? "Blocked" : "Active",
    isBlocked: item.isBlocked,
    rawItem: item, // keep original for actions
  }));

  const renderActions = (row: any) => {
    const item = row.rawItem;
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={item.isBlocked ? "outline" : "destructive"}
          className="bg-red-600"
          onClick={() =>
            setConfirmDialog({
              open: true,
              action: item.isBlocked ? "unblock" : "block",
              id: item.id,
              name: item.name,
            })
          }
          disabled={blockMutation.isPending || unblockMutation.isPending}
        >
          {item.isBlocked ? "Unblock" : "Block"}
        </Button>

        <Button
          size="sm"
          variant="default"
          className="bg-yellow-400"
          onClick={() => openEditDialog(item)}
        >
          Edit
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="p-6 space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Category Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your product categories</p>
          </div>

          <div className="flex gap-4 items-center w-full sm:w-auto">
            <Input
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  + Create Category
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-gray-900 dark:text-white">
                    Create New Category
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-400">
                    Add a new category to organize your products.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                  <Input
                    placeholder="Category name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    autoFocus
                  />
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreate}
                    disabled={createCategory.isPending}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    {createCategory.isPending ? "Creating..." : "Create Category"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Table */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-16">
                <p className="text-gray-500 dark:text-gray-400">Loading categories...</p>
              </div>
            ) : tableData.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <PaginatedTable
                    headers={headers}
                    data={tableData}
                    renderActions={renderActions}
                  />
                </div>

                {totalPages > 1 && (
                  <Pagination className="mt-8 justify-center">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          className={
                            page === 1
                              ? "pointer-events-none opacity-50"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                        const n = i + Math.max(1, page - 3);
                        if (n > totalPages) return null;
                        return (
                          <PaginationItem key={n}>
                            <PaginationLink
                              onClick={() => setPage(n)}
                              isActive={page === n}
                              className={
                                page === n
                                  ? "bg-blue-600 text-white"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                              }
                            >
                              {n}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          className={
                            page === totalPages
                              ? "pointer-events-none opacity-50"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl w-24 h-24 mx-auto mb-6" />
                <p className="text-xl text-gray-600 dark:text-gray-400">No categories found</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Create your first category to get started!
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">Edit Category</DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <Input
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                autoFocus
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                disabled={updateCategory.isPending}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {updateCategory.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Block/Unblock Confirmation */}
        <AlertDialog
          open={confirmDialog.open}
          onOpenChange={(o) => setConfirmDialog((prev) => ({ ...prev, open: o }))}
        >
          <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900 dark:text-white">
                {confirmDialog.action === "block" ? "Block" : "Unblock"} Category
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                Are you sure you want to <strong>{confirmDialog.action}</strong> the category{" "}
                <strong className="text-gray-900 dark:text-white">"{confirmDialog.name}"</strong>?
                This action can be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBlockUnblock}
                className={
                  confirmDialog.action === "block"
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    : "bg-green-600 hover:bg-green-700 dark:bg-green-500"
                }
              >
                {confirmDialog.action === "block" ? "Block Category" : "Unblock Category"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default CategoryManagement;

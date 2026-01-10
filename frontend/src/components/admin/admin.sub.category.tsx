"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import DataTable from "@/components/PaginatedTable";
import type { Column } from "@/components/PaginatedTable";

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

import { useListSubCategory } from "@/hooks/admin/category/sub/sub.category.list.hook";
import { useCreateSubCategory } from "@/hooks/admin/category/sub/sub.category.create.hook";
import { useUpdateSubCategory } from "@/hooks/admin/category/sub/sub.category.update.hook";
import { useBlockSubCategory } from "@/hooks/admin/category/sub/sub.category.block.hook";
import { useUnBlockSubCategory } from "@/hooks/admin/category/sub/sub.category.unblock.hook";
import { useGetCategory } from "@/hooks/shared/category.get";

/* ---------------- CONSTANTS ---------------- */

const PAGE_SIZE = 10;

/* ---------------- TYPES ---------------- */

type SubCategory = {
  id: string;
  name: string;
  isBlocked: boolean;
  category: {
    id: string;
    name: string;
  };
};

type Category = {
  id: string;
  name: string; 
  isBlocked: boolean;
}

/* ---------------- COMPONENT ---------------- */

const AdminSubCategoryManagement = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [editingItem, setEditingItem] = useState<SubCategory | null>(null);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "block" | "unblock";
    id: string;
    name: string;
  }>({
    open: false,
    action: "block",
    id: "",
    name: "",
  });

  /* ---------------- DEBOUNCE SEARCH ---------------- */

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  /* ---------------- API HOOKS ---------------- */

  const { data, isLoading, refetch } = useListSubCategory({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch,
  });

 const { data: categories, isLoading: categoriesLoading } = useGetCategory();

  const createSubCategory = useCreateSubCategory();
  const updateSubCategory = useUpdateSubCategory();
  const blockSubCategory = useBlockSubCategory();
  const unblockSubCategory = useUnBlockSubCategory();

  const items: SubCategory[] = data?.subCategoryData ?? [];
  const totalCount = data?.total ?? 0;

  /* ---------------- RESET ---------------- */

  const resetForm = () => {
    setName("");
    setCategoryId("");
  };

  useEffect(() => {
    if (!createOpen && !editOpen) {
      resetForm();
      setEditingItem(null);
    }
  }, [createOpen, editOpen]);

  /* ---------------- COLUMNS ---------------- */

  const columns: Column<SubCategory>[] = [
    {
      header: "Sub Category",
      accessor: "name",
    },
    {
      header: "Category",
      accessor: "category.name",
    },
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

  const renderActions = (item: SubCategory) => (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant={item.isBlocked ? "outline" : "destructive"}
        disabled={
          item.isBlocked
            ? unblockSubCategory.isPending
            : blockSubCategory.isPending
        }
        onClick={() =>
          setConfirmDialog({
            open: true,
            action: item.isBlocked ? "unblock" : "block",
            id: item.id,
            name: item.name,
          })
        }
      >
        {item.isBlocked ? "Unblock" : "Block"}
      </Button>

      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          setEditingItem(item);
          setName(item.name);
          setCategoryId(item.category.id);
          setEditOpen(true);
        }}
      >
        Edit
      </Button>
    </div>
  );

  /* ---------------- HANDLERS ---------------- */

  const handleCreate = async () => {
    if (!name.trim() || !categoryId) {
      toast.error("Subcategory name and category are required");
      return;
    }

    await createSubCategory.mutateAsync({
      name: name.trim(),
      categoryId,
    });

    toast.success("Subcategory created");
    setCreateOpen(false);
    refetch();
  };

  const handleEdit = async () => {
    if (!editingItem || !name.trim() || !categoryId) {
      toast.error("All fields are required");
      return;
    }

    await updateSubCategory.mutateAsync({
      id: editingItem.id,
      payload: {
        name: name.trim(),
        categoryId,
      },
    });

    toast.success("Subcategory updated");
    setEditOpen(false);
    refetch();
  };

  const handleBlockUnblock = async () => {
    if (confirmDialog.action === "block") {
      await blockSubCategory.mutateAsync({ id: confirmDialog.id });
      toast.success("Subcategory blocked");
    } else {
      await unblockSubCategory.mutateAsync({ id: confirmDialog.id });
      toast.success("Subcategory unblocked");
    }

    setConfirmDialog((p) => ({ ...p, open: false }));
    refetch();
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Sub Category Management</h1>
            <p className="text-gray-500">
              Manage subcategories and their parent categories
            </p>
          </div>

          <div className="flex gap-3">
            <Input
              placeholder="Search subcategories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button>Create Sub Category</Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Sub Category</DialogTitle>
                </DialogHeader>

                <Input
                  placeholder="Subcategory name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <select
                  className="border rounded px-3 py-2"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories && categories.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate}>
                    {createSubCategory.isPending ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <DataTable<SubCategory>
          columns={columns}
          data={items}
          page={page}
          pageSize={PAGE_SIZE}
          total={totalCount}
          rowKey={(row) => row.id}
          onPageChange={setPage}
          renderActions={renderActions}
          isLoading={isLoading}
          emptyState={
            <p className="text-center py-10">No subcategories found</p>
          }
        />

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Sub Category</DialogTitle>
            </DialogHeader>

            <Input value={name} onChange={(e) => setName(e.target.value)} />

            <select
              className="border rounded px-3 py-2"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories && categories.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit}>
                {updateSubCategory.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={confirmDialog.open}
          onOpenChange={(o) =>
            setConfirmDialog((p) => ({ ...p, open: o }))
          }
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmDialog.action === "block" ? "Block" : "Unblock"} Sub
                Category
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

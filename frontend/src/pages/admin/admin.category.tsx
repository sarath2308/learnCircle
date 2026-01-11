import AdminCategoryManagement from "@/components/admin/admin.category";
import AdminSubCategoryManagement from "@/components/admin/admin.sub.category";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { vi } from "zod/v4/locales";

  type ViewMode = "category" | "subcategory";

export default function CategoryManagement(){

const [view, setView] = useState<ViewMode>("category"); // DEFAULT

  return(
    <>
    <div className="flex gap-2 mb-4 mt-9">
  <Button
  className={ view === "category" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800" }
    variant={view === "category" ? "default" : "outline"}
    onClick={() => setView("category")}
  >
    Category
  </Button>

  <Button
  className={ view === "subcategory" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800" }
    variant={view === "subcategory" ? "default" : "outline"}
    onClick={() => setView("subcategory")}
  >
    Sub Category
  </Button>
</div>
    {view === "category" ? <AdminCategoryManagement /> : <AdminSubCategoryManagement />}
    
    </>
  )
}
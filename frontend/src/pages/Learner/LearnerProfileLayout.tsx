import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { LearnerProfileSidebar } from "../../components/LearnerProfileSidebar";

export default function LearnerProfileLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <LearnerProfileSidebar />
        <div className="flex-1">
          <header className="h-12 flex items-center border-b bg-card px-4">
            <SidebarTrigger />
            <h2 className="ml-4 text-lg font-semibold">Profile Management</h2>
          </header>
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

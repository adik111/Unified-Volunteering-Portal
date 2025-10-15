import Sidebar from "@/components/UserSidebar";

export default function VolunteerLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 fixed h-screen z-10">
        <Sidebar role="volunteer" />
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-20">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

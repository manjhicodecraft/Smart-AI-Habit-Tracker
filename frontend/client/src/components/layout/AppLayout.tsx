import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Home, Target, MessageCircle, BarChart2, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/habits", label: "My Habits", icon: Target },
  { href: "/ai-coach", label: "AI Coach", icon: MessageCircle },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-body">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r-2 border-slate-200 bg-white fixed h-full z-10">
        <div className="p-6 pb-2">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-[0_3px_0_0_hsl(142,71%,35%)]">
              <Target className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-primary">HabitAI</h1>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all text-[15px]",
                  isActive
                    ? "bg-primary/10 text-primary border-2 border-primary/20"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700 border-2 border-transparent"
                )}
              >
                <item.icon className={cn("w-6 h-6", isActive ? "text-primary" : "text-slate-400")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t-2 border-slate-100">
          <div className="flex items-center gap-3 px-2 py-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-slate-300">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt={user.firstName || "User"} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.firstName || user?.email || "User"}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-4 px-4 py-3 rounded-2xl font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all border-2 border-transparent hover:border-red-100"
          >
            <LogOut className="w-6 h-6 text-slate-400" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 flex justify-around p-2 z-50 safe-area-bottom pb-4">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center p-2 rounded-xl min-w-[64px]",
                isActive ? "text-primary" : "text-slate-400"
              )}
            >
              <item.icon className={cn("w-6 h-6 mb-1", isActive && "fill-primary/20")} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

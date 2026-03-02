import { useAuth } from "@/hooks/use-auth";
import { useHabits } from "@/hooks/use-habits";
import { useDashboardAnalytics } from "@/hooks/use-analytics";
import { HabitCard } from "@/components/habits/HabitCard";
import { CreateHabitDialog } from "@/components/habits/CreateHabitDialog";
import { GamifiedButton } from "@/components/ui/gamified-button";
import { Plus, Target, Flame, Activity, Clock } from "lucide-react";
import Landing from "./Landing";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { data: habits, isLoading: isHabitsLoading } = useHabits();
  const { data: analytics, isLoading: isAnalyticsLoading } = useDashboardAnalytics();

  if (isAuthLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!isAuthenticated) return <Landing />;

  const isLoading = isHabitsLoading || isAnalyticsLoading;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-slate-800">
            Welcome back, {user?.firstName || user?.email?.split('@')[0] || "Achiever"}! 👋
          </h1>
          <p className="text-slate-500 font-medium mt-1">Let's keep those streaks alive today.</p>
        </div>
        <CreateHabitDialog>
          <GamifiedButton className="w-full md:w-auto">
            <Plus className="w-5 h-5 mr-2" /> New Habit
          </GamifiedButton>
        </CreateHabitDialog>
      </header>

      {/* Analytics Summary */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-gamified p-4 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center mb-2">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <div className="text-2xl font-bold font-display text-slate-800">{analytics.activeStreak}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Streak</div>
          </div>
          <div className="card-gamified p-4 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-xl flex items-center justify-center mb-2">
              <Target className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold font-display text-slate-800">{analytics.activeHabits}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Goals</div>
          </div>
          <div className="card-gamified p-4 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-green-100 text-green-500 rounded-xl flex items-center justify-center mb-2">
              <Activity className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold font-display text-slate-800">{analytics.completionRate}%</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completion</div>
          </div>
          <div className="card-gamified p-4 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-purple-100 text-purple-500 rounded-xl flex items-center justify-center mb-2">
              <Clock className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold font-display text-slate-800">{Math.round(analytics.totalTimeInvested / 60)}h</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Invested</div>
          </div>
        </div>
      )}

      {/* Habits List */}
      <div>
        <h2 className="text-xl font-bold font-display mb-4 text-slate-700">Your Quests</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-200 rounded-3xl animate-pulse" />)}
          </div>
        ) : !habits?.length ? (
          <div className="card-gamified p-12 text-center flex flex-col items-center border-dashed border-4 border-slate-200 bg-transparent shadow-none">
            <Target className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold font-display text-slate-600 mb-2">No active habits</h3>
            <p className="text-slate-400 font-medium mb-6">Every expert was once a beginner. Start your first quest.</p>
            <CreateHabitDialog>
              <GamifiedButton variant="secondary">Create a Habit</GamifiedButton>
            </CreateHabitDialog>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {habits.map(habit => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

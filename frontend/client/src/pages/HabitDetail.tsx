import { useState } from "react";
import { useParams, Link } from "wouter";
import { useHabit, useHabitRoadmap, useHabitLogs } from "@/hooks/use-habits";
import { GamifiedButton } from "@/components/ui/gamified-button";
import { LogHabitDialog } from "@/components/habits/LogHabitDialog";
import { ChevronLeft, Flame, Clock, CalendarDays, CheckCircle2, Circle } from "lucide-react";
import { format, parseISO } from "date-fns";

export default function HabitDetail() {
  const { id } = useParams<{ id: string }>();
  const habitId = parseInt(id);
  
  const { data: habit, isLoading: habitLoading } = useHabit(habitId);
  const { data: roadmap, isLoading: roadmapLoading } = useHabitRoadmap(habitId);
  const { data: logs, isLoading: logsLoading } = useHabitLogs(habitId);

  const [activeTab, setActiveTab] = useState<"roadmap" | "history">("roadmap");
  const [logModalOpen, setLogModalOpen] = useState(false);

  if (habitLoading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!habit) return <div className="text-center py-20 font-bold text-slate-500">Habit not found</div>;

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const hasLoggedToday = logs?.some(log => log.date === todayStr);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
      <Link href="/habits" className="inline-flex items-center text-slate-400 hover:text-slate-700 font-bold mb-2 transition-colors">
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Quests
      </Link>

      <div className="card-gamified p-6 md:p-8 bg-gradient-to-br from-white to-slate-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border-2 bg-blue-100 text-blue-700 border-blue-200">
                {habit.level}
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border-2 bg-slate-100 text-slate-600 border-slate-200">
                {habit.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold font-display text-slate-800">{habit.name}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-orange-500 font-bold bg-orange-50 px-4 py-2 rounded-2xl border-2 border-orange-100">
                <Flame className="w-6 h-6 fill-current" />
                <span className="text-lg">{habit.streak} Day Streak</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-bold bg-white px-4 py-2 rounded-2xl border-2 border-slate-200 shadow-sm">
                <Clock className="w-5 h-5" />
                <span>{habit.goalDuration}m daily</span>
              </div>
            </div>
          </div>

          <GamifiedButton 
            size="lg" 
            className="md:w-auto w-full text-lg" 
            variant={hasLoggedToday ? "outline" : "primary"}
            onClick={() => setLogModalOpen(true)}
            disabled={hasLoggedToday}
          >
            {hasLoggedToday ? (
              <><CheckCircle2 className="w-6 h-6 mr-2 text-green-500" /> Done Today</>
            ) : (
              "Log Progress"
            )}
          </GamifiedButton>
        </div>
      </div>

      <div className="flex border-b-2 border-slate-200 mb-6">
        <button 
          onClick={() => setActiveTab("roadmap")}
          className={`pb-3 px-6 font-bold text-lg border-b-4 transition-colors ${activeTab === 'roadmap' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          AI Roadmap
        </button>
        <button 
          onClick={() => setActiveTab("history")}
          className={`pb-3 px-6 font-bold text-lg border-b-4 transition-colors ${activeTab === 'history' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          History
        </button>
      </div>

      {activeTab === 'roadmap' && (
        <div className="space-y-4">
          {roadmapLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-200 rounded-2xl animate-pulse" />)}
            </div>
          ) : roadmap?.length ? (
            roadmap.map(step => (
              <div key={step.id} className={`card-gamified p-5 flex items-center gap-4 ${step.isCompleted ? 'opacity-50 bg-slate-50' : 'bg-white'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 ${step.isCompleted ? 'bg-green-100 border-green-200 text-green-500' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                  {step.isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold">{step.dayNumber}</span>}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold ${step.isCompleted ? 'line-through text-slate-500' : 'text-slate-800'}`}>{step.task}</h4>
                  <p className="text-sm font-medium text-slate-400 mt-1"><Clock className="w-3 h-3 inline mr-1 -mt-0.5" />{step.duration} mins</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 card-gamified bg-slate-50 border-dashed">
              <p className="text-slate-500 font-bold">No roadmap generated yet.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          {logsLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="h-16 bg-slate-200 rounded-2xl animate-pulse" />)}
            </div>
          ) : logs?.length ? (
            <div className="card-gamified overflow-hidden border-2">
              <div className="divide-y-2 divide-slate-100">
                {logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(log => (
                  <div key={log.id} className="p-4 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                        <CalendarDays className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{format(parseISO(log.date), 'MMM d, yyyy')}</div>
                        <div className="text-sm font-medium text-slate-500">Invested {log.durationInvested} mins</div>
                      </div>
                    </div>
                    {log.isCompleted ? (
                      <div className="flex items-center gap-1.5 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full border-2 border-green-100">
                        <CheckCircle2 className="w-4 h-4" /> Done
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-full border-2 border-slate-200">
                        <Circle className="w-4 h-4" /> Partial
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 card-gamified bg-slate-50 border-dashed">
              <p className="text-slate-500 font-bold">No history logged yet. Start today!</p>
            </div>
          )}
        </div>
      )}

      <LogHabitDialog habit={habit} open={logModalOpen} onOpenChange={setLogModalOpen} />
    </div>
  );
}

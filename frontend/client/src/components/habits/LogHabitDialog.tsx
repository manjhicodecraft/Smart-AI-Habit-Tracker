import { useState } from "react";
import { Habit } from "@shared/schema";
import { useLogHabit } from "@/hooks/use-habits";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GamifiedButton } from "@/components/ui/gamified-button";
import { CheckCircle2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import confetti from "canvas-confetti";

interface LogHabitDialogProps {
  habit: Habit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogHabitDialog({ habit, open, onOpenChange }: LogHabitDialogProps) {
  const { mutate: logHabit, isPending } = useLogHabit(habit.id);
  const { toast } = useToast();
  
  const [duration, setDuration] = useState(habit.goalDuration);
  const [completed, setCompleted] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    logHabit(
      {
        date: format(new Date(), 'yyyy-MM-dd'),
        durationInvested: duration,
        isCompleted: completed
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          if (completed) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#22c55e', '#3b82f6', '#f59e0b']
            });
            toast({ title: "Great job!", description: "Progress logged successfully. Streak updated!" });
          } else {
            toast({ title: "Logged", description: "Progress saved. Keep going!" });
          }
        },
        onError: (err) => {
          toast({ title: "Error", description: err.message, variant: "destructive" });
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 border-0 bg-transparent shadow-none">
        <div className="bg-white rounded-3xl border-4 border-slate-200 overflow-hidden shadow-2xl">
          <div className="bg-green-50 p-6 flex items-start justify-between border-b-2 border-green-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-[0_4px_0_0_hsl(142,71%,35%)]">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <DialogTitle className="text-xl font-display text-green-700">Log Progress</DialogTitle>
            </div>
            <button onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="text-center">
              <h3 className="font-bold text-slate-800 text-lg">{habit.name}</h3>
              <p className="text-slate-500 text-sm mt-1">Today's goal: {habit.goalDuration} mins</p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider block text-center">
                Time Invested
              </label>
              <div className="flex items-center justify-center gap-4">
                <button 
                  type="button"
                  onClick={() => setDuration(Math.max(5, duration - 5))}
                  className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 font-bold text-xl border-2 border-slate-200 hover:bg-slate-200 active:scale-95 transition-all"
                >
                  -
                </button>
                <div className="w-24 text-center font-bold text-3xl text-primary">
                  {duration}<span className="text-lg text-slate-400">m</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setDuration(duration + 5)}
                  className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 font-bold text-xl border-2 border-slate-200 hover:bg-slate-200 active:scale-95 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 flex items-center justify-between cursor-pointer" onClick={() => setCompleted(!completed)}>
              <span className="font-bold text-slate-700">Mark as completed</span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${completed ? 'bg-primary border-primary text-white' : 'bg-white border-slate-300 text-transparent'}`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <GamifiedButton type="submit" className="w-full" size="lg" disabled={isPending}>
              {isPending ? "Saving..." : "Save Progress"}
            </GamifiedButton>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

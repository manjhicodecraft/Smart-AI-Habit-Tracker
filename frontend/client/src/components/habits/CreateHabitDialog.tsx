import { useState } from "react";
import { z } from "zod";
import { insertHabitSchema } from "@shared/schema";
import { useCreateHabit } from "@/hooks/use-habits";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GamifiedButton } from "@/components/ui/gamified-button";
import { Target, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CreateHabitDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { mutate: createHabit, isPending } = useCreateHabit();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    level: "beginner",
    category: "skill",
    goalDuration: 15,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validData = insertHabitSchema.parse({
        ...formData,
        goalDuration: Number(formData.goalDuration),
      });
      
      createHabit(validData, {
        onSuccess: () => {
          toast({ title: "Awesome!", description: "New habit created successfully." });
          setOpen(false);
          setFormData({ name: "", level: "beginner", category: "skill", goalDuration: 15 });
        },
        onError: (err) => {
          toast({ title: "Oops", description: err.message, variant: "destructive" });
        }
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({ title: "Validation Error", description: err.errors[0].message, variant: "destructive" });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 border-0 bg-transparent shadow-none">
        <div className="bg-white rounded-3xl border-4 border-slate-200 overflow-hidden shadow-2xl">
          <div className="bg-primary/10 p-6 flex items-start justify-between border-b-2 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-[0_4px_0_0_hsl(142,71%,35%)]">
                <Target className="w-7 h-7" />
              </div>
              <DialogTitle className="text-2xl font-display text-primary">New Habit</DialogTitle>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">I want to learn/do...</label>
              <input
                autoFocus
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200 text-lg font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all"
                placeholder="e.g. Learn Spanish, Read more"
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Level</label>
                <select
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200 font-bold text-slate-700 focus:outline-none focus:border-primary appearance-none"
                  value={formData.level}
                  onChange={(e) => setFormData(p => ({ ...p, level: e.target.value }))}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Category</label>
                <select
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200 font-bold text-slate-700 focus:outline-none focus:border-primary appearance-none"
                  value={formData.category}
                  onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                >
                  <option value="skill">New Skill</option>
                  <option value="health">Health & Fitness</option>
                  <option value="mind">Mindfulness</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Daily Goal (Minutes)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  className="flex-1 accent-primary"
                  value={formData.goalDuration}
                  onChange={(e) => setFormData(p => ({ ...p, goalDuration: Number(e.target.value) }))}
                />
                <div className="w-16 text-center font-bold text-xl text-primary bg-primary/10 py-1 rounded-xl">
                  {formData.goalDuration}
                </div>
              </div>
            </div>

            <GamifiedButton type="submit" className="w-full mt-4" size="lg" disabled={isPending}>
              {isPending ? "Creating..." : "Start Journey!"}
            </GamifiedButton>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

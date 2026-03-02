import { Habit } from "@shared/schema";
import { Link } from "wouter";
import { Flame, Clock, ChevronRight } from "lucide-react";

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const levelColors = {
    beginner: "bg-green-100 text-green-700 border-green-200",
    intermediate: "bg-blue-100 text-blue-700 border-blue-200",
    advanced: "bg-purple-100 text-purple-700 border-purple-200",
  };

  return (
    <Link
      href={`/habits/${habit.id}`}
      className="block card-gamified p-5 hover:-translate-y-1 hover:shadow-[0_6px_0_0_hsl(var(--border))] active:translate-y-0 active:shadow-[0_2px_0_0_hsl(var(--border))] group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border-2 ${levelColors[habit.level as keyof typeof levelColors]}`}>
              {habit.level}
            </span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border-2 bg-slate-100 text-slate-600 border-slate-200">
              {habit.category}
            </span>
          </div>
          <h3 className="text-xl font-display font-bold text-slate-800 line-clamp-1">{habit.name}</h3>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary" />
        </div>
      </div>

      <div className="flex items-center gap-4 mt-auto">
        <div className="flex items-center gap-1.5 text-orange-500 font-bold bg-orange-50 px-3 py-1.5 rounded-xl border-2 border-orange-100">
          <Flame className="w-5 h-5 fill-current" />
          <span>{habit.streak} Day{habit.streak !== 1 ? 's' : ''}</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-slate-500 font-bold bg-slate-50 px-3 py-1.5 rounded-xl border-2 border-slate-100">
          <Clock className="w-4 h-4" />
          <span>{habit.goalDuration}m / day</span>
        </div>
      </div>
    </Link>
  );
}

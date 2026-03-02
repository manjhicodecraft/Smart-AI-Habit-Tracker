import { GamifiedButton } from "@/components/ui/gamified-button";
import { Brain, Target, Flame, ChevronRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 font-body text-slate-900 flex flex-col">
      {/* Navbar */}
      <header className="w-full fixed top-0 bg-white/80 backdrop-blur-md border-b-2 border-slate-100 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-[0_2px_0_0_hsl(142,71%,35%)]">
              <Target className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold font-display text-primary tracking-tight">HabitAI</span>
          </div>
          <GamifiedButton size="sm" onClick={() => window.location.href = '/habits'}>
            Open App
          </GamifiedButton>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 pt-24 pb-16 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-600 font-bold text-sm mb-6 border-2 border-orange-200">
            <Flame className="w-4 h-4 fill-current" />
            Level up your life
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold font-display tracking-tight text-slate-800 leading-tight mb-6">
            Build habits with an <span className="text-primary">AI Coach</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium mb-10 max-w-2xl mx-auto">
            Stop giving up on your goals. HabitAI gamifies your progress and gives you personalized strategies to stay on track.
          </p>
          <GamifiedButton 
            size="lg" 
            className="text-lg px-10 py-5 rounded-3xl"
            onClick={() => window.location.href = '/habits'}
          >
            Start Your Journey <ChevronRight className="ml-2 w-5 h-5" />
          </GamifiedButton>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24">
          <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-[0_8px_0_0_hsl(214,32%,91%)] text-left hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-display mb-3">Track Anything</h3>
            <p className="text-slate-500 font-medium">From reading daily to learning Python, build custom roadmaps for any goal.</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-[0_8px_0_0_hsl(214,32%,91%)] text-left hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
              <Flame className="w-8 h-8 fill-current" />
            </div>
            <h3 className="text-2xl font-bold font-display mb-3">Gamified Streaks</h3>
            <p className="text-slate-500 font-medium">Keep your flame alive. Earn XP, maintain streaks, and visually see your progress.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-[0_8px_0_0_hsl(214,32%,91%)] text-left hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-purple-100 text-purple-500 rounded-2xl flex items-center justify-center mb-6">
              <Brain className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-display mb-3">AI Coaching</h3>
            <p className="text-slate-500 font-medium">Struggling? Your AI coach gives you motivational boosts and actionable advice.</p>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 font-medium border-t-2 border-slate-200 mt-auto">
        <p>© {new Date().getFullYear()} HabitAI. Level up daily.</p>
      </footer>
    </div>
  );
}

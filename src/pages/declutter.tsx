import { useCleaning } from '@/contexts/CleaningProvider';
import { Navigation } from '@/components/Navigation';
import { Check, Calendar, Trophy } from 'lucide-react';

export default function DeclutterPage() {
  const { declutterDays, updateDeclutterDay } = useCleaning();

  const completedCount = declutterDays.filter(d => d.completed).length;
  const progress = Math.round((completedCount / 30) * 100);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:pt-20">
      <Navigation />
      
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Calendar className="w-16 h-16 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display text-neon-pink mb-2">
            30-Day Declutter Challenge
          </h1>
          <p className="text-neon-cyan mb-4">One small space at a time, chaos goblin style!</p>
          
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-foreground">Challenge Progress</span>
              <span className="text-2xl font-bold text-neon-lime">{progress}%</span>
            </div>
            <div className="h-4 bg-muted rounded-full border-2 border-accent overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Day {completedCount} of 30 complete
            </div>
          </div>

          {progress === 100 && (
            <div className="mt-4 flex items-center justify-center gap-2 text-accent text-xl">
              <Trophy className="w-6 h-6" />
              <span className="font-bold">DECLUTTER CHAMPION!</span>
              <Trophy className="w-6 h-6" />
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {declutterDays.map((day) => (
            <div
              key={day.day}
              className={`
                group bg-card rounded-lg p-5 border-2 transition-all cursor-pointer
                ${day.completed 
                  ? 'border-accent/50 bg-accent/5' 
                  : 'border-muted hover:border-secondary'
                }
              `}
              onClick={() => updateDeclutterDay(day.day, !day.completed)}
            >
              <div className="flex items-start gap-3">
                <button
                  className={`
                    mt-1 w-7 h-7 rounded border-2 flex items-center justify-center flex-shrink-0
                    transition-all duration-300
                    ${day.completed
                      ? 'bg-accent border-accent'
                      : 'border-secondary group-hover:border-primary group-hover:bg-primary/10'
                    }
                  `}
                >
                  {day.completed && <Check className="w-5 h-5 text-black" />}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`
                      text-sm font-bold px-2 py-1 rounded
                      ${day.completed ? 'bg-accent text-black' : 'bg-primary text-white'}
                    `}>
                      Day {day.day}
                    </span>
                  </div>
                  <h3 className={`
                    text-lg font-display mb-1 transition-all
                    ${day.completed ? 'line-through text-muted-foreground' : 'text-foreground'}
                  `}>
                    {day.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {day.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
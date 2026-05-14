import { useCleaning } from '@/contexts/CleaningProvider';
import { Navigation } from '@/components/Navigation';
import { useState } from 'react';
import { Check, Calendar, Trophy, Edit2, X, Save, PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function DeclutterPage() {
  const { declutterDays, updateDeclutterDay, editDeclutterDay } = useCleaning();
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const completedCount = declutterDays.filter(d => d.completed).length;
  const progress = Math.round((completedCount / 30) * 100);

  const handleStartEdit = (day: number, currentTitle: string, currentDescription: string) => {
    setEditingDay(day);
    setEditTitle(currentTitle);
    setEditDescription(currentDescription);
  };

  const handleSaveEdit = () => {
    if (editingDay && editTitle.trim()) {
      editDeclutterDay(editingDay, editTitle.trim(), editDescription.trim());
      setEditingDay(null);
      setEditTitle('');
      setEditDescription('');
    }
  };

  const handleCancelEdit = () => {
    setEditingDay(null);
    setEditTitle('');
    setEditDescription('');
  };

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
          {declutterDays.map((day) => {
            const isEditing = editingDay === day.day;

            return (
              <div
                key={day.day}
                className={`
                  group bg-card rounded-lg p-5 border-2 transition-all
                  ${day.completed 
                    ? 'border-accent/50 bg-accent/5' 
                    : 'border-muted hover:border-secondary'
                  }
                `}
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold px-2 py-1 rounded bg-primary text-white">
                        Day {day.day}
                      </span>
                    </div>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Challenge title"
                      className="bg-background border-secondary"
                    />
                    <Textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description"
                      className="bg-background border-secondary resize-none"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                        className="flex-1 bg-accent text-black hover:bg-accent/80"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="border-destructive text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => updateDeclutterDay(day.day, !day.completed)}
                      className={`
                        mt-1 w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        transition-all duration-300
                        ${day.completed
                          ? 'bg-accent border-accent scale-110'
                          : 'border-secondary group-hover:border-primary group-hover:bg-primary/10'
                        }
                      `}
                    >
                      {day.completed && <PawPrint className="w-5 h-5 text-black" />}
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
                        text-lg font-display mb-1 transition-all relative
                        ${day.completed ? 'text-muted-foreground' : 'text-foreground'}
                      `}>
                        {day.completed && (
                          <span className="absolute inset-0 flex items-center">
                            <span className="w-full h-0.5 bg-accent/60 rotate-[-2deg]"></span>
                          </span>
                        )}
                        {day.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {day.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleStartEdit(day.day, day.title, day.description)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-secondary/20 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-secondary" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
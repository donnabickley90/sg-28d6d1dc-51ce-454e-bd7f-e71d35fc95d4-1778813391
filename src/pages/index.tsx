import { useCleaning } from '@/contexts/CleaningProvider';
import Link from 'next/link';
import { Sparkles, Award } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const { rooms, getProgress, getOverallProgress } = useCleaning();
  const overallProgress = getOverallProgress();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-secondary/10 via-transparent to-transparent pointer-events-none blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32 rounded-full border-4 border-primary shadow-lg shadow-primary/50">
              <Image
                src="/kitten-avatar.png"
                alt="Chaos Kitten Avatar"
                fill
                className="object-cover rounded-full"
                priority
              />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display text-neon-pink mb-4 animate-glow-pulse">
            KITTENS CLEANING CHAOS
          </h1>
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-accent" />
            <p className="text-xl md:text-2xl text-neon-cyan">
              Your Chaos Goblin Spring Cleaning Quest
            </p>
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
          <p className="text-lg text-primary/80 font-bold italic mb-6">
            cute. feral. claimed.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold text-foreground">Overall Progress</span>
              <span className="text-2xl font-bold text-neon-lime">{overallProgress}%</span>
            </div>
            <div className="h-8 bg-muted rounded-lg border-2 border-primary overflow-hidden shadow-lg shadow-primary/30">
              <div
                className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            {overallProgress === 100 && (
              <div className="mt-4 flex items-center justify-center gap-2 text-accent text-xl">
                <Award className="w-6 h-6" />
                <span className="font-bold">CHAOS GOBLIN MASTER!</span>
                <Award className="w-6 h-6" />
              </div>
            )}
          </div>
        </header>
      </div>
    </div>
  )
}

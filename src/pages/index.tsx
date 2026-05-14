import { useCleaning } from '@/contexts/CleaningProvider';
import { Navigation } from '@/components/Navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Award, Edit2, Check, X, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

const KITTEN_QUOTES = [
"Good kittens keep their collars clean... and the floors cleaner. Make Daddy proud. 🐾",
"A messy room means no treats. Show me how obedient my little pet can be. 🖤",
"Scrub until you earn that 'good girl'. Daddy's watching. 👀",
"The collar stays on, but the dust must go. Get on your knees and clean. 🧹",
"Daddy loves a spotless house. Don't make him punish his favorite kitten. 😼",
"Beg for his praise by making these floors shine. Good pets do their chores. ✨",
"Earning your headpats requires a clean kitchen. Hop to it, kitten. 😻",
"Submission isn't just in the bedroom; it's doing the dishes without being asked. 🍽️",
"A good pet anticipates Daddy's needs. And Daddy needs a clean house. 🏠",
"Show him you belong to him by taking care of his territory. 🖤",
"Purr for his approval. Work for his praise. Clean for his satisfaction. 🐾",
"Those knees aren't just for begging—use them to scrub the floor, little kitten. 🧽",
"Daddy's good girl keeps her toys put away when she's done playing. 🧸",
"Want him to scratch behind your ears? Show him a spotless bathroom first. 🛁",
"Your obedience is beautiful, but a clean house is even better. Get to work. 🧹",
"Show Daddy what a good, diligent pet you are. Make it sparkle. ✨",
"A clean collar and a clean house—the hallmarks of a perfect kitten. 🎀",
"Kneel and scrub, little one. Daddy's rewards are worth the effort. 🖤",
"The best kittens do their chores with a purr and a smile. 😺",
"Make Daddy proud of his little pet. Conquer this chaos! 🧹"];


export default function Home() {
  const { rooms, getProgress, updateRoomName } = useCleaning();
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [currentQuote, setCurrentQuote] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentQuote(KITTEN_QUOTES[Math.floor(Math.random() * KITTEN_QUOTES.length)]);
  }, []);

  const handleStartEdit = (roomId: string, currentName: string) => {
    setEditingRoomId(roomId);
    setEditingName(currentName);
  };

  const handleSaveEdit = () => {
    if (editingRoomId && editingName.trim()) {
      updateRoomName(editingRoomId, editingName.trim());
      setEditingRoomId(null);
      setEditingName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingRoomId(null);
    setEditingName('');
  };

  const generateNewQuote = () => {
    let newQuote;
    do {
      newQuote = KITTEN_QUOTES[Math.floor(Math.random() * KITTEN_QUOTES.length)];
    } while (newQuote === currentQuote && KITTEN_QUOTES.length > 1);
    setCurrentQuote(newQuote);
  };

  const totalTasks = rooms.reduce((acc, room) => acc + room.tasks.length, 0);
  const completedTasks = rooms.reduce(
    (acc, room) => acc + room.tasks.filter((t) => t.completed).length,
    0
  );

  const earnedRewards = rooms.filter((room) => getProgress(room.id) === 100);
  const totalPoints = earnedRewards.reduce((acc, room) => acc + room.reward.points, 0);
  const overallProgress = totalTasks === 0 ? 0 : Math.round(completedTasks / totalTasks * 100);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:pt-20 relative overflow-hidden">
      <Navigation />
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-secondary/10 via-transparent to-transparent pointer-events-none blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10 p-4 md:p-8">
        <header className="text-center mb-8 md:mb-12">
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-primary shadow-lg shadow-primary/50 animate-glow-pulse">
              <Image
                src="/kitten-avatar.png"
                alt="Chaos Kitten Avatar"
                fill
                className="object-cover rounded-full"
                priority />
              
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display text-neon-pink mb-3 md:mb-4 animate-glow-pulse px-2">
            KITTENS CLEANING CHAOS
          </h1>
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 px-2">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-accent flex-shrink-0" />
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-neon-cyan">
              Your Chaos Goblin Spring Cleaning Quest
            </p>
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-accent flex-shrink-0" />
          </div>
          <p className="text-sm md:text-lg text-primary/80 font-bold italic mb-4 md:mb-6">
            cute. feral. claimed.
          </p>

          <div className="flex justify-center gap-4 md:gap-8 mb-4 md:mb-6">
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold text-neon-lime mb-1">{totalPoints}</div>
              <div className="text-xs md:text-sm text-muted-foreground">CHAOS POINTS</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold text-neon-cyan mb-1">{earnedRewards.length}</div>
              <div className="text-xs md:text-sm text-muted-foreground">ROOMS COMPLETE</div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm md:text-lg font-bold text-foreground">Overall Progress</span>
              <span className="text-xl md:text-2xl font-bold text-neon-lime">{overallProgress}%</span>
            </div>
            <div className="h-6 md:h-8 bg-muted rounded-lg border-2 border-primary overflow-hidden shadow-lg shadow-primary/30">
              <div
                className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500"
                style={{ width: `${overallProgress}%` }} />
              
            </div>
            {overallProgress === 100 &&
            <div className="mt-3 md:mt-4 flex items-center justify-center gap-2 text-accent text-base md:text-xl">
                <Award className="w-5 h-5 md:w-6 md:h-6" />
                <span className="font-bold">CHAOS GOBLIN MASTER!</span>
                <Award className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            }
          </div>
        </header>

        {/* Kitten Motivation Quote Generator */}
        <div className="max-w-3xl mx-auto mb-8 md:mb-12 px-2">
          <div className="relative bg-card border-2 border-primary rounded-lg p-6 md:p-8 shadow-lg shadow-primary/20">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-black px-4 py-1 rounded-full text-xs md:text-sm font-bold border-2 border-background">🐱 GOOD GIRL CODE 🐱

            </div>
            
            <p className="text-base sm:text-lg md:text-xl text-center text-foreground font-bold leading-relaxed mb-6 mt-2 min-h-[4rem] flex items-center justify-center">
              {isClient ? `"${currentQuote}"` : "..."}
            </p>
            
            <div className="flex justify-center">
              <Button
                onClick={generateNewQuote}
                className="bg-secondary hover:bg-secondary/80 text-black font-bold group">
                
                <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                New Wisdom
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {rooms.map((room) => {
            const progress = getProgress(room.id);
            const isComplete = progress === 100;
            const isEditing = editingRoomId === room.id;

            return (
              <div key={room.id} className="group">
                <Link
                  href={`/room/${room.id}`}
                  className={`
                    block relative bg-card rounded-lg p-4 md:p-6 border-2 transition-all duration-300
                    active:scale-95 md:hover:scale-105 cursor-pointer
                    ${isComplete ?
                  'border-neon-lime' :
                  'border-neon-cyan hover:border-neon-pink'}
                  `
                  }
                  onClick={(e) => {
                    if (isEditing) {
                      e.preventDefault();
                    }
                  }}>
                  
                  {isComplete &&
                  <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-accent text-black rounded-full p-1.5 md:p-2 animate-bounce">
                      <Award className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                  }

                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-3xl md:text-4xl mb-2">{room.emoji}</div>
                      {isEditing ?
                      <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
                          <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          className="bg-background border-secondary text-sm md:text-base"
                          autoFocus />
                        
                          <Button
                          size="sm"
                          onClick={handleSaveEdit}
                          className="bg-accent text-black hover:bg-accent/80 flex-shrink-0">
                          
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="border-destructive text-destructive flex-shrink-0">
                          
                            <X className="w-4 h-4" />
                          </Button>
                        </div> :

                      <div className="flex items-center gap-2">
                          <h2 className="text-lg md:text-2xl font-display text-foreground truncate">
                            {room.name}
                          </h2>
                          <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleStartEdit(room.id, room.name);
                          }}
                          className="opacity-0 md:group-hover:opacity-100 transition-opacity p-1 hover:bg-secondary/20 rounded flex-shrink-0">
                          
                            <Edit2 className="w-4 h-4 text-secondary" />
                          </button>
                        </div>
                      }
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className={`text-2xl md:text-3xl font-bold ${
                      isComplete ? 'text-neon-lime' : 'text-neon-cyan'}`
                      }>
                        {progress}%
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground">
                        {room.tasks.filter((t) => t.completed).length}/{room.tasks.length}
                      </div>
                      {isComplete &&
                      <div className="text-xs text-accent font-bold mt-1">
                          +{room.reward.points}pts
                        </div>
                      }
                    </div>
                  </div>

                  <div className="h-2.5 md:h-3 bg-muted rounded-full border border-border overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                      isComplete ?
                      'bg-accent' :
                      'bg-gradient-to-r from-secondary to-primary'}`
                      }
                      style={{ width: `${progress}%` }} />
                    
                  </div>

                  <div className="mt-3 md:mt-4 text-center">
                    <span className="text-xs md:text-sm font-bold text-primary group-hover:text-secondary transition-colors">
                      TAP TO CLEAN →
                    </span>
                  </div>
                </Link>
              </div>);

          })}
        </div>
      </div>
    </div>);

}
import { useCleaning } from '@/contexts/CleaningProvider';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Check, X, Edit2, Award, PartyPopper, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

export default function RoomPage() {
  const router = useRouter();
  const { roomId } = router.query;
  const { rooms, updateTask, addTask, deleteTask, editTask, getProgress, updateReward } = useCleaning();
  
  const [newTaskText, setNewTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [showRewardEditor, setShowRewardEditor] = useState(false);
  const [rewardMessage, setRewardMessage] = useState('');
  const [rewardPoints, setRewardPoints] = useState(0);
  const [rewardCelebration, setRewardCelebration] = useState('');

  const room = rooms.find((r) => r.id === roomId);

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-display text-neon-pink mb-4">Room Not Found</h1>
          <Link href="/">
            <Button variant="outline" className="border-neon-cyan">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const progress = getProgress(room.id);

  const handleToggleTask = (taskId: string, currentStatus: boolean) => {
    const previousProgress = progress;
    updateTask(room.id, taskId, !currentStatus);
    
    setTimeout(() => {
      const newProgress = getProgress(room.id);
      if (newProgress === 100 && previousProgress < 100) {
        setShowReward(true);
        setTimeout(() => setShowReward(false), 5000);
      }
    }, 100);
  };

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      addTask(room.id, newTaskText.trim());
      setNewTaskText('');
    }
  };

  const handleStartEdit = (taskId: string, currentText: string) => {
    setEditingTaskId(taskId);
    setEditingText(currentText);
  };

  const handleSaveEdit = () => {
    if (editingTaskId && editingText.trim()) {
      editTask(room.id, editingTaskId, editingText.trim());
      setEditingTaskId(null);
      setEditingText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingText('');
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Delete this task?')) {
      deleteTask(room.id, taskId);
    }
  };

  const handleOpenRewardEditor = () => {
    setRewardMessage(room.reward.message);
    setRewardPoints(room.reward.points);
    setRewardCelebration(room.reward.celebration);
    setShowRewardEditor(true);
  };

  const handleSaveReward = () => {
    updateReward(room.id, {
      message: rewardMessage,
      points: rewardPoints,
      celebration: rewardCelebration
    });
    setShowRewardEditor(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      {showReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-in fade-in backdrop-blur-sm">
          <div className="text-center relative max-w-lg px-6">
            <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse" />
            <div className="text-8xl mb-6 relative z-10 animate-bounce">
              {room.reward.celebration}
            </div>
            <PartyPopper className="w-32 h-32 text-accent mx-auto mb-4 animate-bounce relative z-10" />
            <h2 className="text-5xl font-display text-neon-lime mb-4 relative z-10">
              ROOM COMPLETE!
            </h2>
            <p className="text-2xl text-neon-pink mb-4 relative z-10 font-bold">
              {room.reward.message}
            </p>
            <p className="text-3xl text-neon-cyan relative z-10 font-bold">
              +{room.reward.points} Chaos Goblin Points!
            </p>
            <div className="mt-6 relative z-10">
              <Image
                src="/chaos-kitten.png"
                alt="Chaos Kitten"
                width={80}
                height={80}
                className="rounded-full border-2 border-accent mx-auto"
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="outline" className="border-neon-cyan hover:bg-secondary/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>

            <Dialog open={showRewardEditor} onOpenChange={setShowRewardEditor}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={handleOpenRewardEditor}
                  className="border-accent hover:bg-accent/10"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Reward
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-primary">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display text-neon-pink">
                    Customize Reward
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="reward-message" className="text-foreground mb-2 block">
                      Reward Message
                    </Label>
                    <Input
                      id="reward-message"
                      value={rewardMessage}
                      onChange={(e) => setRewardMessage(e.target.value)}
                      placeholder="Your custom celebration message"
                      className="bg-background border-secondary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reward-points" className="text-foreground mb-2 block">
                      Points Value
                    </Label>
                    <Input
                      id="reward-points"
                      type="number"
                      value={rewardPoints}
                      onChange={(e) => setRewardPoints(parseInt(e.target.value) || 0)}
                      placeholder="100"
                      className="bg-background border-secondary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reward-celebration" className="text-foreground mb-2 block">
                      Celebration Emoji
                    </Label>
                    <Input
                      id="reward-celebration"
                      value={rewardCelebration}
                      onChange={(e) => setRewardCelebration(e.target.value)}
                      placeholder="🎉"
                      className="bg-background border-secondary text-4xl text-center"
                      maxLength={4}
                    />
                  </div>
                  <Button
                    onClick={handleSaveReward}
                    className="w-full bg-accent hover:bg-accent/80 text-black font-bold"
                  >
                    Save Reward
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <div className="text-6xl">{room.emoji}</div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-display text-neon-pink mb-2">
                {room.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-neon-lime">
                  {progress}%
                </div>
                <div className="text-muted-foreground">
                  {room.tasks.filter(t => t.completed).length} / {room.tasks.length} tasks
                </div>
                {progress === 100 && (
                  <div className="flex items-center gap-2 text-accent">
                    <Award className="w-5 h-5" />
                    <span className="font-bold">+{room.reward.points}pts</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="h-4 bg-muted rounded-full border-2 border-primary overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {room.tasks.map((task) => (
            <div
              key={task.id}
              className={`
                group bg-card rounded-lg p-4 border-2 transition-all duration-300
                ${task.completed 
                  ? 'border-accent/50 bg-accent/5' 
                  : 'border-muted hover:border-secondary'
                }
              `}
            >
              {editingTaskId === task.id ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    className="flex-1 bg-background border-secondary"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    className="bg-accent text-black hover:bg-accent/80"
                  >
                    <Check className="w-4 h-4" />
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
              ) : (
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleTask(task.id, task.completed)}
                    className={`
                      mt-1 w-6 h-6 rounded border-2 flex items-center justify-center
                      transition-all duration-300 flex-shrink-0
                      ${task.completed
                        ? 'bg-accent border-accent'
                        : 'border-secondary hover:border-primary hover:bg-primary/10'
                      }
                    `}
                  >
                    {task.completed && <Check className="w-4 h-4 text-black" />}
                  </button>

                  <span
                    className={`
                      flex-1 text-lg transition-all duration-300
                      ${task.completed
                        ? 'line-through text-muted-foreground opacity-60'
                        : 'text-foreground font-semibold'
                      }
                    `}
                  >
                    {task.text}
                  </span>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStartEdit(task.id, task.text)}
                      className="hover:bg-secondary/20 hover:text-secondary"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTask(task.id)}
                      className="hover:bg-destructive/20 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-card border-2 border-primary rounded-lg p-6">
          <h3 className="text-xl font-display text-neon-cyan mb-4">Add New Task</h3>
          <div className="flex gap-2">
            <Input
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTask();
              }}
              placeholder="What else needs cleaning?"
              className="flex-1 bg-background border-muted focus:border-secondary"
            />
            <Button
              onClick={handleAddTask}
              disabled={!newTaskText.trim()}
              className="bg-primary hover:bg-primary/80 text-white font-bold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
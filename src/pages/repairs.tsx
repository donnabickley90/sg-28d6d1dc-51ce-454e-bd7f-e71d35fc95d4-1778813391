import { useCleaning } from '@/contexts/CleaningProvider';
import { Navigation } from '@/components/Navigation';
import { useState } from 'react';
import { Plus, Trash2, Check, Wrench, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function RepairsPage() {
  const { repairs, rooms, addRepair, updateRepair, deleteRepair } = useCleaning();
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  const handleAddRepair = () => {
    if (newTitle.trim() && selectedRoom) {
      addRepair(newTitle.trim(), newDescription.trim(), selectedRoom, selectedPriority);
      setNewTitle('');
      setNewDescription('');
      setSelectedRoom('');
      setSelectedPriority('medium');
    }
  };

  const priorityColors = {
    low: 'text-muted-foreground border-muted',
    medium: 'text-secondary border-secondary',
    high: 'text-primary border-primary',
    urgent: 'text-destructive border-destructive'
  };

  const priorityLabels = {
    low: '🟢 Low',
    medium: '🟡 Medium',
    high: '🟠 High',
    urgent: '🔴 URGENT'
  };

  const activeRepairs = repairs.filter(r => !r.completed);
  const completedRepairs = repairs.filter(r => r.completed);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:pt-20">
      <Navigation />
      
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Wrench className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display text-neon-pink mb-2">
            Repairs & Maintenance
          </h1>
          <p className="text-neon-cyan mb-4">Track fixes and keep the chaos under control!</p>
          
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-destructive">{activeRepairs.length}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{completedRepairs.length}</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
        </header>

        <div className="bg-card border-2 border-primary rounded-lg p-6 mb-8">
          <h3 className="text-xl font-display text-neon-cyan mb-4">Add New Repair/Maintenance</h3>
          <div className="space-y-3">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What needs fixing?"
              className="bg-background border-muted"
            />
            <Textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description (optional)"
              className="bg-background border-muted resize-none"
              rows={2}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="bg-background border-muted">
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.emoji} {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedPriority} onValueChange={(v: any) => setSelectedPriority(v)}>
                <SelectTrigger className="bg-background border-muted">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Low Priority</SelectItem>
                  <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                  <SelectItem value="high">🟠 High Priority</SelectItem>
                  <SelectItem value="urgent">🔴 URGENT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleAddRepair}
              disabled={!newTitle.trim() || !selectedRoom}
              className="w-full bg-primary hover:bg-primary/80 text-white font-bold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Repair
            </Button>
          </div>
        </div>

        {activeRepairs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-display text-neon-pink mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              Active Repairs
            </h2>
            <div className="space-y-3">
              {activeRepairs.map((repair) => {
                const room = rooms.find(r => r.id === repair.roomId);
                return (
                  <div
                    key={repair.id}
                    className={`
                      group bg-card rounded-lg p-5 border-2 transition-all
                      ${priorityColors[repair.priority]}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => updateRepair(repair.id, { completed: true })}
                        className="mt-1 w-7 h-7 rounded border-2 border-secondary flex items-center justify-center flex-shrink-0 hover:bg-accent hover:border-accent transition-all"
                      >
                        <Check className="w-5 h-5" />
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`text-xs font-bold px-2 py-1 rounded border ${priorityColors[repair.priority]}`}>
                            {priorityLabels[repair.priority]}
                          </span>
                          {room && (
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              {room.emoji} {room.name}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-1">
                          {repair.title}
                        </h3>
                        {repair.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {repair.description}
                          </p>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Added {new Date(repair.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteRepair(repair.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {completedRepairs.length > 0 && (
          <div>
            <h2 className="text-2xl font-display text-accent mb-4">Completed</h2>
            <div className="space-y-2">
              {completedRepairs.map((repair) => {
                const room = rooms.find(r => r.id === repair.roomId);
                return (
                  <div
                    key={repair.id}
                    className="group bg-card/50 rounded-lg p-4 border border-accent/30 opacity-60"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-6 h-6 rounded bg-accent border-2 border-accent flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-black" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-foreground line-through mb-1">
                          {repair.title}
                        </h3>
                        {room && (
                          <span className="text-xs text-muted-foreground">
                            {room.emoji} {room.name}
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteRepair(repair.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
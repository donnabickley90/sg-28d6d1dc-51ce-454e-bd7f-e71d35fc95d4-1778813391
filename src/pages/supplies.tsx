import { useCleaning } from '@/contexts/CleaningProvider';
import { Navigation } from '@/components/Navigation';
import { useState } from 'react';
import { Plus, Trash2, Check, ShoppingCart, PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SuppliesPage() {
  const { supplies, addSupply, updateSupply, deleteSupply } = useCleaning();
  const [newName, setNewName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newCategory, setNewCategory] = useState('General Surface Cleaners');

  const handleAddSupply = () => {
    if (newName.trim()) {
      addSupply(newName.trim(), newQuantity.trim() || '1', newCategory);
      setNewName('');
      setNewQuantity('');
    }
  };

  // Get unique categories from supplies
  const uniqueCategories = Array.from(new Set(supplies.map(s => s.category)));
  
  // Group supplies by category
  const categories = uniqueCategories.reduce((acc, category) => {
    acc[category] = supplies.filter(s => s.category === category);
    return acc;
  }, {} as Record<string, typeof supplies>);

  const checkedCount = supplies.filter(s => s.checked).length;
  const totalCount = supplies.length;
  const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:pt-20">
      <Navigation />
      
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <ShoppingCart className="w-16 h-16 text-neon-cyan" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display text-neon-pink mb-2">
            Cleaning Supply Checklist
          </h1>
          <p className="text-neon-cyan mb-4">Stock up on chaos-conquering supplies!</p>
          
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-foreground">Shopping Progress</span>
              <span className="text-2xl font-bold text-neon-lime">{progress}%</span>
            </div>
            <div className="h-4 bg-muted rounded-full border-2 border-secondary overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-secondary to-accent transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {checkedCount} of {totalCount} items checked
            </div>
          </div>
        </header>

        <div className="space-y-8">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="bg-card border-2 border-primary rounded-lg p-6">
              <h2 className="text-2xl font-display text-neon-cyan mb-4">
                {category}
              </h2>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`
                      group flex items-center gap-3 p-3 rounded-lg border-2 transition-all
                      ${item.checked 
                        ? 'border-accent/50 bg-accent/5' 
                        : 'border-muted hover:border-secondary'
                      }
                    `}
                  >
                    <button
                      onClick={() => updateSupply(item.id, { checked: !item.checked })}
                      className={`
                        w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        transition-all duration-300
                        ${item.checked
                          ? 'bg-accent border-accent scale-110'
                          : 'border-secondary hover:border-primary hover:bg-primary/10'
                        }
                      `}
                    >
                      {item.checked && <PawPrint className="w-5 h-5 text-black" />}
                    </button>

                    <div className="flex-1 relative">
                      <div className={`
                        font-semibold transition-all
                        ${item.checked ? 'text-muted-foreground' : 'text-foreground'}
                      `}>
                        {item.checked && (
                          <span className="absolute inset-0 flex items-center">
                            <span className="w-full h-0.5 bg-accent/60 rotate-[-1deg]"></span>
                          </span>
                        )}
                        {item.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteSupply(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-card border-2 border-primary rounded-lg p-6">
            <h3 className="text-xl font-display text-neon-cyan mb-4">Add New Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Item name"
                className="bg-background border-muted"
              />
              <Input
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                placeholder="Quantity (e.g., 2 bottles)"
                className="bg-background border-muted"
              />
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger className="bg-background border-muted">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleAddSupply}
              disabled={!newName.trim()}
              className="w-full mt-3 bg-primary hover:bg-primary/80 text-white font-bold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add to List
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
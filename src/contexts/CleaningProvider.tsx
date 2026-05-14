import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface Room {
  id: string;
  name: string;
  emoji: string;
  tasks: Task[];
}

interface CleaningContextType {
  rooms: Room[];
  updateTask: (roomId: string, taskId: string, completed: boolean) => void;
  addTask: (roomId: string, text: string) => void;
  deleteTask: (roomId: string, taskId: string) => void;
  editTask: (roomId: string, taskId: string, text: string) => void;
  getProgress: (roomId: string) => number;
  getOverallProgress: () => number;
}

const CleaningContext = createContext<CleaningContextType | undefined>(undefined);

const defaultRooms: Room[] = [
  {
    id: 'master-bedroom',
    name: 'Master Bedroom',
    emoji: '🛏️',
    tasks: [
      { id: '1', text: 'Strip bed and wash all bedding including pillows', completed: false },
      { id: '2', text: 'Vacuum under bed and nightstands', completed: false },
      { id: '3', text: 'Dust ceiling fan and light fixtures', completed: false },
      { id: '4', text: 'Wipe down all surfaces and nightstands', completed: false },
      { id: '5', text: 'Clean mirrors and windows', completed: false },
      { id: '6', text: 'Organize and declutter dresser tops', completed: false },
      { id: '7', text: 'Vacuum or mop floors thoroughly', completed: false },
      { id: '8', text: 'Dust baseboards and corners', completed: false },
      { id: '9', text: 'Clean air vents', completed: false },
      { id: '10', text: 'Flip or rotate mattress', completed: false },
    ],
  },
  {
    id: 'wardrobe',
    name: 'Wardrobe',
    emoji: '👔',
    tasks: [
      { id: '1', text: 'Remove all clothes and sort: keep, donate, trash', completed: false },
      { id: '2', text: 'Vacuum or wipe down shelves and drawers', completed: false },
      { id: '3', text: 'Organize clothes by category and color', completed: false },
      { id: '4', text: 'Check for moths or pests', completed: false },
      { id: '5', text: 'Clean mirrors inside wardrobe', completed: false },
      { id: '6', text: 'Dust top of wardrobe', completed: false },
      { id: '7', text: 'Replace or freshen sachets/cedar blocks', completed: false },
      { id: '8', text: 'Wipe down handles and doors', completed: false },
    ],
  },
  {
    id: 'master-bathroom',
    name: 'Master Bathroom',
    emoji: '🛁',
    tasks: [
      { id: '1', text: 'Scrub shower/tub with cleaner and brush', completed: false },
      { id: '2', text: 'Clean grout and tiles', completed: false },
      { id: '3', text: 'Scrub sink and faucet', completed: false },
      { id: '4', text: 'Clean mirrors thoroughly', completed: false },
      { id: '5', text: 'Wipe down countertops and vanity', completed: false },
      { id: '6', text: 'Empty and clean cabinets/drawers', completed: false },
      { id: '7', text: 'Wash bath mats and shower curtain', completed: false },
      { id: '8', text: 'Scrub floor and baseboards', completed: false },
      { id: '9', text: 'Clean exhaust fan', completed: false },
      { id: '10', text: 'Restock toiletries and organize', completed: false },
    ],
  },
  {
    id: 'master-toilet',
    name: 'Master Toilet',
    emoji: '🚽',
    tasks: [
      { id: '1', text: 'Deep clean toilet bowl with brush and cleaner', completed: false },
      { id: '2', text: 'Wipe down exterior of toilet', completed: false },
      { id: '3', text: 'Clean behind and around toilet base', completed: false },
      { id: '4', text: 'Disinfect toilet seat and lid', completed: false },
      { id: '5', text: 'Wipe down walls and door', completed: false },
      { id: '6', text: 'Mop floor thoroughly', completed: false },
    ],
  },
  {
    id: 'reading-room',
    name: 'Reading Room',
    emoji: '📚',
    tasks: [
      { id: '1', text: 'Dust all bookshelves top to bottom', completed: false },
      { id: '2', text: 'Wipe down book spines', completed: false },
      { id: '3', text: 'Vacuum or mop floors', completed: false },
      { id: '4', text: 'Clean windows and window sills', completed: false },
      { id: '5', text: 'Dust ceiling fan and light fixtures', completed: false },
      { id: '6', text: 'Wipe down reading chair/couch', completed: false },
      { id: '7', text: 'Organize books and declutter', completed: false },
      { id: '8', text: 'Clean baseboards', completed: false },
    ],
  },
  {
    id: 'whiskey-room',
    name: 'Whiskey Room',
    emoji: '🥃',
    tasks: [
      { id: '1', text: 'Dust all bottles and display shelves', completed: false },
      { id: '2', text: 'Clean glassware and decanters', completed: false },
      { id: '3', text: 'Wipe down bar surface', completed: false },
      { id: '4', text: 'Organize bottles and check inventory', completed: false },
      { id: '5', text: 'Vacuum or mop floors', completed: false },
      { id: '6', text: 'Clean windows and mirrors', completed: false },
      { id: '7', text: 'Dust ceiling fan and light fixtures', completed: false },
      { id: '8', text: 'Wipe down chairs/seating', completed: false },
    ],
  },
  {
    id: 'makeup-area',
    name: 'Makeup Area',
    emoji: '💄',
    tasks: [
      { id: '1', text: 'Declutter and discard expired products', completed: false },
      { id: '2', text: 'Clean all makeup brushes and tools', completed: false },
      { id: '3', text: 'Wipe down vanity surface', completed: false },
      { id: '4', text: 'Clean mirror thoroughly', completed: false },
      { id: '5', text: 'Organize drawers and storage', completed: false },
      { id: '6', text: 'Dust light fixtures and bulbs', completed: false },
      { id: '7', text: 'Vacuum or sweep floor', completed: false },
      { id: '8', text: 'Sanitize frequently-touched surfaces', completed: false },
    ],
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    emoji: '🍳',
    tasks: [
      { id: '1', text: 'Deep clean oven and stovetop', completed: false },
      { id: '2', text: 'Clean microwave inside and out', completed: false },
      { id: '3', text: 'Empty fridge, wipe shelves, discard old food', completed: false },
      { id: '4', text: 'Clean dishwasher filter and run empty cycle', completed: false },
      { id: '5', text: 'Wipe down all cabinets inside and out', completed: false },
      { id: '6', text: 'Scrub sink and faucet', completed: false },
      { id: '7', text: 'Clean countertops and backsplash', completed: false },
      { id: '8', text: 'Mop floors including under appliances', completed: false },
      { id: '9', text: 'Organize pantry and check expiry dates', completed: false },
      { id: '10', text: 'Dust light fixtures and clean exhaust fan', completed: false },
      { id: '11', text: 'Clean trash can inside and out', completed: false },
    ],
  },
  {
    id: 'spare-bathroom',
    name: 'Spare Bathroom',
    emoji: '🚿',
    tasks: [
      { id: '1', text: 'Scrub shower/tub', completed: false },
      { id: '2', text: 'Clean grout and tiles', completed: false },
      { id: '3', text: 'Scrub sink and faucet', completed: false },
      { id: '4', text: 'Clean mirror', completed: false },
      { id: '5', text: 'Wipe down countertops', completed: false },
      { id: '6', text: 'Empty and clean cabinets', completed: false },
      { id: '7', text: 'Wash bath mats', completed: false },
      { id: '8', text: 'Mop floor', completed: false },
      { id: '9', text: 'Clean exhaust fan', completed: false },
    ],
  },
  {
    id: 'spare-toilet-1',
    name: 'Spare Toilet 1',
    emoji: '🚽',
    tasks: [
      { id: '1', text: 'Deep clean toilet bowl', completed: false },
      { id: '2', text: 'Wipe down exterior of toilet', completed: false },
      { id: '3', text: 'Clean behind toilet', completed: false },
      { id: '4', text: 'Disinfect seat and lid', completed: false },
      { id: '5', text: 'Wipe walls and door', completed: false },
      { id: '6', text: 'Mop floor', completed: false },
    ],
  },
  {
    id: 'spare-toilet-2',
    name: 'Spare Toilet 2',
    emoji: '🚽',
    tasks: [
      { id: '1', text: 'Deep clean toilet bowl', completed: false },
      { id: '2', text: 'Wipe down exterior of toilet', completed: false },
      { id: '3', text: 'Clean behind toilet', completed: false },
      { id: '4', text: 'Disinfect seat and lid', completed: false },
      { id: '5', text: 'Wipe walls and door', completed: false },
      { id: '6', text: 'Mop floor', completed: false },
    ],
  },
  {
    id: 'laundry',
    name: 'Laundry',
    emoji: '🧺',
    tasks: [
      { id: '1', text: 'Clean washing machine drum and seals', completed: false },
      { id: '2', text: 'Run empty hot cycle with cleaner', completed: false },
      { id: '3', text: 'Clean dryer lint trap and vent', completed: false },
      { id: '4', text: 'Wipe down machines exterior', completed: false },
      { id: '5', text: 'Organize detergents and supplies', completed: false },
      { id: '6', text: 'Sweep and mop floor', completed: false },
      { id: '7', text: 'Clean sink if present', completed: false },
      { id: '8', text: 'Dust shelves and cabinets', completed: false },
    ],
  },
  {
    id: 'lounge-room',
    name: 'Lounge Room',
    emoji: '🛋️',
    tasks: [
      { id: '1', text: 'Vacuum couch and cushions', completed: false },
      { id: '2', text: 'Dust all surfaces and shelves', completed: false },
      { id: '3', text: 'Clean TV screen and electronics', completed: false },
      { id: '4', text: 'Vacuum or mop floors thoroughly', completed: false },
      { id: '5', text: 'Clean windows and window sills', completed: false },
      { id: '6', text: 'Dust ceiling fan and light fixtures', completed: false },
      { id: '7', text: 'Organize and declutter', completed: false },
      { id: '8', text: 'Clean baseboards', completed: false },
      { id: '9', text: 'Spot clean walls if needed', completed: false },
    ],
  },
  {
    id: 'dining-area',
    name: 'Dining Area',
    emoji: '🍽️',
    tasks: [
      { id: '1', text: 'Wipe down dining table', completed: false },
      { id: '2', text: 'Clean chairs including legs', completed: false },
      { id: '3', text: 'Dust light fixtures and chandelier', completed: false },
      { id: '4', text: 'Clean sideboard or buffet', completed: false },
      { id: '5', text: 'Vacuum or mop floors', completed: false },
      { id: '6', text: 'Clean windows', completed: false },
      { id: '7', text: 'Dust baseboards', completed: false },
      { id: '8', text: 'Organize table linens and napkins', completed: false },
    ],
  },
  {
    id: 'mud-room',
    name: 'Mud Room',
    emoji: '👢',
    tasks: [
      { id: '1', text: 'Clean shoe storage and organize shoes', completed: false },
      { id: '2', text: 'Wipe down coat hooks and hangers', completed: false },
      { id: '3', text: 'Sweep and mop floor', completed: false },
      { id: '4', text: 'Clean door and handles', completed: false },
      { id: '5', text: 'Organize bags and outdoor gear', completed: false },
      { id: '6', text: 'Dust shelves and cubbies', completed: false },
      { id: '7', text: 'Clean baseboards', completed: false },
    ],
  },
  {
    id: 'entry',
    name: 'Entry',
    emoji: '🚪',
    tasks: [
      { id: '1', text: 'Sweep and mop entryway floor', completed: false },
      { id: '2', text: 'Clean front door inside and out', completed: false },
      { id: '3', text: 'Wipe down door handles and hardware', completed: false },
      { id: '4', text: 'Dust light fixtures', completed: false },
      { id: '5', text: 'Clean mirrors or decorations', completed: false },
      { id: '6', text: 'Organize shoe rack or entry storage', completed: false },
      { id: '7', text: 'Shake out entry mat', completed: false },
    ],
  },
  {
    id: 'snake-enclosures',
    name: 'Snake Enclosures',
    emoji: '🐍',
    tasks: [
      { id: '1', text: 'Remove snake to safe temporary container', completed: false },
      { id: '2', text: 'Remove all substrate and decorations', completed: false },
      { id: '3', text: 'Wipe down glass walls with reptile-safe cleaner', completed: false },
      { id: '4', text: 'Disinfect water bowl and hide boxes', completed: false },
      { id: '5', text: 'Replace with fresh substrate', completed: false },
      { id: '6', text: 'Clean heating elements and check temps', completed: false },
      { id: '7', text: 'Reorganize decorations and add fresh water', completed: false },
      { id: '8', text: 'Return snake to enclosure', completed: false },
      { id: '9', text: 'Clean exterior of enclosure', completed: false },
    ],
  },
];

export function CleaningProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('kittens-cleaning-chaos');
    if (stored) {
      try {
        setRooms(JSON.parse(stored));
      } catch {
        setRooms(defaultRooms);
      }
    } else {
      setRooms(defaultRooms);
    }
  }, []);

  useEffect(() => {
    if (rooms.length > 0) {
      localStorage.setItem('kittens-cleaning-chaos', JSON.stringify(rooms));
    }
  }, [rooms]);

  const updateTask = (roomId: string, taskId: string, completed: boolean) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              tasks: room.tasks.map((task) =>
                task.id === taskId ? { ...task, completed } : task
              ),
            }
          : room
      )
    );
  };

  const addTask = (roomId: string, text: string) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              tasks: [
                ...room.tasks,
                { id: Date.now().toString(), text, completed: false },
              ],
            }
          : room
      )
    );
  };

  const deleteTask = (roomId: string, taskId: string) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              tasks: room.tasks.filter((task) => task.id !== taskId),
            }
          : room
      )
    );
  };

  const editTask = (roomId: string, taskId: string, text: string) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              tasks: room.tasks.map((task) =>
                task.id === taskId ? { ...task, text } : task
              ),
            }
          : room
      )
    );
  };

  const getProgress = (roomId: string): number => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room || room.tasks.length === 0) return 0;
    const completed = room.tasks.filter((t) => t.completed).length;
    return Math.round((completed / room.tasks.length) * 100);
  };

  const getOverallProgress = (): number => {
    if (rooms.length === 0) return 0;
    const total = rooms.reduce((acc, room) => acc + room.tasks.length, 0);
    const completed = rooms.reduce(
      (acc, room) => acc + room.tasks.filter((t) => t.completed).length,
      0
    );
    return Math.round((completed / total) * 100);
  };

  return (
    <CleaningContext.Provider
      value={{
        rooms,
        updateTask,
        addTask,
        deleteTask,
        editTask,
        getProgress,
        getOverallProgress,
      }}
    >
      {children}
    </CleaningContext.Provider>
  );
}

export function useCleaning() {
  const context = useContext(CleaningContext);
  if (!context) {
    throw new Error('useCleaning must be used within CleaningProvider');
  }
  return context;
}
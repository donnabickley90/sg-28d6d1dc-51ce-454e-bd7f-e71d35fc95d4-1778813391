import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Reward {
  message: string;
  points: number;
  celebration: string;
}

export interface Room {
  id: string;
  name: string;
  emoji: string;
  tasks: Task[];
  reward: Reward;
}

export interface Supply {
  id: string;
  name: string;
  quantity: string;
  checked: boolean;
  category: string;
}

export interface DeclutterDay {
  day: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface RepairItem {
  id: string;
  title: string;
  description: string;
  roomId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  completed: boolean;
  createdAt: string;
}

interface CleaningContextType {
  rooms: Room[];
  supplies: Supply[];
  declutterDays: DeclutterDay[];
  repairs: RepairItem[];
  updateTask: (roomId: string, taskId: string, completed: boolean) => void;
  addTask: (roomId: string, text: string) => void;
  deleteTask: (roomId: string, taskId: string) => void;
  editTask: (roomId: string, taskId: string, newText: string) => void;
  updateRoomName: (roomId: string, newName: string) => void;
  getProgress: (roomId: string) => number;
  getOverallProgress: () => number;
  getTotalPoints: () => number;
  getEarnedRewards: () => Array<{ roomId: string; roomName: string; reward: Reward }>;
  updateReward: (roomId: string, reward: Reward) => void;
  addSupply: (name: string, quantity: string, category: string) => void;
  updateSupply: (id: string, updates: Partial<Supply>) => void;
  deleteSupply: (id: string) => void;
  updateDeclutterDay: (day: number, completed: boolean) => void;
  addRepair: (title: string, description: string, roomId: string, priority: RepairItem['priority']) => void;
  updateRepair: (id: string, updates: Partial<RepairItem>) => void;
  deleteRepair: (id: string) => void;
}

const CleaningContext = createContext<CleaningContextType | undefined>(undefined);

const STORAGE_KEY = 'cleaning-rooms';
const SUPPLIES_KEY = 'cleaning-supplies';
const DECLUTTER_KEY = 'declutter-challenge';
const REPAIRS_KEY = 'home-repairs';

const defaultRooms: Room[] = [
  {
    id: "master-bedroom",
    name: "Master Bedroom",
    emoji: "🛏️",
    reward: {
      message: "Master bedroom is pristine! Time to lounge!",
      points: 150,
      celebration: "✨"
    },
    tasks: [
      { id: "mb-1", text: "Strip and wash all bedding", completed: false },
      { id: "mb-2", text: "Vacuum under the bed", completed: false },
      { id: "mb-3", text: "Dust ceiling fans and light fixtures", completed: false },
      { id: "mb-4", text: "Wipe down nightstands and dressers", completed: false },
      { id: "mb-5", text: "Clean mirrors and windows", completed: false },
      { id: "mb-6", text: "Organize closet", completed: false },
      { id: "mb-7", text: "Vacuum or mop floors", completed: false },
      { id: "mb-8", text: "Dust baseboards and corners", completed: false },
    ]
  },
  {
    id: "wardrobe",
    name: "Wardrobe",
    emoji: "👔",
    reward: {
      message: "Fashion chaos conquered! You're a style icon!",
      points: 120,
      celebration: "👗"
    },
    tasks: [
      { id: "wr-1", text: "Sort through clothes - donate/discard", completed: false },
      { id: "wr-2", text: "Vacuum closet floor", completed: false },
      { id: "wr-3", text: "Wipe down shelves and rods", completed: false },
      { id: "wr-4", text: "Organize shoes", completed: false },
      { id: "wr-5", text: "Check for moths/pests", completed: false },
      { id: "wr-6", text: "Clean mirrors", completed: false },
      { id: "wr-7", text: "Organize accessories", completed: false },
    ]
  },
  {
    id: "master-bathroom",
    name: "Master Bathroom",
    emoji: "🚿",
    reward: {
      message: "Sparkling clean! Spa day unlocked!",
      points: 180,
      celebration: "🧖"
    },
    tasks: [
      { id: "mbath-1", text: "Scrub shower/tub and grout", completed: false },
      { id: "mbath-2", text: "Clean toilet thoroughly", completed: false },
      { id: "mbath-3", text: "Wipe down sink and counters", completed: false },
      { id: "mbath-4", text: "Clean mirrors", completed: false },
      { id: "mbath-5", text: "Empty and organize cabinets", completed: false },
      { id: "mbath-6", text: "Wash bath mats and towels", completed: false },
      { id: "mbath-7", text: "Clean exhaust fan", completed: false },
      { id: "mbath-8", text: "Mop floor", completed: false },
      { id: "mbath-9", text: "Descale faucets and showerhead", completed: false },
    ]
  },
  {
    id: "master-toilet",
    name: "Master Toilet",
    emoji: "🚽",
    reward: {
      message: "Throne room restored! Royal treatment awaits!",
      points: 80,
      celebration: "👑"
    },
    tasks: [
      { id: "mt-1", text: "Deep clean toilet bowl", completed: false },
      { id: "mt-2", text: "Scrub toilet exterior and base", completed: false },
      { id: "mt-3", text: "Clean sink and faucet", completed: false },
      { id: "mt-4", text: "Wipe down walls and door", completed: false },
      { id: "mt-5", text: "Empty trash", completed: false },
      { id: "mt-6", text: "Mop floor", completed: false },
    ]
  },
  {
    id: "reading-room",
    name: "Reading Room",
    emoji: "📚",
    reward: {
      message: "Literary sanctuary achieved! Time for a book!",
      points: 120,
      celebration: "📖"
    },
    tasks: [
      { id: "rr-1", text: "Dust all bookshelves", completed: false },
      { id: "rr-2", text: "Organize books", completed: false },
      { id: "rr-3", text: "Vacuum reading chair/couch", completed: false },
      { id: "rr-4", text: "Clean windows", completed: false },
      { id: "rr-5", text: "Dust light fixtures", completed: false },
      { id: "rr-6", text: "Vacuum or mop floor", completed: false },
      { id: "rr-7", text: "Wipe down side tables", completed: false },
    ]
  },
  {
    id: "whiskey-room",
    name: "Whiskey Room",
    emoji: "🥃",
    reward: {
      message: "Distillery-level clean! Pour yourself a reward!",
      points: 130,
      celebration: "🥃"
    },
    tasks: [
      { id: "whr-1", text: "Dust all bottles and shelves", completed: false },
      { id: "whr-2", text: "Polish glassware", completed: false },
      { id: "whr-3", text: "Clean bar cart or cabinet", completed: false },
      { id: "whr-4", text: "Organize spirits collection", completed: false },
      { id: "whr-5", text: "Wipe down surfaces", completed: false },
      { id: "whr-6", text: "Vacuum floor", completed: false },
      { id: "whr-7", text: "Clean any seating", completed: false },
    ]
  },
  {
    id: "makeup-area",
    name: "Makeup Area",
    emoji: "💄",
    reward: {
      message: "Beauty station perfected! Glow up time!",
      points: 110,
      celebration: "💅"
    },
    tasks: [
      { id: "ma-1", text: "Sort through makeup - discard expired items", completed: false },
      { id: "ma-2", text: "Clean makeup brushes", completed: false },
      { id: "ma-3", text: "Wipe down vanity and mirror", completed: false },
      { id: "ma-4", text: "Organize drawers", completed: false },
      { id: "ma-5", text: "Clean beauty tools", completed: false },
      { id: "ma-6", text: "Dust light fixtures", completed: false },
      { id: "ma-7", text: "Vacuum around area", completed: false },
    ]
  },
  {
    id: "kitchen",
    name: "Kitchen",
    emoji: "🍳",
    reward: {
      message: "Chef's kitchen complete! Masterpiece meal unlocked!",
      points: 200,
      celebration: "👨‍🍳"
    },
    tasks: [
      { id: "k-1", text: "Clean out and organize fridge", completed: false },
      { id: "k-2", text: "Clean oven and stovetop", completed: false },
      { id: "k-3", text: "Empty and organize all cabinets", completed: false },
      { id: "k-4", text: "Wipe down counters and backsplash", completed: false },
      { id: "k-5", text: "Clean sink and disposal", completed: false },
      { id: "k-6", text: "Clean microwave inside and out", completed: false },
      { id: "k-7", text: "Organize pantry", completed: false },
      { id: "k-8", text: "Clean dishwasher filter", completed: false },
      { id: "k-9", text: "Wipe down appliances", completed: false },
      { id: "k-10", text: "Mop floor", completed: false },
      { id: "k-11", text: "Clean light fixtures", completed: false },
    ]
  },
  {
    id: "butlers-pantry",
    name: "Butler's Pantry",
    emoji: "🍷",
    reward: {
      message: "Butler-worthy organization! Entertaining ready!",
      points: 140,
      celebration: "🎩"
    },
    tasks: [
      { id: "bp-1", text: "Organize glassware and stemware", completed: false },
      { id: "bp-2", text: "Clean and polish serving pieces", completed: false },
      { id: "bp-3", text: "Wipe down all shelving", completed: false },
      { id: "bp-4", text: "Organize table linens", completed: false },
      { id: "bp-5", text: "Clean sink and counters", completed: false },
      { id: "bp-6", text: "Organize entertaining supplies", completed: false },
      { id: "bp-7", text: "Check and organize bar tools", completed: false },
      { id: "bp-8", text: "Vacuum or mop floor", completed: false },
    ]
  },
  {
    id: "spare-bathroom",
    name: "Spare Bathroom",
    emoji: "🛁",
    reward: {
      message: "Guest-ready perfection! VIP treatment ready!",
      points: 140,
      celebration: "✨"
    },
    tasks: [
      { id: "sbath-1", text: "Scrub shower/tub", completed: false },
      { id: "sbath-2", text: "Clean toilet", completed: false },
      { id: "sbath-3", text: "Wipe down sink and counter", completed: false },
      { id: "sbath-4", text: "Clean mirror", completed: false },
      { id: "sbath-5", text: "Organize cabinets", completed: false },
      { id: "sbath-6", text: "Wash towels", completed: false },
      { id: "sbath-7", text: "Mop floor", completed: false },
    ]
  },
  {
    id: "spare-toilet-1",
    name: "Spare Toilet 1",
    emoji: "🚽",
    reward: {
      message: "Guest throne #1 gleaming! Royalty approved!",
      points: 70,
      celebration: "✨"
    },
    tasks: [
      { id: "st1-1", text: "Deep clean toilet", completed: false },
      { id: "st1-2", text: "Clean sink", completed: false },
      { id: "st1-3", text: "Wipe walls and door", completed: false },
      { id: "st1-4", text: "Empty trash", completed: false },
      { id: "st1-5", text: "Mop floor", completed: false },
    ]
  },
  {
    id: "spare-toilet-2",
    name: "Spare Toilet 2",
    emoji: "🚽",
    reward: {
      message: "Guest throne #2 sparkling! Double royalty!",
      points: 70,
      celebration: "✨"
    },
    tasks: [
      { id: "st2-1", text: "Deep clean toilet", completed: false },
      { id: "st2-2", text: "Clean sink", completed: false },
      { id: "st2-3", text: "Wipe walls and door", completed: false },
      { id: "st2-4", text: "Empty trash", completed: false },
      { id: "st2-5", text: "Mop floor", completed: false },
    ]
  },
  {
    id: "laundry",
    name: "Laundry",
    emoji: "🧺",
    reward: {
      message: "Laundry mastery! Fresh everything unlocked!",
      points: 100,
      celebration: "🧼"
    },
    tasks: [
      { id: "l-1", text: "Clean washing machine drum and seals", completed: false },
      { id: "l-2", text: "Clean dryer lint trap and vent", completed: false },
      { id: "l-3", text: "Wipe down machines", completed: false },
      { id: "l-4", text: "Organize detergents and supplies", completed: false },
      { id: "l-5", text: "Sweep and mop floor", completed: false },
      { id: "l-6", text: "Empty and sort laundry baskets", completed: false },
    ]
  },
  {
    id: "lounge-room",
    name: "Lounge Room",
    emoji: "🛋️",
    reward: {
      message: "Lounge paradise ready! Netflix time earned!",
      points: 160,
      celebration: "🎬"
    },
    tasks: [
      { id: "lr-1", text: "Vacuum all furniture", completed: false },
      { id: "lr-2", text: "Dust all surfaces", completed: false },
      { id: "lr-3", text: "Clean TV and entertainment center", completed: false },
      { id: "lr-4", text: "Organize media and cables", completed: false },
      { id: "lr-5", text: "Clean windows", completed: false },
      { id: "lr-6", text: "Vacuum or mop floor", completed: false },
      { id: "lr-7", text: "Wash throw pillows and blankets", completed: false },
      { id: "lr-8", text: "Dust ceiling fan and lights", completed: false },
    ]
  },
  {
    id: "dining-area",
    name: "Dining Area",
    emoji: "🍽️",
    reward: {
      message: "Feast-ready elegance! Dinner party approved!",
      points: 130,
      celebration: "🍷"
    },
    tasks: [
      { id: "d-1", text: "Wipe down dining table", completed: false },
      { id: "d-2", text: "Clean chairs thoroughly", completed: false },
      { id: "d-3", text: "Polish any wood furniture", completed: false },
      { id: "d-4", text: "Clean light fixture/chandelier", completed: false },
      { id: "d-5", text: "Organize sideboard/buffet", completed: false },
      { id: "d-6", text: "Vacuum or mop floor", completed: false },
      { id: "d-7", text: "Clean windows if applicable", completed: false },
    ]
  },
  {
    id: "mud-room",
    name: "Mud Room",
    emoji: "👢",
    reward: {
      message: "Chaos contained! Entry system perfected!",
      points: 90,
      celebration: "🧹"
    },
    tasks: [
      { id: "mr-1", text: "Organize shoes and boots", completed: false },
      { id: "mr-2", text: "Sort through coats and jackets", completed: false },
      { id: "mr-3", text: "Wipe down benches and hooks", completed: false },
      { id: "mr-4", text: "Sweep and mop floor", completed: false },
      { id: "mr-5", text: "Clean storage cubbies", completed: false },
      { id: "mr-6", text: "Empty and organize bags", completed: false },
    ]
  },
  {
    id: "entry",
    name: "Entry",
    emoji: "🚪",
    reward: {
      message: "First impression perfected! Welcome home!",
      points: 80,
      celebration: "🏠"
    },
    tasks: [
      { id: "e-1", text: "Clean front door inside and out", completed: false },
      { id: "e-2", text: "Wipe down entry table/console", completed: false },
      { id: "e-3", text: "Clean mirror", completed: false },
      { id: "e-4", text: "Organize key hooks and mail", completed: false },
      { id: "e-5", text: "Sweep and mop floor", completed: false },
      { id: "e-6", text: "Clean light fixtures", completed: false },
    ]
  },
  {
    id: "snake-enclosure-1",
    name: "Snake Enclosure 1",
    emoji: "🐍",
    reward: {
      message: "Serpent sanctuary secured! Danger noodle happy!",
      points: 150,
      celebration: "🐍"
    },
    tasks: [
      { id: "se1-1", text: "Remove snake to secure location", completed: false },
      { id: "se1-2", text: "Remove all substrate", completed: false },
      { id: "se1-3", text: "Deep clean glass/walls with reptile-safe cleaner", completed: false },
      { id: "se1-4", text: "Clean all decorations and hides", completed: false },
      { id: "se1-5", text: "Sanitize water bowl", completed: false },
      { id: "se1-6", text: "Check and clean heating elements", completed: false },
      { id: "se1-7", text: "Replace substrate", completed: false },
      { id: "se1-8", text: "Return decorations and snake safely", completed: false },
      { id: "se1-9", text: "Check temperature and humidity levels", completed: false },
    ]
  },
  {
    id: "snake-enclosure-2",
    name: "Snake Enclosure 2",
    emoji: "🐍",
    reward: {
      message: "Enclosure #2 excellence! Scale baby approved!",
      points: 150,
      celebration: "🐍"
    },
    tasks: [
      { id: "se2-1", text: "Remove snake to secure location", completed: false },
      { id: "se2-2", text: "Remove all substrate", completed: false },
      { id: "se2-3", text: "Deep clean glass/walls with reptile-safe cleaner", completed: false },
      { id: "se2-4", text: "Clean all decorations and hides", completed: false },
      { id: "se2-5", text: "Sanitize water bowl", completed: false },
      { id: "se2-6", text: "Check and clean heating elements", completed: false },
      { id: "se2-7", text: "Replace substrate", completed: false },
      { id: "se2-8", text: "Return decorations and snake safely", completed: false },
      { id: "se2-9", text: "Check temperature and humidity levels", completed: false },
    ]
  },
  {
    id: "snake-enclosure-3",
    name: "Snake Enclosure 3",
    emoji: "🐍",
    reward: {
      message: "Triple threat complete! All noodles living luxury!",
      points: 150,
      celebration: "🐍"
    },
    tasks: [
      { id: "se3-1", text: "Remove snake to secure location", completed: false },
      { id: "se3-2", text: "Remove all substrate", completed: false },
      { id: "se3-3", text: "Deep clean glass/walls with reptile-safe cleaner", completed: false },
      { id: "se3-4", text: "Clean all decorations and hides", completed: false },
      { id: "se3-5", text: "Sanitize water bowl", completed: false },
      { id: "se3-6", text: "Check and clean heating elements", completed: false },
      { id: "se3-7", text: "Replace substrate", completed: false },
      { id: "se3-8", text: "Return decorations and snake safely", completed: false },
      { id: "se3-9", text: "Check temperature and humidity levels", completed: false },
    ]
  },
  {
    id: "cat-room",
    name: "Cat Room",
    emoji: "🐱",
    reward: {
      message: "Purr-fection achieved! Kitten overlord pleased!",
      points: 170,
      celebration: "😻"
    },
    tasks: [
      { id: "cr-1", text: "Scoop and clean all litter boxes thoroughly", completed: false },
      { id: "cr-2", text: "Vacuum cat trees and scratching posts", completed: false },
      { id: "cr-3", text: "Wash all cat beds and blankets", completed: false },
      { id: "cr-4", text: "Clean food and water bowls", completed: false },
      { id: "cr-5", text: "Wipe down surfaces and remove fur", completed: false },
      { id: "cr-6", text: "Organize cat toys", completed: false },
      { id: "cr-7", text: "Vacuum floors and corners", completed: false },
      { id: "cr-8", text: "Clean windows (cat TV spots)", completed: false },
      { id: "cr-9", text: "Empty trash (used litter bags)", completed: false },
    ]
  },
  {
    id: "dog-room",
    name: "Dog Room",
    emoji: "🐕",
    reward: {
      message: "Good human! Pupper paradise unlocked!",
      points: 170,
      celebration: "🦴"
    },
    tasks: [
      { id: "dr-1", text: "Wash all dog beds and blankets", completed: false },
      { id: "dr-2", text: "Clean food and water bowls", completed: false },
      { id: "dr-3", text: "Organize and clean dog toys", completed: false },
      { id: "dr-4", text: "Vacuum floors thoroughly", completed: false },
      { id: "dr-5", text: "Wipe down crates or kennels", completed: false },
      { id: "dr-6", text: "Clean any gates or barriers", completed: false },
      { id: "dr-7", text: "Organize leashes, collars, and gear", completed: false },
      { id: "dr-8", text: "Mop floors", completed: false },
      { id: "dr-9", text: "Empty and clean trash (waste bags)", completed: false },
    ]
  },
];

const defaultSupplies: Supply[] = [
  { id: 's-1', name: 'All-Purpose Cleaner', quantity: '2 bottles', checked: false, category: 'cleaners' },
  { id: 's-2', name: 'Glass Cleaner', quantity: '1 bottle', checked: false, category: 'cleaners' },
  { id: 's-3', name: 'Bathroom Cleaner', quantity: '2 bottles', checked: false, category: 'cleaners' },
  { id: 's-4', name: 'Floor Cleaner', quantity: '1 bottle', checked: false, category: 'cleaners' },
  { id: 's-5', name: 'Disinfectant Spray', quantity: '2 bottles', checked: false, category: 'cleaners' },
  { id: 's-6', name: 'Microfiber Cloths', quantity: '10 pack', checked: false, category: 'tools' },
  { id: 's-7', name: 'Sponges', quantity: '6 pack', checked: false, category: 'tools' },
  { id: 's-8', name: 'Paper Towels', quantity: '6 rolls', checked: false, category: 'tools' },
  { id: 's-9', name: 'Trash Bags', quantity: '2 boxes', checked: false, category: 'supplies' },
  { id: 's-10', name: 'Rubber Gloves', quantity: '2 pairs', checked: false, category: 'tools' },
  { id: 's-11', name: 'Vacuum Bags/Filters', quantity: 'as needed', checked: false, category: 'supplies' },
  { id: 's-12', name: 'Mop Head Refills', quantity: '2', checked: false, category: 'supplies' },
];

const defaultDeclutterDays: DeclutterDay[] = [
  { day: 1, title: 'Purge Your Purse/Wallet', description: 'Empty, clean, and reorganize', completed: false },
  { day: 2, title: 'Junk Drawer', description: 'Sort, toss, and organize', completed: false },
  { day: 3, title: 'Medicine Cabinet', description: 'Check expiry dates, dispose safely', completed: false },
  { day: 4, title: 'Under Kitchen Sink', description: 'Remove, clean, organize supplies', completed: false },
  { day: 5, title: 'Spice Rack', description: 'Toss expired, organize by use', completed: false },
  { day: 6, title: 'Refrigerator', description: 'Toss old food, wipe shelves', completed: false },
  { day: 7, title: 'Freezer', description: 'Identify mystery items, toss old', completed: false },
  { day: 8, title: 'Tupperware Cabinet', description: 'Match lids, recycle orphans', completed: false },
  { day: 9, title: 'Coat Closet', description: 'Donate unused, organize by season', completed: false },
  { day: 10, title: 'Shoes by Entry', description: 'Donate/toss, organize keepers', completed: false },
  { day: 11, title: 'Nightstand', description: 'Clear clutter, keep only essentials', completed: false },
  { day: 12, title: 'Dresser Drawers', description: 'One drawer per day - fold, organize', completed: false },
  { day: 13, title: 'Closet Floor', description: 'Clear, vacuum, organize', completed: false },
  { day: 14, title: 'Hangers & Closet Rods', description: 'Uniform hangers, organize by type', completed: false },
  { day: 15, title: 'Books', description: 'Donate unread/unwanted books', completed: false },
  { day: 16, title: 'Magazines & Papers', description: 'Recycle old, organize important', completed: false },
  { day: 17, title: 'DVD/Game Collection', description: 'Donate duplicates, organize', completed: false },
  { day: 18, title: 'Cables & Chargers', description: 'Label, coil, toss obsolete', completed: false },
  { day: 19, title: 'Bathroom Cabinets', description: 'Toss empties, organize products', completed: false },
  { day: 20, title: 'Makeup & Cosmetics', description: 'Check expiry, organize by use', completed: false },
  { day: 21, title: 'Linen Closet', description: 'Fold, organize, donate excess', completed: false },
  { day: 22, title: 'Cleaning Supplies', description: 'Consolidate, organize, toss empties', completed: false },
  { day: 23, title: 'Laundry Room', description: 'Clear surfaces, organize supplies', completed: false },
  { day: 24, title: 'Kids Toys (or Pet Toys)', description: 'Donate unused, organize keepers', completed: false },
  { day: 25, title: 'Craft/Hobby Supplies', description: 'Organize by project, donate excess', completed: false },
  { day: 26, title: 'Office/Desk Drawers', description: 'Organize supplies, toss dried pens', completed: false },
  { day: 27, title: 'File Cabinet', description: 'Shred old docs, organize important', completed: false },
  { day: 28, title: 'Digital Clutter', description: 'Delete old files, organize folders', completed: false },
  { day: 29, title: 'Car Interior', description: 'Remove trash, vacuum, organize', completed: false },
  { day: 30, title: 'One "Scary" Space', description: 'Tackle your most avoided area', completed: false },
];

export function CleaningProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [declutterDays, setDeclutterDays] = useState<DeclutterDay[]>([]);
  const [repairs, setRepairs] = useState<RepairItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setRooms(JSON.parse(stored));
    } else {
      setRooms(defaultRooms);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRooms));
    }

    const storedSupplies = localStorage.getItem(SUPPLIES_KEY);
    if (storedSupplies) {
      setSupplies(JSON.parse(storedSupplies));
    } else {
      setSupplies(defaultSupplies);
      localStorage.setItem(SUPPLIES_KEY, JSON.stringify(defaultSupplies));
    }

    const storedDeclutter = localStorage.getItem(DECLUTTER_KEY);
    if (storedDeclutter) {
      setDeclutterDays(JSON.parse(storedDeclutter));
    } else {
      setDeclutterDays(defaultDeclutterDays);
      localStorage.setItem(DECLUTTER_KEY, JSON.stringify(defaultDeclutterDays));
    }

    const storedRepairs = localStorage.getItem(REPAIRS_KEY);
    if (storedRepairs) {
      setRepairs(JSON.parse(storedRepairs));
    } else {
      setRepairs([]);
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

  const editTask = (roomId: string, taskId: string, newText: string) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              tasks: room.tasks.map((task) =>
                task.id === taskId ? { ...task, text: newText } : task
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

  const getOverallProgress = () => {
    if (rooms.length === 0) return 0;
    const totalProgress = rooms.reduce((sum, room) => sum + getProgress(room.id), 0);
    return Math.round(totalProgress / rooms.length);
  };

  const getTotalPoints = () => {
    return rooms.reduce((total, room) => {
      const progress = getProgress(room.id);
      return total + (progress === 100 ? room.reward.points : 0);
    }, 0);
  };

  const getEarnedRewards = () => {
    return rooms
      .filter(room => getProgress(room.id) === 100)
      .map(room => ({
        roomId: room.id,
        roomName: room.name,
        reward: room.reward
      }));
  };

  const updateReward = (roomId: string, reward: Reward) => {
    setRooms(prevRooms => {
      const updatedRooms = prevRooms.map(room =>
        room.id === roomId ? { ...room, reward } : room
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRooms));
      return updatedRooms;
    });
  };

  const updateRoomName = (roomId: string, newName: string) => {
    setRooms(prevRooms => {
      const updatedRooms = prevRooms.map(room =>
        room.id === roomId ? { ...room, name: newName } : room
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRooms));
      return updatedRooms;
    });
  };

  const addSupply = (name: string, quantity: string, category: string) => {
    const newSupply: Supply = {
      id: `s-${Date.now()}`,
      name,
      quantity,
      category,
      checked: false
    };
    setSupplies(prev => {
      const updated = [...prev, newSupply];
      localStorage.setItem(SUPPLIES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateSupply = (id: string, updates: Partial<Supply>) => {
    setSupplies(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...updates } : s);
      localStorage.setItem(SUPPLIES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteSupply = (id: string) => {
    setSupplies(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem(SUPPLIES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateDeclutterDay = (day: number, completed: boolean) => {
    setDeclutterDays(prev => {
      const updated = prev.map(d => d.day === day ? { ...d, completed } : d);
      localStorage.setItem(DECLUTTER_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const addRepair = (title: string, description: string, roomId: string, priority: RepairItem['priority']) => {
    const newRepair: RepairItem = {
      id: `r-${Date.now()}`,
      title,
      description,
      roomId,
      priority,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setRepairs(prev => {
      const updated = [...prev, newRepair];
      localStorage.setItem(REPAIRS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateRepair = (id: string, updates: Partial<RepairItem>) => {
    setRepairs(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, ...updates } : r);
      localStorage.setItem(REPAIRS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteRepair = (id: string) => {
    setRepairs(prev => {
      const updated = prev.filter(r => r.id !== id);
      localStorage.setItem(REPAIRS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <CleaningContext.Provider
      value={{
        rooms,
        supplies,
        declutterDays,
        repairs,
        updateTask,
        addTask,
        deleteTask,
        editTask,
        updateRoomName,
        getProgress,
        getOverallProgress,
        getTotalPoints,
        getEarnedRewards,
        updateReward,
        addSupply,
        updateSupply,
        deleteSupply,
        updateDeclutterDay,
        addRepair,
        updateRepair,
        deleteRepair,
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

export interface Mall {
  id: string;
  name: string;
  location: string;
  totalSlots: number;
  availableSlots: number;
  imageUrl: string;
  pricePerHour: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  mallId: string;
  slotNumber: number;
  date: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'cancelled';
  qrCode: string;
  createdAt: string;
}

export const malls: Mall[] = [
  {
    id: "mall-1",
    name: "Central Plaza",
    location: "Downtown",
    totalSlots: 200,
    availableSlots: 45,
    imageUrl: "https://images.unsplash.com/photo-1519567241046-7bc37b86e6a2?q=80&w=2865&auto=format&fit=crop",
    pricePerHour: 5,
  },
  {
    id: "mall-2",
    name: "Riverside Mall",
    location: "Eastside",
    totalSlots: 150,
    availableSlots: 30,
    imageUrl: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=2680&auto=format&fit=crop",
    pricePerHour: 4,
  },
  {
    id: "mall-3",
    name: "Sunset Shopping Center",
    location: "Westside",
    totalSlots: 300,
    availableSlots: 120,
    imageUrl: "https://images.unsplash.com/photo-1567449303078-57ad995bd17f?q=80&w=2680&auto=format&fit=crop",
    pricePerHour: 6,
  },
  {
    id: "mall-4",
    name: "Hillside Galleria",
    location: "Northside",
    totalSlots: 180,
    availableSlots: 75,
    imageUrl: "https://images.unsplash.com/photo-1605431010173-fdaf4a11aadc?q=80&w=2592&auto=format&fit=crop",
    pricePerHour: 7,
  }
];

export const users: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "user@example.com",
    password: "password123",
    isAdmin: false,
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    isAdmin: true,
  }
];

export const bookings: Booking[] = [
  {
    id: "booking-1",
    userId: "user-1",
    mallId: "mall-1",
    slotNumber: 42,
    date: "2025-04-23",
    startTime: "10:00",
    endTime: "12:00",
    status: "active",
    qrCode: "booking-1",
    createdAt: "2025-04-22T10:30:00Z",
  },
  {
    id: "booking-2",
    userId: "user-1",
    mallId: "mall-2",
    slotNumber: 15,
    date: "2025-04-20",
    startTime: "14:00",
    endTime: "16:00",
    status: "completed",
    qrCode: "booking-2",
    createdAt: "2025-04-19T09:15:00Z",
  },
];

export const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00", 
  "18:00", "19:00", "20:00", "21:00", "22:00"
];

export function getAvailableSlots(mallId: string, date: string, startTime: string): number[] {
  const takenSlots = bookings
    .filter(b => b.mallId === mallId && b.date === date && b.startTime === startTime && b.status === "active")
    .map(b => b.slotNumber);
  
  const mall = malls.find(m => m.id === mallId);
  if (!mall) return [];
  
  const allSlots = Array.from({ length: mall.totalSlots }, (_, i) => i + 1);
  return allSlots.filter(slot => !takenSlots.includes(slot));
}

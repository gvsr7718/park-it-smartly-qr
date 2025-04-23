
import { Booking, malls } from './mockData';

// Generate booking information formatted for QR code
export const generateQRData = (booking: Booking): string => {
  const mall = malls.find(m => m.id === booking.mallId);
  
  const qrData = {
    bookingId: booking.id,
    mallName: mall?.name || '',
    slotNumber: booking.slotNumber,
    date: booking.date,
    startTime: booking.startTime,
    endTime: booking.endTime,
    validationKey: `${booking.id}-${booking.userId}-${Date.now()}`
  };
  
  return JSON.stringify(qrData);
};

// Create a new booking in the system
export const createBooking = (
  userId: string, 
  mallId: string, 
  slotNumber: number,
  date: string,
  startTime: string,
  endTime: string
): Booking => {
  const bookingId = `booking-${Date.now()}`;
  
  const newBooking: Booking = {
    id: bookingId,
    userId,
    mallId,
    slotNumber,
    date,
    startTime,
    endTime,
    status: "active",
    qrCode: bookingId,
    createdAt: new Date().toISOString(),
  };
  
  return newBooking;
};

// Assign a parking slot to a booking
export const assignParkingSlot = (booking: Booking): Booking | null => {
  const mall = malls.find(m => m.id === booking.mallId);
  
  if (!mall || mall.availableSlots <= 0) {
    return null; // No available slots
  }
  
  // In a real app, here we would update the database
  // For now, we just simulate the slot assignment
  
  // If the booking already has a slot, just return it
  if (booking.slotNumber > 0) {
    return booking;
  }
  
  // Find an available slot (in a real app, this would query the database)
  // For demo purposes, assign a random slot number between 1 and 50
  const availableSlots = Array.from({ length: mall.totalSlots }, (_, i) => i + 1);
  const randomIndex = Math.floor(Math.random() * availableSlots.length);
  const assignedSlot = availableSlots[randomIndex];
  
  // Update the booking with the assigned slot
  const updatedBooking: Booking = {
    ...booking,
    slotNumber: assignedSlot,
  };
  
  // Decrease available slots count (in a real app, this would update the database)
  mall.availableSlots--;
  
  return updatedBooking;
};

// Free up a parking slot
export const freeUpParkingSlot = (booking: Booking): boolean => {
  const mall = malls.find(m => m.id === booking.mallId);
  
  if (!mall) {
    return false;
  }
  
  // Update booking status to completed
  booking.status = 'completed';
  
  // Increase available slots count (in a real app, this would update the database)
  mall.availableSlots = Math.min(mall.availableSlots + 1, mall.totalSlots);
  
  return true;
};

// Verify QR code validity
export const verifyQRCode = (qrData: string): { valid: boolean; message: string; booking?: Booking } => {
  try {
    const parsedData = JSON.parse(qrData);
    
    if (!parsedData.bookingId || !parsedData.validationKey) {
      return { valid: false, message: 'Invalid QR code format' };
    }
    
    // Find booking in our system
    const booking = bookings.find(b => b.id === parsedData.bookingId);
    
    if (!booking) {
      return { valid: false, message: 'Booking not found' };
    }
    
    // Check if booking is active
    if (booking.status !== 'active') {
      return { valid: false, message: 'Booking is no longer active' };
    }
    
    // Verify the date is valid (not expired)
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      return { valid: false, message: 'Booking date has expired' };
    }
    
    return { 
      valid: true, 
      message: 'QR code is valid', 
      booking 
    };
  } catch (error) {
    return { valid: false, message: 'Invalid QR code data' };
  }
};

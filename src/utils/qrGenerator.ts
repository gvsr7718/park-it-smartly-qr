
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

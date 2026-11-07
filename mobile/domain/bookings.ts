import { getSlotStatus, slotKey } from './availability.ts';
import type { Booking, ConfirmResult, Slot } from '../types/availability.ts';

export function confirmBooking({ bookings, slot, now }: {
  bookings: readonly Booking[];
  slot: Slot;
  now: Date;
}): { bookings: readonly Booking[]; result: ConfirmResult } {
  const id = slotKey(slot);
  const existing = bookings.find((booking) => booking.id === id);
  if (existing) return { bookings, result: { status: 'confirmed', booking: existing } };
  if (getSlotStatus({ slot, bookings, now }) !== 'available') {
    return { bookings, result: { status: 'unavailable' } };
  }

  const booking: Booking = { id, slot: { ...slot }, confirmedAt: now.getTime() };
  return { bookings: [...bookings, booking], result: { status: 'confirmed', booking } };
}

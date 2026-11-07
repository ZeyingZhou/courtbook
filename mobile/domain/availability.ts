import { facilities, slotHours } from '../data/courts.ts';
import type { Booking, DisplaySlot, LocalDate, Slot, SlotStatus } from '../types/availability.ts';

export function isLocalDate(value: string): value is LocalDate {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function formatLocalDate(date: Date): LocalDate {
  const value = `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  if (!isLocalDate(value)) throw new RangeError('Invalid local calendar date');
  return value;
}

export function localDateStart(value: LocalDate): Date {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function startOfWeek(date: Date): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - (result.getDay() + 6) % 7);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function canGoToPreviousWeek(weekStart: Date, today: LocalDate): boolean {
  return formatLocalDate(addDays(weekStart, -1)) >= today;
}

export function slotKey(slot: Slot): string {
  return JSON.stringify([slot.facilityId, slot.courtId, slot.date, slot.startHour]);
}

export function slotStart(slot: Slot): Date {
  const date = localDateStart(slot.date);
  date.setHours(slot.startHour);
  return date;
}

export function isValidSlot(slot: Slot): boolean {
  const facility = facilities.find(({ id }) => id === slot.facilityId);
  return isLocalDate(slot.date)
    && !!facility?.courts.some(({ id }) => id === slot.courtId)
    && slotHours.includes(slot.startHour);
}

function isSampleUnavailable(slot: Slot): boolean {
  let hash = 0;
  for (const character of slotKey(slot)) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }
  return hash % 5 === 0;
}

export function getSlotStatus({ slot, bookings, now }: {
  slot: Slot;
  bookings: readonly Booking[];
  now: Date;
}): SlotStatus {
  if (!isValidSlot(slot)) return 'unavailable';
  if (bookings.some((booking) => slotKey(booking.slot) === slotKey(slot))) return 'booked';
  if (slotStart(slot).getTime() <= now.getTime()) return 'elapsed';
  return isSampleUnavailable(slot) ? 'unavailable' : 'available';
}

export function getSlots({ facilityId, date, bookings, now }: {
  facilityId: string;
  date: LocalDate;
  bookings: readonly Booking[];
  now: Date;
}): readonly DisplaySlot[] {
  const facility = facilities.find(({ id }) => id === facilityId);
  if (!facility || !isLocalDate(date)) return [];
  return facility.courts.flatMap((court) => slotHours.map((startHour) => {
    const slot: Slot = { facilityId, courtId: court.id, date, startHour };
    return { slot, status: getSlotStatus({ slot, bookings, now }) };
  }));
}

export function formatHour(hour: number): string {
  return `${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}`;
}

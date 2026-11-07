import type { Facility } from '../types/court.ts';

function courts(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: String(index + 1),
    name: `Court ${index + 1}`,
  }));
}

export const facilities: readonly Facility[] = [
  { id: '1', name: 'Riverside Tennis Center', courts: courts(7) },
  { id: '2', name: 'Central Park Courts', courts: courts(4) },
  { id: '3', name: 'Northside Racquet Club', courts: courts(6) },
  { id: '4', name: 'Eastside Tennis Club', courts: courts(3) },
  { id: '5', name: 'Lakeside Courts', courts: courts(5) },
];

export const openingHour = 8;
export const closingHour = 23;
export const slotHours = Array.from(
  { length: closingHour - openingHour },
  (_, index) => openingHour + index,
);

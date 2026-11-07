export type LocalDate = string & { readonly __brand: 'LocalDate' };

export type Slot = Readonly<{
  facilityId: string;
  courtId: string;
  date: LocalDate;
  startHour: number;
}>;

export type SlotStatus = 'available' | 'unavailable' | 'elapsed' | 'booked';

export type DisplaySlot = Readonly<{
  slot: Slot;
  status: SlotStatus;
}>;

export type Booking = Readonly<{
  id: string;
  slot: Slot;
  confirmedAt: number;
}>;

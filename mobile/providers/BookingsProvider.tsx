import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { confirmBooking } from '@/domain/bookings';
import type { Booking, ConfirmResult, Slot } from '@/types/availability';

type BookingsContextValue = {
  bookings: readonly Booking[];
  confirm: (slot: Slot) => ConfirmResult;
};

const BookingsContext = createContext<BookingsContextValue | null>(null);

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<readonly Booking[]>([]);
  const ledger = useRef(bookings);
  const confirm = useCallback((slot: Slot): ConfirmResult => {
    const transaction = confirmBooking({ bookings: ledger.current, slot, now: new Date() });
    if (transaction.bookings !== ledger.current) {
      ledger.current = transaction.bookings;
      setBookings(transaction.bookings);
    }
    return transaction.result;
  }, []);

  return <BookingsContext value={{ bookings, confirm }}>{children}</BookingsContext>;
}

export function useBookings() {
  const context = useContext(BookingsContext);
  if (!context) throw new Error('useBookings must be used within BookingsProvider');
  return context;
}

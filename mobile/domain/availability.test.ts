/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { facilities, slotHours } from '../data/courts.ts';
import type { Booking, LocalDate, Slot } from '../types/availability.ts';
import {
  addDays, canGoToPreviousWeek, formatLocalDate, getSlots, getSlotStatus,
  isLocalDate, isValidSlot, localDateStart, slotKey, slotStart, startOfWeek,
} from './availability.ts';

function date(value: string): LocalDate {
  assert.ok(isLocalDate(value));
  return value;
}

const future = date('2030-06-10');
const now = new Date(2030, 5, 9, 12);
const baseSlot: Slot = { facilityId: '1', courtId: '1', date: future, startHour: 10 };

function availableSlot(): Slot {
  const entry = getSlots({ facilityId: '1', date: future, bookings: [], now })
    .find(({ status }) => status === 'available');
  assert.ok(entry);
  return entry.slot;
}

test('slot identity distinguishes every facility, court, date and hour', () => {
  const slots: Slot[] = [
    baseSlot,
    { ...baseSlot, facilityId: '2' },
    { ...baseSlot, courtId: '2' },
    { ...baseSlot, date: date('2030-06-11') },
    { ...baseSlot, startHour: 11 },
  ];
  assert.equal(new Set(slots.map(slotKey)).size, slots.length);
  assert.equal(slotKey({ ...baseSlot }), slotKey(baseSlot));
});

test('catalog creates a complete explicit schedule with the correct facility courts', () => {
  for (const facility of facilities) {
    const slots = getSlots({ facilityId: facility.id, date: future, bookings: [], now });
    assert.equal(slots.length, facility.courts.length * 15);
    assert.equal(new Set(slots.map(({ slot }) => slotKey(slot))).size, slots.length);
    assert.deepEqual(new Set(slots.map(({ slot }) => slot.courtId)), new Set(facility.courts.map(({ id }) => id)));
    assert.ok(slots.every(({ slot }) => slot.facilityId === facility.id && slot.date === future));
    assert.ok(slots.some(({ status }) => status === 'available'));
    assert.ok(slots.some(({ status }) => status === 'unavailable'));
  }
  assert.deepEqual(getSlots({ facilityId: 'unknown', date: future, bookings: [], now }), []);
});

test('sample availability repeats exactly and changes with facility and date', () => {
  const query = { facilityId: '1', date: future, bookings: [], now };
  assert.deepEqual(getSlots(query), getSlots(query));
  const pattern = (facilityId: string, day: LocalDate) => getSlots({ ...query, facilityId, date: day })
    .filter(({ slot }) => slot.courtId === '1').map(({ status }) => status);
  assert.notDeepEqual(pattern('1', future), pattern('2', future));
  assert.notDeepEqual(pattern('1', future), pattern('1', date('2030-06-11')));
});

test('only the exact scoped booking disables a slot', () => {
  const slot = availableSlot();
  const booking: Booking = { id: slotKey(slot), slot, confirmedAt: now.getTime() };
  assert.equal(getSlotStatus({ slot, bookings: [booking], now }), 'booked');
  for (const otherSlot of [
    { ...slot, facilityId: '2' },
    { ...slot, courtId: '2' },
    { ...slot, date: date('2030-06-11') },
    { ...slot, startHour: slot.startHour + 1 },
  ]) {
    assert.equal(
      getSlotStatus({ slot: otherSlot, bookings: [booking], now }),
      getSlotStatus({ slot: otherSlot, bookings: [], now }),
    );
  }
  const displayed = getSlots({ facilityId: '1', date: future, bookings: [booking], now });
  assert.equal(displayed.find((entry) => slotKey(entry.slot) === booking.id)?.status, 'booked');
});

test('a slot is elapsed at its exact local start and after, but available just before', () => {
  const slot = availableSlot();
  const start = slotStart(slot);
  assert.equal(getSlotStatus({ slot, bookings: [], now: new Date(start.getTime() - 1) }), 'available');
  assert.equal(getSlotStatus({ slot, bookings: [], now: start }), 'elapsed');
  assert.equal(getSlotStatus({ slot, bookings: [], now: new Date(start.getTime() + 1) }), 'elapsed');
  const booking: Booking = { id: slotKey(slot), slot, confirmedAt: now.getTime() };
  assert.equal(getSlotStatus({ slot, bookings: [booking], now: start }), 'booked');
});

test('the one-hour schedule ends with 22 to 23 and rejects invalid court or hour', () => {
  assert.deepEqual(slotHours, Array.from({ length: 15 }, (_, index) => index + 8));
  const slots = getSlots({ facilityId: '1', date: future, bookings: [], now });
  const last = slots.find(({ slot }) => slot.courtId === '1' && slot.startHour === 22);
  assert.ok(last);
  assert.equal(slotStart(last.slot).getHours(), 22);
  assert.equal(last.slot.startHour + 1, 23);
  for (const startHour of [23, 7, 10.5]) {
    assert.equal(isValidSlot({ ...baseSlot, startHour }), false);
    assert.equal(getSlotStatus({ slot: { ...baseSlot, startHour }, bookings: [], now }), 'unavailable');
  }
  assert.equal(isValidSlot({ ...baseSlot, facilityId: 'unknown' }), false);
  assert.equal(isValidSlot({ ...baseSlot, facilityId: '2', courtId: '7' }), false);
});

test('calendar boundary rejects invalid dates rather than rolling to another month', () => {
  for (const value of ['2030-02-29', '2030-04-31', '2030-13-01', '2030-00-10', '2030-01-00', '2030-6-10', 'junk', '2030-06-10T00:00:00Z']) {
    assert.equal(isLocalDate(value), false, value);
  }
  assert.ok(isLocalDate('2028-02-29'));
  assert.ok(isLocalDate('2030-06-10'));
  assert.throws(() => formatLocalDate(new Date(NaN)), RangeError);
});

test('local calendar helpers preserve dates around midnight and month boundaries', () => {
  assert.equal(formatLocalDate(new Date(2030, 5, 10, 0, 1)), '2030-06-10');
  assert.equal(formatLocalDate(new Date(2030, 5, 10, 23, 59)), '2030-06-10');
  assert.equal(formatLocalDate(localDateStart(future)), future);
  assert.equal(formatLocalDate(addDays(localDateStart(date('2030-12-31')), 1)), '2031-01-01');
  assert.equal(formatLocalDate(addDays(localDateStart(date('2030-03-01')), -1)), '2030-02-28');
});

test('previous week is blocked when fully past, while a week containing today is reachable', () => {
  const today = date('2030-06-12');
  const currentWeek = startOfWeek(localDateStart(today));
  assert.equal(formatLocalDate(currentWeek), '2030-06-10');
  assert.equal(canGoToPreviousWeek(currentWeek, today), false);
  assert.equal(canGoToPreviousWeek(addDays(currentWeek, 7), today), true);
  assert.equal(canGoToPreviousWeek(currentWeek, date('2030-06-16')), false);
  assert.equal(canGoToPreviousWeek(addDays(currentWeek, 7), date('2030-06-16')), true);
});

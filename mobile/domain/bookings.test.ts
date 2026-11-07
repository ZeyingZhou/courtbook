/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { confirmBooking } from './bookings.ts';
import { formatLocalDate, getSlots, getSlotStatus, slotKey, slotStart } from './availability.ts';
import type { Slot } from '../types/availability.ts';

const now = new Date(2030, 5, 9, 12);
const date = formatLocalDate(new Date(2030, 5, 10));
const slots = getSlots({ facilityId: '1', date, bookings: [], now });

function slotWithStatus(status: 'available' | 'unavailable'): Slot {
  const entry = slots.find((entry) => entry.status === status);
  assert.ok(entry);
  return entry.slot;
}

test('confirmation adds one booking and the availability query sees it', () => {
  const slot = slotWithStatus('available');
  const transaction = confirmBooking({ bookings: [], slot, now });
  assert.equal(transaction.result.status, 'confirmed');
  assert.equal(transaction.bookings.length, 1);
  assert.deepEqual(transaction.bookings[0], { id: slotKey(slot), slot, confirmedAt: now.getTime() });
  assert.equal(getSlotStatus({ slot, bookings: transaction.bookings, now }), 'booked');
});

test('immediate repeats and repeats after start return the original booking', () => {
  const slot = slotWithStatus('available');
  const first = confirmBooking({ bookings: [], slot, now });
  for (const repeatedAt of [now, slotStart(slot), new Date(2031, 0, 1)]) {
    const repeat = confirmBooking({ bookings: first.bookings, slot: { ...slot }, now: repeatedAt });
    assert.equal(repeat.bookings, first.bookings);
    assert.equal(repeat.result.status, 'confirmed');
    if (repeat.result.status === 'confirmed') assert.equal(repeat.result.booking, first.bookings[0]);
    assert.equal(repeat.bookings.length, 1);
  }
});

test('a fresh confirmation at or after start refuses a stale reviewed slot', () => {
  const slot = slotWithStatus('available');
  const start = slotStart(slot);
  assert.equal(confirmBooking({ bookings: [], slot, now: new Date(start.getTime() - 1) }).result.status, 'confirmed');
  for (const freshNow of [start, new Date(start.getTime() + 1)]) {
    const transaction = confirmBooking({ bookings: [], slot, now: freshNow });
    assert.deepEqual(transaction.result, { status: 'unavailable' });
    assert.deepEqual(transaction.bookings, []);
  }
});

test('sample-unavailable and invalid fresh slots leave the ledger untouched', () => {
  const slot = slotWithStatus('available');
  const first = confirmBooking({ bookings: [], slot, now });
  const refused: Slot[] = [
    slotWithStatus('unavailable'),
    { ...slot, facilityId: 'unknown' },
    { ...slot, courtId: 'unknown' },
    { ...slot, facilityId: '2', courtId: '7' },
    ...[7, 23, 10.5, NaN].map((startHour) => ({ ...slot, startHour })),
  ];
  for (const candidate of refused) {
    const transaction = confirmBooking({ bookings: first.bookings, slot: candidate, now });
    assert.deepEqual(transaction.result, { status: 'unavailable' });
    assert.equal(transaction.bookings, first.bookings);
    assert.equal(transaction.bookings.length, 1);
  }
});

test('confirmation identity includes facility, court, local date and start hour', () => {
  const candidates = ['1', '2'].flatMap((facilityId) => [date, formatLocalDate(new Date(2030, 5, 11))]
    .flatMap((day) => getSlots({ facilityId, date: day, bookings: [], now })))
    .filter(({ status }) => status === 'available').map(({ slot }) => slot);
  const fields = ['facilityId', 'courtId', 'date', 'startHour'] satisfies (keyof Slot)[];
  for (const field of fields) {
    const firstSlot = candidates.find((candidate) => candidates.some((other) =>
      fields.every((key) => key === field ? candidate[key] !== other[key] : candidate[key] === other[key])));
    assert.ok(firstSlot, field);
    const secondSlot = candidates.find((other) =>
      fields.every((key) => key === field ? firstSlot[key] !== other[key] : firstSlot[key] === other[key]));
    assert.ok(secondSlot, field);
    const first = confirmBooking({ bookings: [], slot: firstSlot, now });
    const second = confirmBooking({ bookings: first.bookings, slot: secondSlot, now });
    assert.equal(second.result.status, 'confirmed', field);
    assert.equal(second.bookings.length, 2, field);
    assert.notEqual(second.bookings[0].id, second.bookings[1].id, field);
    assert.equal(first.bookings.length, 1);
  }
});

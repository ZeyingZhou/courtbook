import { TimeSlot } from "@/types/availability";

export const mockAvailability: TimeSlot[] = [
  {
    courtId: "1",
    startTime: "09:00",
    endTime: "10:00",
    available: true,
  },
  {
    courtId: "2",
    startTime: "09:00",
    endTime: "10:00",
    available: false,
  },
];
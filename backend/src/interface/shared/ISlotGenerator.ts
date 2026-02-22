export interface ISlotGenerator {
  generateSlots(
    startTime: string,
    endTime: string,
    slotDuration: number,
  ): { start: string; end: string }[];
}

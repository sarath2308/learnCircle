import { ISlotGenerator } from "@/interface/shared/ISlotGenerator";
import { injectable } from "inversify";

@injectable()
export class SlotGenerator implements ISlotGenerator {
  private timeToMinutes(t: string): number {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }

  private minutesToTime(min: number): string {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  generateSlots(startTime: string, endTime: string, slotDuration: number) {
    const startMin = this.timeToMinutes(startTime);
    const endMin = this.timeToMinutes(endTime);

    if (endMin <= startMin) {
      throw new Error("endTime must be greater than startTime");
    }

    const slots: { start: string; end: string }[] = [];

    for (let t = startMin; t + slotDuration <= endMin; t += slotDuration) {
      slots.push({
        start: this.minutesToTime(t),
        end: this.minutesToTime(t + slotDuration),
      });
    }

    return slots;
  }
}

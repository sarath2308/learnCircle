import { AVAILABILITY_API } from "@/api/profesional/availability.api";
import { useMutation } from "@tanstack/react-query";

export interface ICreateAvailabililtyRes {
  success: boolean;
  availabilityData: {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDuration: number;
    price: number;
  };
}

export const useAvailabilityRemove = () => {
  return useMutation({
    mutationKey: ["remove-availability"],
    mutationFn: AVAILABILITY_API.removeAvailability,
    onSuccess: (res: ICreateAvailabililtyRes) => {
      return res.availabilityData;
    },
  });
};

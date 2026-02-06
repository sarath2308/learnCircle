import { AVAILABILITY_API } from "@/api/profesional/availability.api"
import { useMutation } from "@tanstack/react-query"

export interface ICreateAvailabililtyRes
{
    success:boolean,
    availabilityData:{
       id: string;
       dayOfWeek: number;
       startTime: string;
       endTime: string;
       slotDuration: number;
       price: number;
    }
}
export const useCreateAvailability = () =>
{
    return useMutation({
        mutationKey:["create-availability"],
        mutationFn: AVAILABILITY_API.createAvailability,
        onSuccess:(res: ICreateAvailabililtyRes) =>
        {
          return res.availabilityData;
        }
    })
}
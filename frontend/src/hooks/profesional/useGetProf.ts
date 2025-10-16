import { dashboardApi } from "@/api/profesional/dashboardApi";
import { useQuery } from "@tanstack/react-query";

// interface IResponse{
//     user:{
//         name:string,
//         email:string,
//     }
// }
export const useGetProf = ()=>
{
     return useQuery<any>({
    queryKey: ["profInfo"],
    queryFn: async () => {
      try {
        const response :any = await dashboardApi.getProfileInfo;
        const data = response.user;
        console.log(data);
        return data;
      } catch (err: any) {
        console.error(err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}
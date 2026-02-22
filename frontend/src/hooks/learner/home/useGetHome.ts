import { learnerHomeApi } from "@/api/learner/learnerHomeApi";
import { setCurrentUser, setProfileImg } from "@/redux/slice/currentUserSlice";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export const useGetHome = () => {
  const dispatch = useDispatch();
  const getHome = useQuery({
    queryKey: ["getHome"],
    queryFn: async () => {
      const response = await learnerHomeApi.getHome();
      dispatch(setProfileImg(response.userData.profileImg));
      return response;
    },
  });
  return getHome;
};

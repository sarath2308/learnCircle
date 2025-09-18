import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "@/redux/slice/tempSlice";
import api from "../../api/api";
import axios from "axios";
import { toast } from "react-toastify";

export const useSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signup = async (role: string, data: { name: string; email: string; password: string }) => {
    try {
      const res = await api.post(`/auth/${role}/signup`, data);

      dispatch(setUser({ ...res.data, role }));

      navigate(`/auth/${role}/verify-otp?role=${role}&type=signup&email=${data.email}`);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Signup failed");
      } else {
        toast.error("Unexpected error");
      }
      throw err; // rethrow if upper layers need it
    }
  };

  return { signup };
};

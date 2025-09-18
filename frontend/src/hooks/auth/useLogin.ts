import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "../../redux/slice/currentUserSlice";
import { toast } from "react-toastify";

import api from "../../api/api";
export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (role: string, data: { email: string; password: string }) => {
    try {
      const res = await api.post(`/auth/${role}/login`, data);
      toast.success("login success");
      dispatch(setCurrentUser({ ...res.data, role }));
      navigate(`/${role}/home`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return { login };
};

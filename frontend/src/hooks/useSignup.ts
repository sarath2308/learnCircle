import {useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "@/redux/slice/tempSlice";
import api from '../api/api'


export const useSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signup = async (role: 'learner' | 'professional'|'admin', data: { name:string; email:string; password:string }) => {
    const res = await api.post(`/auth/${role}/signup`, data);
    dispatch(setUser({ ...res.data, role }));
    navigate(`/${role}/verify-otp?role=${role}&type=signup&email=${data.email}`);
  };

  return { signup };
};

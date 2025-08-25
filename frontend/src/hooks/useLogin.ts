import {useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentUser} from '../redux/slice/currentUserSlice'

import api from '../api/api'
export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (role:string, data:{email:string,password:string}) => {
    const res = await api.post(`/auth/${role}/login`, data);
    dispatch(setCurrentUser({ ...res.data, role }));
    navigate('/dashboard');
  };

  return { login };
};

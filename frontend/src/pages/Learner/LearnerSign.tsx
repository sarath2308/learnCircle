import React, { useCallback } from 'react'
import { useState } from 'react'
import LoginForm from '@/components/LoginForm'
import SignupForm from '@/components/SignupForm'
import { useNavigate } from 'react-router-dom'
import { useSignup } from '@/hooks/auth/useSignup'
import { useLogin } from '@/hooks/auth/useLogin'


const LearnerSign = () => {
  const[view,setView]=useState('login')
  const navigate=useNavigate()
  const {login}=useLogin()
  const {signup}=useSignup()

const onSignUp = useCallback(async(role: string, data: {name: string,email: string,password: string}) => {
  try {
    const result = await signup(role, data);
    console.log(result);
  } catch(err) {
    console.error(err);
  }
}, [signup]);

const onLogin = useCallback(async(role: string, data: {email: string,password: string}) => {
  try {
    const result = await login(role, data);
    console.log(result);
  } catch(err) {
    console.error(err);
  }
}, [login]);

const onBack = useCallback(() => {
  navigate('/auth');
}, [navigate]);

const handleView = useCallback(() => {
  setView(prev => (prev === 'login' ? 'signup' : 'login'));
}, []);

 
   const onForgotPassword=useCallback(()=>
  {
    navigate('/auth/learner/forgot')
  },[])


  return (
    <div>
  {view==='login'&&
  <LoginForm 
  role='learner'
  onSubmit={onLogin}
  onBack={onBack}
  onSwitchToSignup={handleView}
  onForgotPassword={onForgotPassword}
  />}

    {view==='signup'&&
  <SignupForm
  role='learner'
  onSubmit={onSignUp}
  onBack={onBack}
  onSwitchToLogin={handleView}
  />}
      </div>
  )
}

export default LearnerSign
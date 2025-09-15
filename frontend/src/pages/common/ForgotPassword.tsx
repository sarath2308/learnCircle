import ForgotPasswordForm from '@/components/ForgotPasswordForm'
import { useGetOtp } from '@/hooks/auth/useGetOtp'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
type ForgotProps={
  role:string
}
const ForgotPassword =({role}:ForgotProps)=> {
const navigate=useNavigate()
const {getOtp}=useGetOtp()
    const onBack=()=>
    {
      navigate(-1)
    }
    const onOTPSent=async(email:string)=>
    {
     try {
        const res=await getOtp(role,{email,type:"forgot"})
        console.log(res)
     } catch (error) {
      throw error;
        console.error(error)
     }
    }
  return (
    <div className='flex justify-center align-middle my-28'>
        <ForgotPasswordForm
        onBack={onBack}
        onOTPSent={onOTPSent} />
    </div>
  )
}

export default ForgotPassword
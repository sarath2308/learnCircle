import React from 'react'
import { useGetOtp } from '@/hooks/useGetOtp'
import ForgotPasswordForm from '@/components/ForgotPasswordForm'
import { useNavigate } from 'react-router-dom'

const LearnerForgot = () => {
    const {getOtp}=useGetOtp()
    const navigate=useNavigate()
    const onBack=async()=>
    {
       navigate('/')
    }
    const onOTPSent=async(email:string)=>
    {
        try {
            let res=await getOtp("learner",{email:email,type:'forgot'})
            return res;
        } catch (error) {
            console.log(error)
            return error;
            
        }
    }
  return (
    <div>
       <ForgotPasswordForm
       onBack={onBack}
       onOTPSent={onOTPSent}

       />
    </div>
  )
}

export default LearnerForgot
'use client'
import Tailwind from 'primereact/passthrough/tailwind'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import { PrimeReactProvider } from 'primereact/api'


const EmailVerificationAlert = () => {

  const toast = useRef<Toast>(null)
  const router = useRouter()
  const sendEmail = "/api/send-verification-email/"
const sendClick = ()=>{
  axios
  .get(sendEmail)
  .then((response) => {
    toast.current?.show({
      severity: 'success',
      summary: 'Mail send',
    })
  })
  .catch((error) => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
    })
  })
}

  return (
    <div
      className='bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4'
      role='alert'
    >
 <PrimeReactProvider    value={{ unstyled: true, pt: Tailwind }}>

 <Toast ref={toast} />
 </PrimeReactProvider>


      <p className='font-bold'>Warning</p>
      <div className="flex">

      <p className="flex-auto mt-3">Email not verified</p>
   
   <button
     className='mt-4 bg-orange-600 text-white py-2 px-4 rounded'
onClick={sendClick}
   >
     Send Verification Email
   </button>
      </div>
  
    </div>
  )
}

export default EmailVerificationAlert

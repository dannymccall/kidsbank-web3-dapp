import React, { Suspense } from 'react'
import VerifyEmail from '@/app/ui/auth/EmailVerification'
const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  )
}

export default page

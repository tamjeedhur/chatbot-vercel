'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useMachine } from '@xstate/react'
import { verifyEmailMachine } from '@/machines/verifyEmailMachine/verifyEmailMachine'
import { useRouter } from 'next/navigation'

const VerifyEmailClient = () => {
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')
  const router = useRouter()
  const [state, send] = useMachine(verifyEmailMachine, {
    input: {
      token: token || '',
    },
  })
  console.log(state)
  if(state.matches('success')){
    return(
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-md text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Email Verified!</h1>
            <p className="text-muted-foreground">Your email has been successfully verified. You can now access your dashboard.</p>
          </div>
          <button
            onClick={() => router.push('/new/dashboard')}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-foreground mb-2">Verify Email</h1>
      </div>
    </div>
  )
}

export default VerifyEmailClient
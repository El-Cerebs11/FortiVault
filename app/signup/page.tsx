'use client'

import React, { useEffect, useState } from 'react'
import Logo from '/assets/logo.png'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { useFormik } from 'formik'
import axios from 'axios';

export default function SignUp() {
  const [serverErrors, setServerErrors] = useState('')
  const router = useRouter()

  const session = useSession()

  type FormDataType = {
    email: string
    password: string
    passwordAgain: string
  }
  const initialValues: FormDataType = {
    email: '',
    password: '',
    passwordAgain: '',
  }

  const formik = useFormik({
    initialValues: initialValues,
    validate: (data: FormDataType) => {
      let errors: { [key: string]: string } = {}
      //check is empty
      ;['email', 'password', 'passwordAgain'].forEach((element: string) => {
        if (data[element as keyof FormDataType] == '') {
          errors[element as keyof FormDataType] = 'This field is required !'
        }

        if (data.password != data.passwordAgain) {
          let ePass = 'Passwords do not match'
          errors['password'] = ePass
          errors['passwordAgain'] = ePass
        }
      })
      return errors
    },

    onSubmit:async (data: FormDataType) => {
       
      if (data) {
        const { passwordAgain, ...params } = data;
        try {
          const response = await axios.post('/api/user', params); 
          signIn('credentials', {
            email: response.data['email'],
            password: params.password,
          }).then(()=>{
            router.push('/')
          })
        return
        } catch (error) {
          throw new Error('Something went wrong');
        }
    
      }
    },
  })

  const isFormFieldInvalid = (name: keyof FormDataType) =>
    !!(formik.touched[name] && formik.errors[name])

  const getFormErrorMessage = (name: keyof FormDataType) => {
    return isFormFieldInvalid(name) ? (
      <small className='text-red-700'>{formik.errors[name]}</small>
    ) : (
      <small className=''>&nbsp;</small>
    )
  }

  //redirect on auth
  useEffect(() => {
    if (router && session && session.status == 'authenticated') {
      router.push('/')
    }
  }, [session, router])

  return (
    <>
    <div className='flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <Image
          className='mx-auto h-20 w-auto'
          src={Logo}
          width='200'
          height='80'
          alt='logo'
        />
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-black dark:text-white'>
          Sign up your account
        </h2>
      </div>
  
      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <form
          className='space-y-6'
          onSubmit={formik.handleSubmit}
          method='POST'
        >
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium leading-6 text-black dark:text-white'
            >
              Email address
            </label>
            <div className='mt-2'>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                onChange={(e) =>
                  formik.setFieldValue('email', e.target.value)
                }
                value={formik.values['email']}
                className='block w-full dark:text-white rounded-md border-0 px-4 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 dark:bg-gray-700'
              />
              {getFormErrorMessage('email')}
            </div>
          </div>
  
          <div>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='password'
                className='block text-sm font-medium leading-6 text-black dark:text-white'
              >
                Password
              </label>
            </div>
            <div className='mt-2'>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                onChange={(e) =>
                  formik.setFieldValue('password', e.target.value)
                }
                value={formik.values['password']}
                className='block w-full dark:text-white rounded-md border-0 px-4 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 dark:bg-gray-700'
              />
              {getFormErrorMessage('password')}
            </div>
          </div>
  
          <div>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='password'
                className='block text-sm font-medium leading-6 text-black dark:text-white'
              >
                Confirm password
              </label>
            </div>
            <div className='mt-2'>
              <input
                id='passwordAgain'
                name='passwordAgain'
                type='password'
                autoComplete='current-password'
                onChange={(e) =>
                  formik.setFieldValue('passwordAgain', e.target.value)
                }
                value={formik.values['passwordAgain']}
                className='block w-full dark:text-white rounded-md border-0 px-4 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 dark:bg-gray-700'
              />
              {getFormErrorMessage('passwordAgain')}
            </div>
          </div>
  
          <div>
            <button
              type='submit'
              className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Sign up
            </button>
          </div>
          <div className='mt-5 flex items-center justify-center'>
        
          </div>
        </form>

        <button
              className='px-4 py-2 justify-center w-full border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150 dark:text-white'
              onClick={() => signIn('google')}
            >
              <Image
                width={60}
                height={60}
                className='w-6 h-6'
                src='https://www.svgrepo.com/show/475656/google-color.svg'
                loading='lazy'
                alt='google logo'
              />
              <span>sign up with Google</span>
            </button>
  
        <div hidden={!serverErrors}>
          <div
            className='flex items-center p-4 mb-4 mt-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900'
            role='alert'
          >
            <svg
              className='flex-shrink-0 inline w-4 h-4 mr-3'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z' />
            </svg>
            <span className='sr-only'>Info</span>
            <div>
              <span className='font-medium dark:text-white'>{serverErrors}</span>
            </div>
          </div>
        </div>
  
        <p className='mt-10 text-center text-sm text-gray-500'>
          Already member?{' '}
          <a
              onClick={() => router.push('signin')}
            className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500 dark:text-indigo-200'
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  </>
  
  )
}

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '/assets/logo.png'
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react'
import { useFormik } from 'formik'
import { Toast } from 'primereact/toast'
import { PrimeReactProvider } from 'primereact/api'
import Tailwind from 'primereact/passthrough/tailwind'
import googleLogo from '@/public/google.svg'
import axios from 'axios'

interface FormDataType {
    passwordAgain: string
    password: string
}

export default function SignIn({
    params,
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const router = useRouter()
    const apiUrl = "/api/reset-password"
    const toast = useRef<Toast>(null)

    const initialValues: FormDataType = {
        passwordAgain: '',
        password: '',
    }

    const formik = useFormik({
        initialValues: initialValues,
        validate: (data: FormDataType) => {
            let errors: { [key: string]: string } = {}

                ;['passwordAgain', 'password'].forEach((element: string) => {
                    if (data[element as keyof FormDataType] === '') {
                        errors[element as keyof FormDataType] = 'This field is required !'
                    }
                })

            if (data.password != data.passwordAgain) {
                const matchPassErr = "Passwords do not match"
                errors.password = matchPassErr
                errors.passwordAgain = matchPassErr
            }
            return errors
        },
        onSubmit: async (data: FormDataType) => {
            if (data) {
                try {
                    const response = await axios.post(apiUrl, { ...data, token: searchParams.token, email: searchParams.email })
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Success',
                    })
          
                    await new Promise(r => setTimeout(r, 1000));//wait 2s
                     router.push('/signin')

                } catch (error) {
                    const errorMessage =
                        typeof error === 'string'
                            ? error
                            : error instanceof Error
                                ? error.message
                                : 'An unknown error occurred'
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: errorMessage,
                    })
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

    return (
        <>
            <div className='flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 '>
                <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
                    <Toast ref={toast} />
                </PrimeReactProvider>
                <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                    <Image
                        className='mx-auto w-auto h-auto'
                        src={Logo}
                        width='100'
                        height='100'
                        alt='logo'
                    />
                    <h2 className='mt-10 text-center text-2xl font-bold leading-9 text-white-900 dark:text-white'>
                        Reset password
                    </h2>
                </div>

                <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
                    <form
                        method='POST'
                        onSubmit={formik.handleSubmit}
                        onReset={formik.handleReset}
                    >
                        <div>
                            <div className='flex items-center justify-between'>
                                <label
                                    htmlFor='password'
                                    className='block text-sm font-medium leading-6 text-white-900 dark:text-white'
                                >
                                    New password
                                </label>
                            </div>
                            <div className='mt-2'>
                                <input
                                    id='password'
                                    name='password'
                                    type='password'
                                    value={formik.values['password']}
                                    autoComplete='current-password'
                                    onChange={(e) =>
                                        formik.setFieldValue('password', e.target.value)
                                    }
                                    className='block w-full dark:text-white rounded-md border-0 px-4 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700'
                                />
                                {getFormErrorMessage('password')}
                            </div>
                        </div>
                        <div>
                            <div className='flex items-center justify-between'>
                                <label
                                    htmlFor='password'
                                    className='block text-sm font-medium leading-6 text-white-900 dark:text-white'
                                >
                                    Repeat password
                                </label>
                            </div>
                            <div className='mt-2'>
                                <input
                                    id='passwordAgain'
                                    name='passwordAgain'
                                    type='password'
                                    value={formik.values['passwordAgain']}
                                    autoComplete='current-password'
                                    onChange={(e) =>
                                        formik.setFieldValue('passwordAgain', e.target.value)
                                    }
                                    className='block w-full dark:text-white rounded-md border-0 px-4 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700'
                                />
                                {getFormErrorMessage('passwordAgain')}
                            </div>
                        </div>

                        <button
                            type='submit'
                            disabled={formik.isSubmitting}
                            className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        >
                            <div className='flex flex-row gap-2'>
                                <div role='status' hidden={!formik.isSubmitting}>
                                    <svg
                                        aria-hidden='true'
                                        className='inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300'
                                        viewBox='0 0 100 101'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'
                                    >
                                        <path
                                            d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                                            fill='currentColor'
                                        />
                                        <path
                                            d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                                            fill='currentFill'
                                        />
                                    </svg>
                                    <span className='sr-only'>Loading...</span>
                                </div>
                                <span>Change password</span>
                            </div>
                        </button>
                    </form>

                </div>
            </div>
        </>
    )
}

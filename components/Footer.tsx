import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-gray-300  shadow dark:bg-gray-900'>
      <div className='w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between'>
        <span className='text-sm text-gray-500 sm:text-center dark:text-gray-400'>
          © 2024{' '}
          <a href='/' className='hover:underline'>
            FortiVault
          </a>
          . All Rights Reserved.
        </span>
    
      </div>
    </footer>
  )
}

export default Footer

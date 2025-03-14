import React from 'react'

const Input = ({icon: Icon, ...props}) => {
  return (
    <div className='relative mb-8'>
        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
            <Icon className='size-5 text-blue-500' />
        </div>
        <input 
            {...props}
            className='w-full pl-10 pr-3 py-2 bg-gray-200 bg-opacity-50 rounded-lg border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-sm shadow-sm placeholder-gray-400 text-gray-800 transition duration-200 ease-in-out'
        />
    </div>
  )
}

export default Input
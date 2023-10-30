import React from 'react'

export default function PrimaryBtn({text}) {
  return (
    <button type='submit' className=' rounded-md px-2 py-[2px] cursor-pointer bg-orange-600 font-medium text-white shadow hover:bg-orange-500'>
        {text}
    </button>
  )
}

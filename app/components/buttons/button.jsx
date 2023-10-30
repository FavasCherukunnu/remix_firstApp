import React from 'react'

export function PrimaryBtn({text,type='submit'}) {
  return (
    <button type={type} className=' rounded-md px-2 py-[2px] cursor-pointer bg-orange-600 font-medium text-white shadow hover:bg-orange-500'>
        {text}
    </button>
  )
}

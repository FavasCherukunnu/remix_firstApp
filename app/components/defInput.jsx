import React from 'react'

export default function DefInput({title,err,onChange,name,value}) {
  return (
    <div className=' flex flex-col py-1 '>
        <p className=' font-medium pb-1 text-center'>{title}</p>
        <input name={name} onChange={onChange} value={value} className={`rounded-md focus:outline-0 border-2 ${err?'border-red-400':'border-gray-300'} focus:border-gray-500 px-2 py-1`} type="text" />
        <p className=' text-xs text-red-400 max-w-[200px]'>{err}</p>
    </div>
  )
}

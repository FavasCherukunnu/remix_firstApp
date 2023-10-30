import React from 'react'

export default function UserPanel({users}) {
  return (
    <div className=' w-[200px] border-r border-gray-300 h-screen flex flex-col bg-stone-50'>
        <div className=' w-full py-2 text-center font-bold text-xl text-green-500 bg-gray-200 border-b border-gray-300'>
            Team
        </div>
        <div className='w-full flex flex-col items-center py-5'>
            {
                users.map(
                    (user)=>(
                        <div className=' rounded-full h-20 w-20 bg-yellow-200' key={user.id}>

                        </div>
                    )
                )
            }
        </div>
    </div>
  )
}

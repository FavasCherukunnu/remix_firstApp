import React from 'react'

export default function OuterLayout({children,className}) {
  return (
    <div className={`h-screen w-screen bg-green-500 ${className}`}>
        {children}
    </div>
  )
}

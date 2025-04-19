import React from 'react'

export default function RecapContainer({children}: {children: React.ReactNode}) {
  return (
    <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
    >
        {children}
    </div>
  )
}

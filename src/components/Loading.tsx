import React from 'react'

const Loading = () => {
  return (
    <div className='relative w-[8vw] max-w-[80px] before:content-[""] before:block before:pt-[100%]'>
      <svg className='animate-[loading-spinner-rotate_1.28973s_linear_infinite] h-full origin-[center_center] w-full absolute m-auto inset-0' viewBox="25 25 50 50">
        <circle
          className="animate-[loading-spinner-dash_2s_ease-in-out_infinite,loading-spinner-color_8s_ease-in-out_infinite] stroke-[4px]"
          style={{
            strokeDasharray: "1, 200",
            strokeDashoffset: 0,
            strokeLinecap: "round",
            strokeWidth: 3,
            strokeMiterlimit: 10
          }}
          cx="50"
          cy="50"
          r="20"
          fill="none"
        />
      </svg>
    </div>
  )
}

export default Loading
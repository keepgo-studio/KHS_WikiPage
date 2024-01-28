import React from 'react'

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  shape?: "box" | "normal"
};

const Button = ({
  children,
  className,
  shape = "box",
  ...rest
}: ButtonProps) => {
  return (
    <button 
      { ...rest }

      className={`
      ${className}
      ${shape === "box" && "fcenter w-16 h-16 min-w-16 min-h-16 rounded-2xl bg-prime-blue text-white"}
      ${shape === "normal" && "px-5 py-2 uppercase text-base bg-prime-blue text-white rounded-lg hover:brightness-90 duration-200"}
      cursor-pointer
      `}
    >

      {children}
    </button>
  )
}

export default Button
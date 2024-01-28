import React from "react";

type ButtonProps = React.ComponentPropsWithoutRef<"div">;

const Blank = ({ className }: ButtonProps) => {
  return <div className={className}/>
};

export default Blank;

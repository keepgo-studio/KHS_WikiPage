'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className='flex h-16 px-8 items-center shadow-sh1'>
      <button onClick={() => router.push("/")}>
        <Image
          width={64}
          height={23}
          alt="logo"
          src={"https://nginx.codinghub.co.kr/assets/codinghub_typeLogoBlack.svg"}
          priority={true}
        />
      </button>
    </nav>
  )
}

export default Navbar
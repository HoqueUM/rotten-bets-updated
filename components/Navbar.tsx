"use client";

import { ThemeToggle } from "./ThemeToggle";
import Image from 'next/image'
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed w-full">
      <div className="mx-auto px-4 flex h-14 items-center justify-between w-full max-w-[2560px]">
        <div className="flex items-center">
          <Link href="/" className="flex flex-row justify-center items-center gap-0">
            <p className="text-xl font-semibold p-0">Rot Kings</p>
            <Image
              src="logo.png"
              alt="Rot Kings Logo"
              width={42}
              height={42}
              className="pp-0" />
          </Link>
        </div>
        <div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
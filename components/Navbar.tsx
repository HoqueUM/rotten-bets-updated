"use client";

import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed w-full">
      <div className="mx-auto px-4 flex h-14 items-center justify-between w-full max-w-[2560px]">
        <div className="flex items-center">
          <Link href="/">
            <p className="text-xl font-semibold">Rot Kings</p>
          </Link>
        </div>
        <div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
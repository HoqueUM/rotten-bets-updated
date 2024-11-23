"use client";

import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed w-full">
      <div className="container flex h-14 items-center justify-between">
        <div className="pl-4 flex items-center">
          <Link href="/">
            <p className="text-xl font-semibold">Rot Kings</p>
          </Link>
        </div>
        <div className="ml-auto pr-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
"use client";

import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <nav className="z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed w-full">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
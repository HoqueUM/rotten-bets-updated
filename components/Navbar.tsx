"use client";

import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">RT Tracker</h1>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
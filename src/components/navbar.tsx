"use client";

import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <nav className="border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="text-lg font-bold font-didot">E-Governance</Link>
          <div className="flex items-center gap-3">
            <Link href="/mock-login">
              <Button variant="ghost" size="sm">Demo Login</Button>
            </Link>
            <ModeToggle />
            <div className="flex items-center gap-2">
              <SignInButton />
              <UserButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

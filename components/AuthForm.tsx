"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Github, Chrome } from "lucide-react";

export function AuthForm() {
  return (
    <Card className="p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to Rotten Tomatoes Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to track your favorite movies
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <Button
            variant="outline"
            onClick={() => signIn("github", { callbackUrl: "/" })}
          >
            <Github className="mr-2 h-4 w-4" />
            Continue with GitHub
          </Button>
          <Button
            variant="outline"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>
        </div>
      </div>
    </Card>
  );
}
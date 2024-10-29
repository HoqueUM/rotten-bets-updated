import { AuthForm } from "@/components/AuthForm";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}
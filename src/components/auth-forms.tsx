"use client";

import { useActionState } from "react";
import { loginAction, registerAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRANCHES } from "@/lib/format";

type State = { error?: string } | null;

export function LoginForm() {
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData) => loginAction(formData),
    null,
  );

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="student@orbithire.dev"
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>
      {state?.error ? (
        <p className="text-sm text-rose-700">{state.error}</p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

export function DemoFill({
  email,
  label,
}: {
  email: string;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="justify-start"
      onClick={() => {
        const emailInput = document.getElementById("email") as HTMLInputElement | null;
        const passwordInput = document.getElementById(
          "password",
        ) as HTMLInputElement | null;
        if (emailInput) emailInput.value = email;
        if (passwordInput) passwordInput.value = "Campus@2026";
      }}
    >
      {label}
    </Button>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData) => registerAction(formData),
    null,
  );

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required placeholder="Your name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">College email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="rollNumber">Roll number</Label>
          <Input id="rollNumber" name="rollNumber" placeholder="BT21CSE000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cgpa">CGPA</Label>
          <Input
            id="cgpa"
            name="cgpa"
            type="number"
            step="0.01"
            min="0"
            max="10"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="branch">Branch</Label>
        <select
          id="branch"
          name="branch"
          defaultValue="CSE"
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
        >
          {BRANCHES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password (8+ characters)</Label>
        <Input id="password" name="password" type="password" minLength={8} required />
      </div>
      {state?.error ? (
        <p className="text-sm text-rose-700">{state.error}</p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create student account"}
      </Button>
    </form>
  );
}

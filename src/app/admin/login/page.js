"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Alert, Button, Field, Input } from "@/components/admin/ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const { signInAdmin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInAdmin(email, password);
      router.replace("/admin");
    } catch (submitError) {
      setError(submitError.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <p className="font-display text-2xl font-bold text-navy">
            OROS <span className="text-primary">admin</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to manage the catalogue
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-slate-200"
        >
          <Alert onDismiss={() => setError("")}>{error}</Alert>

          <Field label="Email" required>
            <Input
              type="email"
              value={email}
              autoComplete="username"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@oros.com"
              required
            />
          </Field>

          <Field label="Password" required>
            <Input
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </Field>

          <Button type="submit" loading={loading} className="w-full">
            Sign in
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Uses SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD from the API .env
        </p>
      </div>
    </div>
  );
}

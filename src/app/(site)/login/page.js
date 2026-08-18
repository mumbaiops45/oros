"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login as requestLoginOtp } from "@/api/auth.api";
import { useAuth } from "@/hooks/useAuth";
import { useCountdown } from "@/hooks/useCountdown";
import { dashboardPath } from "@/lib/auth";
import {
  AuthButton,
  AuthField,
  AuthLink,
  AuthShell,
  Notice,
  OtpInput,
  PhoneInput,
} from "@/components/auth/ui";

const RESEND_SECONDS = 30;

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, ready, signInWithOtp } = useAuth();
  const resend = useCountdown();

  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState(params.get("phone") || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(
    params.get("registered")
      ? "Account created. Sign in with a one-time password to finish."
      : ""
  );
  const [loading, setLoading] = useState(false);

  // Where to land once the token is in hand: back where they came from if a
  // guard sent them here, otherwise the panel their role belongs to.
  const next = params.get("next");

  useEffect(() => {
    if (ready && user) router.replace(next || dashboardPath(user));
  }, [ready, user, next, router]);

  const sendOtp = async ({ silent = false } = {}) => {
    setError("");
    setLoading(true);

    try {
      await requestLoginOtp(phone);
      setStep("otp");
      resend.start(RESEND_SECONDS);
      if (!silent) setNotice(`We sent a 6-digit code to +91 ${phone}.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPhone = (event) => {
    event.preventDefault();

    if (phone.length !== 10) {
      setError("Enter the 10-digit mobile number you registered with.");
      return;
    }

    setNotice("");
    sendOtp();
  };

  const onSubmitOtp = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const signedIn = await signInWithOtp(phone, otp);
      router.replace(next || dashboardPath(signedIn));
    } catch (submitError) {
      setError(submitError.message);
      setLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <AuthShell
        eyebrow="One more step"
        title="Enter your code"
        subtitle={`We sent a 6-digit one-time password to +91 ${phone}.`}
        footer={
          <>
            Wrong number?{" "}
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError("");
                setNotice("");
              }}
              className="font-semibold text-primary hover:underline"
            >
              Change it
            </button>
          </>
        }
      >
        <form onSubmit={onSubmitOtp} className="space-y-5">
          <Notice tone="error">{error}</Notice>

          <AuthField label="One-time password">
            <OtpInput value={otp} onChange={setOtp} disabled={loading} />
          </AuthField>

          <AuthButton type="submit" loading={loading} disabled={otp.length < 6}>
            Verify and sign in
          </AuthButton>

          <button
            type="button"
            disabled={resend.seconds > 0 || loading}
            onClick={() => sendOtp({ silent: true })}
            className="w-full text-center text-sm text-navy/60 transition hover:text-primary disabled:cursor-not-allowed disabled:text-navy/35"
          >
            {resend.seconds > 0
              ? `Resend code in ${resend.seconds}s`
              : "Resend code"}
          </button>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      subtitle="Your mobile number is your account. We send a one-time password — no passwords to remember."
      footer={
        <>
          New to OROS? <AuthLink href="/register">Create an account</AuthLink>
        </>
      }
    >
      <form onSubmit={onSubmitPhone} className="space-y-5">
        <Notice tone="error">{error}</Notice>
        <Notice tone="success">{!error ? notice : ""}</Notice>

        <AuthField label="Mobile number" hint="The number you registered with.">
          <PhoneInput
            value={phone}
            onChange={setPhone}
            placeholder="98765 43210"
            autoFocus
          />
        </AuthField>

        <AuthButton type="submit" loading={loading} disabled={phone.length !== 10}>
          Send one-time password
        </AuthButton>
      </form>

      <p className="mt-6 border-t border-navy/10 pt-5 text-center text-xs text-navy/50">
        Staff sign in on the <AuthLink href="/admin/login">admin panel</AuthLink>.
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  // useSearchParams needs a boundary it can suspend against while the
  // request-time values are read.
  return (
    <Suspense fallback={<div className="min-h-[70vh] bg-cream" />}>
      <LoginForm />
    </Suspense>
  );
}

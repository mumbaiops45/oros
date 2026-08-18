"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { register, verifyRegisterOtp } from "@/api/auth.api";
import { useAuth } from "@/hooks/useAuth";
import { useCountdown } from "@/hooks/useCountdown";
import { dashboardPath } from "@/lib/auth";
import {
  AuthButton,
  AuthField,
  AuthInput,
  AuthLink,
  AuthShell,
  Notice,
  OtpInput,
  PhoneInput,
} from "@/components/auth/ui";

const RESEND_SECONDS = 30;

const EMPTY = { name: "", email: "", phone: "" };

/**
 * Registration is two calls: /auth/register sends the OTP, and
 * /auth/register/otp-verify creates the account. That second call returns the
 * new user but no token — minting one is the login endpoint's job — so a
 * verified registration hands straight over to /login with the number filled
 * in.
 */
export default function RegisterPage() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const resend = useCountdown();

  const [step, setStep] = useState("details");
  const [form, setForm] = useState(EMPTY);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace(dashboardPath(user));
  }, [ready, user, router]);

  const set = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const sendOtp = async () => {
    setError("");
    setLoading(true);

    try {
      await register(form);
      setStep("otp");
      resend.start(RESEND_SECONDS);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitDetails = (event) => {
    event.preventDefault();

    if (form.phone.length !== 10) {
      setError("Enter a 10-digit mobile number.");
      return;
    }

    sendOtp();
  };

  const onSubmitOtp = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verifyRegisterOtp({ ...form, otp });
      router.replace(`/login?phone=${form.phone}&registered=1`);
    } catch (submitError) {
      setError(submitError.message);
      setLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <AuthShell
        eyebrow="Verify your number"
        title="Enter your code"
        subtitle={`We sent a 6-digit one-time password to +91 ${form.phone}.`}
        footer={
          <>
            Typo in your details?{" "}
            <button
              type="button"
              onClick={() => {
                setStep("details");
                setOtp("");
                setError("");
              }}
              className="font-semibold text-primary hover:underline"
            >
              Go back
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
            Create my account
          </AuthButton>

          <button
            type="button"
            disabled={resend.seconds > 0 || loading}
            onClick={sendOtp}
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
      eyebrow="Join the studio"
      title="Create your account"
      subtitle="Track your orders, save your designs and unlock bulk pricing from 10 units."
      footer={
        <>
          Already have an account? <AuthLink href="/login">Sign in</AuthLink>
        </>
      }
    >
      <form onSubmit={onSubmitDetails} className="space-y-5">
        <Notice tone="error">{error}</Notice>

        <AuthField label="Full name">
          <AuthInput
            value={form.name}
            onChange={set("name")}
            autoComplete="name"
            placeholder="Aarav Sharma"
            required
          />
        </AuthField>

        <AuthField label="Email">
          <AuthInput
            type="email"
            value={form.email}
            onChange={set("email")}
            autoComplete="email"
            placeholder="you@company.com"
            required
          />
        </AuthField>

        <AuthField
          label="Mobile number"
          hint="This is what you will sign in with."
        >
          <PhoneInput
            value={form.phone}
            onChange={(phone) => setForm((current) => ({ ...current, phone }))}
            placeholder="98765 43210"
            required
          />
        </AuthField>

        <AuthButton type="submit" loading={loading}>
          Send one-time password
        </AuthButton>
      </form>
    </AuthShell>
  );
}

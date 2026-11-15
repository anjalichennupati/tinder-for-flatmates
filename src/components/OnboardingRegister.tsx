import { useState } from "react";
import { register } from "../api";
import type { User } from "../types";

const DEMO_OTP = "123456";

type Step = "details" | "otp";

export default function OnboardingRegister({
  onDone,
}: {
  onDone: (user: User) => void;
}) {
  const [step, setStep] = useState<Step>("details");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const mobileValid = /^[6-9]\d{9}$/.test(mobile);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function submitDetails(e: React.FormEvent) {
    e.preventDefault();
    if (!mobileValid) return setError("Enter a valid 10-digit mobile number.");
    if (!emailValid) return setError("Enter a valid email address.");
    setError("");
    setStep("otp");
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.trim() !== DEMO_OTP) {
      return setError("Incorrect OTP. (Hint: use 123456 for this demo.)");
    }
    setError("");
    try {
      onDone(await register(mobile, email));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-5 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-brand tracking-tight">FlatMate</h1>
        <p className="mt-2 text-sm opacity-70">Find your perfect Bangalore flatmate 🏠</p>
      </div>

      <div className="w-full max-w-sm rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur shadow-xl p-6">
        {step === "details" ? (
          <form onSubmit={submitDetails} className="space-y-4">
            <h2 className="text-lg font-semibold">Create your account</h2>

            <label className="block">
              <span className="text-xs font-medium opacity-70">Mobile number</span>
              <div className="mt-1 flex items-center rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3">
                <span className="text-sm opacity-60 pr-2 border-r border-black/10 dark:border-white/15">+91</span>
                <input
                  inputMode="numeric"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder="9876543210"
                  className="flex-1 bg-transparent py-2.5 pl-2 outline-none text-sm"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-medium opacity-70">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2.5 outline-none text-sm"
              />
            </label>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={!mobileValid || !emailValid}
              className="w-full rounded-full bg-brand text-white font-semibold py-3 disabled:opacity-40 active:scale-[0.98] transition"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-4">
            <button
              type="button"
              onClick={() => { setStep("details"); setError(""); }}
              className="text-xs opacity-60 hover:opacity-100"
            >
              ← Edit details
            </button>
            <h2 className="text-lg font-semibold">Verify it's you</h2>
            <p className="text-sm opacity-70">
              We sent a code to <strong>+91 {mobile}</strong> and{" "}
              <strong>{email}</strong>.
            </p>
            <div className="rounded-xl bg-brand/10 text-brand text-xs px-3 py-2">
              Demo mode — your OTP is <strong>123456</strong>
            </div>

            <input
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="● ● ● ● ● ●"
              className="w-full text-center tracking-[0.5em] text-lg rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-3 outline-none"
            />

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={otp.length !== 6}
              className="w-full rounded-full bg-brand text-white font-semibold py-3 disabled:opacity-40 active:scale-[0.98] transition"
            >
              Verify & continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

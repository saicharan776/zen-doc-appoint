import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Stethoscope, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp, getCurrentUser } from "@/lib/supabase";
import { createUserProfile, createDoctor, createPatient } from "@/lib/supabase-queries";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — MediCare Connect" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const benefits =
    role === "patient"
      ? [
          "Book appointments instantly",
          "Save medical history securely",
          "Get reminders & prescriptions",
        ]
      : ["Manage schedule & slots", "Accept appointments online", "Issue digital prescriptions"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setStatus(null);

    if (!agreed) {
      setError("Please accept the terms and conditions before continuing.");
      return;
    }

    if (!email.includes("@") || password.length < 8) {
      setError("Enter a valid email and a password with at least 8 characters.");
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (role === "doctor" && (!specialization.trim() || !registrationNumber.trim())) {
      setError("Please add your specialization and registration number.");
      return;
    }

    setLoading(true);

    try {
      console.log("[register] signup start", { email, role });

      const { data, error: signUpError } = await signUp(email, password, {
        role,
        full_name: `${firstName} ${lastName}`,
        specialization: role === "doctor" ? specialization.trim() : null,
        registrationNumber: role === "doctor" ? registrationNumber.trim() : null,
      });

      if (signUpError) {
        const rawMessage = signUpError.message || "Unable to create account.";
        const friendlyMessage = rawMessage.includes("already")
          ? "An account with this email already exists. Please sign in or use a different email."
          : rawMessage;

        setError(friendlyMessage);
        toast.error(friendlyMessage);
        console.error("[register] signup failed", signUpError);
        return;
      }

      if (!data?.user) {
        const fallback = "Unable to create account. Please try again.";
        setError(fallback);
        toast.error(fallback);
        console.error("[register] signup missing user data", { data });
        return;
      }

      const authUserId = data.user.id;
      console.log("[register] auth success", { authUserId, hasSession: Boolean(data.session) });

      const profileResult = await createUserProfile(authUserId, {
        email,
        role,
        full_name: `${firstName} ${lastName}`,
      });

      if (profileResult.error) {
        const message = profileResult.error.message || "Failed to create user profile.";
        setError(message);
        toast.error(message);
        console.error("[register] profile insert failed", profileResult.error);
        return;
      }

      console.log("[register] profile inserted", { authUserId });

      if (role === "doctor") {
        const doctorResult = await createDoctor({
          user_id: authUserId,
          specialization: specialization.trim(),
          experience: 0,
          consultation_fee: "0",
        });

        if (doctorResult.error) {
          const message = doctorResult.error.message || "Failed to create doctor profile.";
          setError(message);
          toast.error(message);
          console.error("[register] doctor insert failed", doctorResult.error);
          return;
        }

        console.log("[register] doctor profile created", { userId: authUserId });
      } else {
        const patientResult = await createPatient({ user_id: authUserId });

        if (patientResult.error) {
          const message = patientResult.error.message || "Failed to create patient profile.";
          setError(message);
          toast.error(message);
          console.error("[register] patient insert failed", patientResult.error);
          return;
        }

        console.log("[register] patient profile created", { userId: authUserId });
      }

      const successMessage = data.session
        ? "Account created successfully. Redirecting now."
        : "Account created successfully. Please check your email to confirm your account before signing in.";

      toast.success(successMessage);
      setStatus(successMessage);

      const nextPath = role === "patient" ? "/patient/" : "/login";

      console.log("[register] redirect start", { nextPath });

      // TanStack Router navigation
      navigate({ to: nextPath });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(message);
      toast.error(message);
      console.error("[register] unexpected error", err);
    } finally {
      setLoading(false);
      console.log("[register] loading cleanup");
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <div className="hidden bg-medical-gradient lg:flex lg:flex-col lg:justify-between lg:p-10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Stethoscope className="size-5" />
          </div>
          <span className="text-lg font-bold">MediCare Connect</span>
        </Link>
        <div className="max-w-sm">
          <h2 className="text-3xl font-bold leading-tight">
            Join thousands managing their care online.
          </h2>
          <ul className="mt-6 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="size-4 text-success" /> {b}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 MediCare Connect</p>
      </div>

      <div className="flex flex-col px-6 py-10 sm:px-10 lg:px-16">
        <div className="lg:hidden">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Stethoscope className="size-5" />
            </div>
            <span className="text-lg font-bold">MediCare Connect</span>
          </Link>
        </div>

        <div className="m-auto w-full max-w-md">
          <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Start your healthcare journey in seconds
          </p>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          {status && (
            <div
              role="status"
              className="mt-4 rounded-lg bg-success/10 p-3 text-sm text-success-foreground"
            >
              {status}
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-1.5 rounded-xl bg-secondary p-1">
            {(["patient", "doctor"] as const).map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={role === r}
                onClick={() => {
                  setRole(r);
                  setError(null);
                  setStatus(null);
                }}
                className={`rounded-lg py-2 text-xs font-semibold capitalize transition-colors ${role === r ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"}`}
              >
                I'm a {r}
              </button>
            ))}
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fname">First name</Label>
                <Input
                  id="fname"
                  required
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lname">Last name</Label>
                <Input
                  id="lname"
                  required
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
                aria-invalid={Boolean(error)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
                aria-invalid={Boolean(error)}
              />
            </div>
            {role === "doctor" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="spec">Specialization</Label>
                  <Input
                    id="spec"
                    required
                    placeholder="e.g. Cardiology"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg">Medical registration number</Label>
                  <Input
                    id="reg"
                    required
                    placeholder="MCI / state council number"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <p className="rounded-lg bg-warning/15 px-3 py-2 text-xs text-warning-foreground">
                  Doctor accounts go through admin verification before going live.
                </p>
              </>
            )}

            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                required
                className="mt-0.5 size-4 accent-primary"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={loading}
              />
              I agree to the Terms of Service and Privacy Policy
            </label>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

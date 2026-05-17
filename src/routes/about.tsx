import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeartPulse, ShieldCheck, Users, Globe, Award, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — MediCare Connect" },
      {
        name: "description",
        content:
          "Learn how MediCare Connect is reimagining accessible, trusted healthcare for patients, doctors and administrators.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-medical-gradient">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-primary">About MediCare Connect</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Healthcare that actually works for everyone.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            We're building an accessible, secure and modern platform that connects patients to
            verified doctors — and gives clinicians the tools they need to deliver great care.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              i: HeartPulse,
              t: "Patient first",
              d: "Every flow is designed to reduce friction and anxiety for patients seeking care.",
            },
            {
              i: ShieldCheck,
              t: "Privacy by design",
              d: "End-to-end encryption, RLS-enforced access and audit logs for sensitive data.",
            },
            {
              i: Users,
              t: "Empowered clinicians",
              d: "Tools that save time so doctors can focus on patients, not paperwork.",
            },
          ].map((v) => (
            <div key={v.t} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <v.i className="size-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{v.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold text-primary">Our mission</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Make trusted healthcare accessible to everyone, everywhere.
            </h2>
            <p className="mt-4 text-muted-foreground">
              We're starting with online appointment booking and clinical workflow tools, and
              expanding into telemedicine, insurance and AI-assisted care in future versions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { i: Globe, v: "12+", l: "Cities served" },
              { i: Users, v: "12,800+", l: "Patients" },
              { i: Award, v: "320+", l: "Verified doctors" },
              { i: Sparkles, v: "4.9★", l: "Avg. rating" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <s.i className="size-6 text-accent" />
                <p className="mt-3 text-2xl font-bold">{s.v}</p>
                <p className="text-xs text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

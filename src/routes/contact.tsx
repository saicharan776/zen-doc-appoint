import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — MediCare Connect" },
      {
        name: "description",
        content:
          "Get in touch with our care and support team for any questions about MediCare Connect.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-medical-gradient py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-primary">We're here to help</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Talk to our care team
          </h1>
          <p className="mt-4 text-muted-foreground">
            Questions about appointments, your account or being a doctor on MediCare? Drop us a
            note.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.5fr] lg:px-8">
        <div className="space-y-4">
          {[
            { i: Mail, t: "Email", v: "care@medicareconnect.app" },
            { i: Phone, t: "Phone", v: "+91 1800 123 4567" },
            { i: MapPin, t: "Office", v: "Bandra Kurla Complex, Mumbai" },
          ].map((c) => (
            <div
              key={c.t}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <c.i className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{c.t}</p>
                <p className="text-sm text-muted-foreground">{c.v}</p>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="rounded-2xl border border-border bg-card p-6 shadow-card"
        >
          {sent ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 className="size-12 text-success" />
              <h3 className="mt-3 text-lg font-semibold">Message received</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Our team will get back to you within 24 hours.
              </p>
              <Button onClick={() => setSent(false)} variant="outline" className="mt-5">
                Send another
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold">Send us a message</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" required placeholder="Jane Doe" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required placeholder="jane@example.com" />
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" required placeholder="How can we help?" />
              </div>
              <div className="mt-4 space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={5} required placeholder="Tell us more…" />
              </div>
              <Button type="submit" size="lg" className="mt-5 w-full sm:w-auto">
                <Send className="size-4" /> Send message
              </Button>
            </>
          )}
        </form>
      </section>
      <SiteFooter />
    </div>
  );
}

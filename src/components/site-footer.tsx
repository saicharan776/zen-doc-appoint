import { Link } from "@tanstack/react-router";
import { Stethoscope, Twitter, Linkedin, Instagram } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Stethoscope className="size-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">MediCare Connect</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Modern healthcare access — book trusted doctors, manage appointments and prescriptions
            in one secure place.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Platform</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/doctors" className="hover:text-foreground">
                Find doctors
              </Link>
            </li>
            <li>
              <Link to="/patient" className="hover:text-foreground">
                Patient dashboard
              </Link>
            </li>
            <li>
              <Link to="/doctor" className="hover:text-foreground">
                For doctors
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-foreground">
                Admin console
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-foreground">
                About us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-foreground">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-foreground">
                Terms
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Stay in touch</h4>
          <p className="mt-4 text-sm text-muted-foreground">care@medicareconnect.app</p>
          <div className="mt-4 flex gap-2">
            {[Twitter, Linkedin, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social"
                className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 MediCare Connect. All rights reserved.</p>
          <p>Made with care for healthier lives.</p>
        </div>
      </div>
    </footer>
  );
}

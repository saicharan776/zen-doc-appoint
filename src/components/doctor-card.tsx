import { Link } from "@tanstack/react-router";
import { Star, MapPin, BadgeCheck, Clock, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Doctor } from "@/lib/mock-data";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card">
      <div className="flex items-start gap-4">
        <img
          src={doctor.avatar || "https://via.placeholder.com/150"}
          alt={doctor.name}
          className="size-16 rounded-xl object-cover ring-2 ring-primary-soft"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-base font-semibold">{doctor.name}</h3>
            {doctor.verified && <BadgeCheck className="size-4 shrink-0 text-primary" />}
          </div>
          <p className="text-sm text-muted-foreground">
            {typeof doctor.specialization === "object"
              ? doctor.specialization?.name || "General"
              : doctor.specialization}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{doctor.qualifications}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Star className="size-3.5 fill-warning text-warning" />
          <span className="font-semibold text-foreground">{doctor.rating}</span>
          <span>({doctor.reviews})</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="size-3.5" /> {doctor.location}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="size-3.5" /> {doctor.experience} yrs
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <IndianRupee className="size-3.5" /> ₹{doctor.fee}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-primary-soft/60 px-3 py-2">
        <span className="text-xs text-muted-foreground">Next slot</span>
        <span
          className={`text-xs font-semibold ${doctor.available ? "text-success" : "text-muted-foreground"}`}
        >
          {doctor.nextSlot}
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link to="/doctors/$doctorId" params={{ doctorId: doctor.id }}>
            View profile
          </Link>
        </Button>
        <Button asChild size="sm" className="flex-1">
          <Link to="/doctors/$doctorId" params={{ doctorId: doctor.id }} hash="book">
            Book now
          </Link>
        </Button>
      </div>
    </article>
  );
}

import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { getContact } from "@/lib/data/contact";
import Reveal from "@/components/anim/Reveal";
import ContactForm from "@/components/contact/ContactForm";

const socialSvgs = {
  Linkedin: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4.98 3.5C3.33 3.5 2 4.83 2 6.48c0 1.65 1.33 2.98 2.98 2.98 1.64 0 2.97-1.33 2.97-2.98A2.98 2.98 0 0 0 4.98 3.5ZM2.4 21h5.16V9.16H2.4V21Zm7.66-11.84V21h5.16v-6.47c0-3.45 4.5-3.73 4.5 0V21h5.16v-7.95c0-6.14-6.73-5.92-8.66-2.9V9.16H10.06Z" />
    </svg>
  ),
  Github: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .5C5.7.5.6 5.6.6 12c0 5.1 3.3 9.4 7.8 10.9.6.1.8-.2.8-.5v-1.7c-3.2.7-3.9-1.6-3.9-1.6-.5-1.2-1.1-1.6-1.1-1.6-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .9.1-.6.4-1.1.7-1.3-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 2 1.2 3.3 0 4.5-2.7 5.5-5.3 5.8.4.3.7.9.7 1.8v2.6c0 .3.2.6.8.5a11.5 11.5 0 0 0 7.8-10.9C23.4 5.6 18.3.5 12 .5Z" />
    </svg>
  ),
};

// Metadata is provided by contact/layout.tsx.
export const revalidate = 60;

function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card/50 backdrop-blur-md p-4 transition-colors hover:border-primary/40">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-accent">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <span className="block truncate text-foreground">{value}</span>
      </span>
      {href && <ArrowUpRight size={16} className="ml-auto text-muted-foreground" />}
    </div>
  );
  return href ? (
    <a href={href} className="block">
      {inner}
    </a>
  ) : (
    inner
  );
}

export default async function ContactPage() {
  const contact = await getContact();

  if (!contact) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">No contact info found. Add details in admin.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <Reveal className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start" stagger={0.12}>
        {/* Left: pitch + info */}
        <div>
          <p className="eyebrow text-sm mb-3">{"// get in touch"}</p>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight">
            Let&rsquo;s <span className="text-gradient">connect</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-md">
            Have a project, a role, or just want to say hi? Drop a message or reach
            me directly — I usually reply within a day.
          </p>

          <div className="mt-8 space-y-3">
            {contact.email && (
              <InfoRow icon={<Mail size={18} />} label="email" value={contact.email} href={`mailto:${contact.email}`} />
            )}
            {contact.phone && (
              <InfoRow icon={<Phone size={18} />} label="phone" value={contact.phone} href={`tel:${contact.phone}`} />
            )}
            {contact.location && (
              <InfoRow icon={<MapPin size={18} />} label="location" value={contact.location} />
            )}
          </div>

          {contact.socials.length > 0 && (
            <div className="mt-8">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                find me online
              </p>
              <div className="flex gap-3">
                {contact.socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-card/50 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {socialSvgs[s.platform as keyof typeof socialSvgs] ?? s.platform.slice(0, 2)}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: form */}
        <div className="lg:sticky lg:top-28">
          <ContactForm resumeUrl={contact.resumeUrl} />
        </div>
      </Reveal>
    </section>
  );
}

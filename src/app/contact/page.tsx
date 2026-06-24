import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import { getContact } from "@/lib/data/contact";
import Reveal from "@/components/anim/Reveal";
import ContactForm from "@/components/contact/ContactForm";

const socialSvgs = {
  Linkedin: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4.98 3.5C3.33 3.5 2 4.83 2 6.48c0 1.65 1.33 2.98 2.98 2.98 1.64 0 2.97-1.33 2.97-2.98A2.98 2.98 0 0 0 4.98 3.5ZM2.4 21h5.16V9.16H2.4V21Zm7.66-11.84V21h5.16v-6.47c0-3.45 4.5-3.73 4.5 0V21h5.16v-7.95c0-6.14-6.73-5.92-8.66-2.9V9.16H10.06Z" />
    </svg>
  ),
  Github: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .5C5.7.5.6 5.6.6 12c0 5.1 3.3 9.4 7.8 10.9.6.1.8-.2.8-.5v-1.7c-3.2.7-3.9-1.6-3.9-1.6-.5-1.2-1.1-1.6-1.1-1.6-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .9.1-.6.4-1.1.7-1.3-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 2 1.2 3.3 0 4.5-2.7 5.5-5.3 5.8.4.3.7.9.7 1.8v2.6c0 .3.2.6.8.5a11.5 11.5 0 0 0 7.8-10.9C23.4 5.6 18.3.5 12 .5Z" />
    </svg>
  ),
};

// Metadata is provided by contact/layout.tsx.
export const revalidate = 60;

export default async function ContactPage() {
  const contact = await getContact();

  if (!contact) {
    return (
      <section className="min-h-screen flex items-center justify-center text-white">
        <p className="text-slate-400">No contact info found. Add details in admin.</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-transparent text-white py-20 px-6">
      {/* Heading */}
      <Reveal className="text-center mb-16">
        <Mail className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold">
          Contact <span className="text-indigo-400">Me</span>
        </h1>
        <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
          Have a project in mind or want to collaborate? Get in touch or download my resume.
        </p>
      </Reveal>

      {/* Form + media */}
      <Reveal
        className="flex flex-col md:flex-row items-center gap-10 max-w-6xl mx-auto mb-20"
        stagger={0.15}
      >
        <ContactForm resumeUrl={contact.resumeUrl} />

        <div className="flex-1">
          {contact.mediaUrl?.endsWith(".mp4") ? (
            <video
              src={contact.mediaUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
            />
          ) : contact.mediaUrl ? (
            <Image
              src={contact.mediaUrl}
              alt="Decorative media"
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
              width={500}
              height={500}
            />
          ) : null}
        </div>
      </Reveal>

      {/* Contact info */}
      <Reveal
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center"
        stagger={0.12}
      >
        {contact.phone && (
          <a
            className="flex flex-col items-center gap-2 p-6 bg-slate-800/70 rounded-2xl shadow-md border border-slate-700"
            href={`tel:${contact.phone}`}
          >
            <Phone className="w-6 h-6 text-indigo-400" />
            <p>{contact.phone}</p>
          </a>
        )}
        {contact.email && (
          <a
            className="flex flex-col items-center gap-2 p-6 bg-slate-800/70 rounded-2xl shadow-md border border-slate-700"
            href={`mailto:${contact.email}`}
          >
            <Mail className="w-6 h-6 text-indigo-400" />
            <p>{contact.email}</p>
          </a>
        )}
        {contact.location && (
          <address className="flex flex-col items-center gap-2 p-6 bg-slate-800/70 rounded-2xl shadow-md border border-slate-700 not-italic">
            <MapPin className="w-6 h-6 text-indigo-400" />
            <p>{contact.location}</p>
          </address>
        )}

        <div className="flex flex-col items-center gap-3 p-6 bg-slate-800/70 rounded-2xl shadow-md border border-slate-700">
          <p className="font-semibold text-indigo-400">Find me online</p>
          <div className="flex gap-4">
            {contact.socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-400 transition"
              >
                {socialSvgs[s.platform as keyof typeof socialSvgs]}
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

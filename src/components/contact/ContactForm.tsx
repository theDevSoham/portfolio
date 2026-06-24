"use client";

import { useCallback, useEffect, useRef } from "react";
import { Mail, Download } from "lucide-react";
import { useForm, ValidationError } from "@formspree/react";

type Grecaptcha = { execute: (key: string, opts: { action: string }) => Promise<string> };

export default function ContactForm({ resumeUrl }: { resumeUrl?: string | null }) {
  const [state, handleSubmit] = useForm("mvgbeqag");
  const formRef = useRef<HTMLFormElement>(null);

  // Load reCAPTCHA v3 once.
  useEffect(() => {
    if (document.querySelector("#recaptcha-script")) return;
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.id = "recaptcha-script";
    document.body.appendChild(script);
  }, []);

  // Reset + notify on success (effect, not during render).
  useEffect(() => {
    if (state.succeeded) {
      formRef.current?.reset();
      alert("Thank you for contacting me. I'll reach out shortly");
    }
  }, [state.succeeded]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const grecaptcha = (window as unknown as { grecaptcha?: Grecaptcha }).grecaptcha;
      if (!grecaptcha) {
        console.error("reCAPTCHA not loaded yet");
        return;
      }

      const token = await grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string,
        { action: "contact_form" }
      );

      const formData = new FormData(formRef.current!);
      formData.append("g-recaptcha-response", token);
      await handleSubmit(formData);
    },
    [handleSubmit]
  );

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="flex-1 flex flex-col gap-6 bg-slate-800/70 backdrop-blur-md rounded-2xl p-4 lg:p-8 shadow-lg border border-slate-700"
    >
      <input
        type="text"
        name="user_name"
        placeholder="Your Name"
        required
        className="p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <input
        type="email"
        name="user_email"
        placeholder="Your Email"
        required
        className="p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <textarea
        placeholder="Your Message"
        name="user_message"
        rows={5}
        required
        className="p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <button
        type="submit"
        disabled={state.submitting}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-60"
      >
        {state.submitting ? "Sending…" : "Send Message"} <Mail size={18} />
      </button>
      <ValidationError errors={state.errors} />

      {resumeUrl && (
        <a
          href={resumeUrl}
          download
          className="flex items-center justify-center gap-2 px-6 py-3 border border-indigo-400 rounded-xl font-medium hover:bg-indigo-600 hover:text-white transition"
        >
          Download Resume <Download size={18} />
        </a>
      )}
    </form>
  );
}

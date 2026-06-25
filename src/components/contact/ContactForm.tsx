"use client";

import { useCallback, useEffect, useRef } from "react";
import { Mail, Download } from "lucide-react";
import { useForm, ValidationError } from "@formspree/react";
import Button, { buttonVariants } from "@/components/ui/Button";

type Grecaptcha = { execute: (key: string, opts: { action: string }) => Promise<string> };

const inputClass =
  "p-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export default function ContactForm({ resumeUrl }: { resumeUrl?: string | null }) {
  const [state, handleSubmit] = useForm("mvgbeqag");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (document.querySelector("#recaptcha-script")) return;
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.id = "recaptcha-script";
    document.body.appendChild(script);
  }, []);

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
      className="flex-1 flex flex-col gap-5 rounded-2xl border border-border bg-card/70 backdrop-blur-md p-6 lg:p-8 shadow-lg"
    >
      <input type="text" name="user_name" placeholder="Your Name" required className={inputClass} />
      <input type="email" name="user_email" placeholder="Your Email" required className={inputClass} />
      <textarea
        placeholder="Your Message"
        name="user_message"
        rows={5}
        required
        className={inputClass}
      />

      <Button type="submit" variant="gradient" disabled={state.submitting}>
        {state.submitting ? "Sending…" : "Send Message"} <Mail size={18} />
      </Button>
      <ValidationError errors={state.errors} />

      {resumeUrl && (
        <a href={resumeUrl} download className={buttonVariants({ variant: "outline" })}>
          Download Resume <Download size={18} />
        </a>
      )}
    </form>
  );
}

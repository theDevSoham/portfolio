import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/anim/Reveal";
import { Container } from "@/components/ui/Container";
import { buttonVariants } from "@/components/ui/Button";

export function ContactCTA() {
  return (
    <Container className="py-24">
      <Reveal>
        <div className="ring-gradient relative overflow-hidden rounded-3xl border border-border bg-card/40 backdrop-blur-md px-8 py-16 md:px-16 md:py-20 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[60%] h-48 rounded-full blur-3xl opacity-30"
            style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
          />
          <p className="eyebrow text-sm">{"// let's talk"}</p>
          <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight mt-3">
            Let&rsquo;s build something <span className="text-gradient">together</span>.
          </h2>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
            Have an idea, a role, or a project in mind? I&rsquo;m one message away.
          </p>
          <div className="mt-9">
            <Link href="/contact" className={buttonVariants({ variant: "gradient", size: "lg" })}>
              Start a conversation <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </Reveal>
    </Container>
  );
}

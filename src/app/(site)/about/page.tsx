import type { Metadata } from "next";
import { Briefcase, GraduationCap, Code, Trophy, User } from "lucide-react";
import { getAbout } from "@/lib/data/about";
import Reveal from "@/components/anim/Reveal";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/Section";
import { Timeline, TimelineItem } from "@/components/ui/Timeline";

export const metadata: Metadata = {
  title: "About | Soham Das",
  description: "About Soham Das — background, education, experience, and skills.",
};

export const revalidate = 60;

export default async function AboutPage() {
  const about = await getAbout();

  if (!about) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">No about info found. Add details in admin.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pt-32 pb-24 space-y-24">
      {/* Intro */}
      <Reveal className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-12 items-center" stagger={0.15}>
        <div className="relative mx-auto lg:mx-0">
          <div
            aria-hidden
            className="absolute -inset-5 rounded-[2rem] blur-3xl opacity-40"
            style={{
              background:
                "conic-gradient(from 180deg, var(--primary), var(--violet), var(--accent), var(--primary))",
            }}
          />
          <div className="ring-gradient relative w-60 h-72 sm:w-72 sm:h-80 rounded-[2rem] overflow-hidden border border-border bg-card/60">
            {about.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={about.avatarUrl} alt={about.name} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <User className="h-20 w-20 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="eyebrow text-sm mb-3">{"// about me"}</p>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight">
            I&rsquo;m <span className="text-gradient">{about.name}</span>
          </h1>
          <p className="mt-3 font-mono text-accent">{about.headline}</p>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{about.bio}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              {about.experiences.length} roles
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              {about.skills.length} technologies
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              {about.education.length} qualifications
            </Badge>
          </div>
        </div>
      </Reveal>

      {/* Experience */}
      <div>
        <Reveal>
          <SectionHeading eyebrow="journey" title="Experience" icon={<Briefcase className="text-accent" />} />
        </Reveal>
        {about.experiences.length === 0 ? (
          <p className="text-muted-foreground">No experience added.</p>
        ) : (
          <Reveal>
            <Timeline>
              {about.experiences.map((exp) => (
                <TimelineItem
                  key={exp.id}
                  meta={exp.duration}
                  title={exp.role}
                  subtitle={exp.company}
                >
                  {exp.desc}
                </TimelineItem>
              ))}
            </Timeline>
          </Reveal>
        )}
      </div>

      {/* Education */}
      <div>
        <Reveal>
          <SectionHeading eyebrow="learning" title="Education" icon={<GraduationCap className="text-accent" />} />
        </Reveal>
        {about.education.length === 0 ? (
          <p className="text-muted-foreground">No education details yet.</p>
        ) : (
          <Reveal className="grid md:grid-cols-2 gap-4" stagger={0.1}>
            {about.education.map((edu) => (
              <Card key={edu.id} className="p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-accent mb-1">
                  {edu.startYear} – {edu.endYear}
                </p>
                <h3 className="font-display text-xl font-semibold">{edu.degree}</h3>
                <p className="text-muted-foreground">
                  {edu.school}
                  {edu.grade && <span className="text-accent"> · {edu.grade}</span>}
                </p>
              </Card>
            ))}
          </Reveal>
        )}
      </div>

      {/* Skills */}
      <div>
        <Reveal>
          <SectionHeading eyebrow="toolbox" title="Skills" icon={<Code className="text-accent" />} />
        </Reveal>
        {about.skills.length === 0 ? (
          <p className="text-muted-foreground">No skills added.</p>
        ) : (
          <Reveal className="flex flex-wrap gap-3" stagger={0.04}>
            {about.skills.map((skill) => (
              <Badge key={skill.id} variant="primary" className="px-4 py-2 text-sm">
                {skill.name}
              </Badge>
            ))}
          </Reveal>
        )}
      </div>

      {/* Achievements */}
      {about.achievements.length > 0 && (
        <div>
          <Reveal>
            <SectionHeading eyebrow="wins" title="Achievements" icon={<Trophy className="text-accent" />} />
          </Reveal>
          <Reveal className="grid md:grid-cols-2 gap-4" stagger={0.1}>
            {about.achievements.map((ach) => (
              <Card key={ach.id} className="p-5 flex gap-3 items-start">
                <Trophy className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{ach.text}</span>
              </Card>
            ))}
          </Reveal>
        </div>
      )}
    </section>
  );
}

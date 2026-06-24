import type { Metadata } from "next";
import { User, Briefcase, GraduationCap, Code, Trophy } from "lucide-react";
import { getAbout } from "@/lib/data/about";
import Reveal from "@/components/anim/Reveal";

export const metadata: Metadata = {
  title: "About | Soham Das",
  description: "About Soham Das — background, education, experience, and skills.",
};

export const revalidate = 60;

export default async function AboutPage() {
  const about = await getAbout();

  if (!about) {
    return (
      <section className="min-h-screen flex items-center justify-center text-white">
        <p className="text-slate-400">No about info found. Add details in admin.</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-transparent text-white py-20 px-6">
      {/* Heading */}
      <Reveal className="text-center mb-16">
        <User className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold">
          About <span className="text-indigo-400">Me</span>
        </h1>
        <p className="mt-4 text-slate-300 max-w-2xl mx-auto">{about.headline}</p>
      </Reveal>

      {/* Bio */}
      <Reveal
        className="flex flex-col md:flex-row items-center gap-10 max-w-6xl mx-auto mb-20"
        stagger={0.15}
      >
        {about.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={about.avatarUrl}
            alt={about.name}
            className="w-64 h-64 object-cover rounded-2xl shadow-2xl"
          />
        ) : (
          <div className="w-64 h-64 bg-slate-700 rounded-2xl flex items-center justify-center">
            <User className="w-20 h-20 text-slate-500" />
          </div>
        )}
        <div className="flex-1 space-y-4">
          <p className="text-slate-300">{about.bio}</p>
        </div>
      </Reveal>

      {/* Education */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <GraduationCap className="text-indigo-400" /> Education
        </h2>
        {about.education.length === 0 ? (
          <p className="text-slate-500">No education details yet.</p>
        ) : (
          <Reveal stagger={0.12}>
            {about.education.map((edu) => (
              <div
                key={edu.id}
                className="p-6 bg-slate-800/70 rounded-2xl border border-slate-700 shadow-lg mb-4"
              >
                <h3 className="text-xl font-semibold">{edu.degree}</h3>
                <p className="text-slate-300">
                  {edu.school} ({edu.startYear} - {edu.endYear})
                  {edu.grade && <span className="text-indigo-400"> — {edu.grade}</span>}
                </p>
              </div>
            ))}
          </Reveal>
        )}
      </div>

      {/* Experience */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Briefcase className="text-indigo-400" /> Experience
        </h2>
        {about.experiences.length === 0 ? (
          <p className="text-slate-500">No experience added.</p>
        ) : (
          <Reveal stagger={0.12}>
            {about.experiences.map((exp) => (
              <div
                key={exp.id}
                className="p-6 bg-slate-800/70 rounded-2xl border border-slate-700 shadow-lg mb-4"
              >
                <h3 className="text-xl font-semibold">
                  {exp.role} - {exp.company}
                </h3>
                <p className="text-slate-400">{exp.duration}</p>
                <p className="mt-2 text-slate-300">{exp.desc}</p>
              </div>
            ))}
          </Reveal>
        )}
      </div>

      {/* Skills */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Code className="text-indigo-400" /> Skills
        </h2>
        {about.skills.length === 0 ? (
          <p className="text-slate-500">No skills added.</p>
        ) : (
          <Reveal
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            stagger={0.08}
          >
            {about.skills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 bg-slate-800/70 rounded-xl text-center border border-slate-700 transition-transform hover:scale-105 hover:shadow-indigo-500/20"
              >
                {skill.name}
              </div>
            ))}
          </Reveal>
        )}
      </div>

      {/* Achievements */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Trophy className="text-indigo-400" /> Achievements
        </h2>
        {about.achievements.length === 0 ? (
          <p className="text-slate-500">No achievements yet.</p>
        ) : (
          <Reveal
            as="ul"
            className="space-y-4 list-disc list-inside text-slate-300"
            stagger={0.1}
          >
            {about.achievements.map((ach) => (
              <li key={ach.id}>{ach.text}</li>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}

# Portfolio Revamp — Documentation

This folder is the reference library for the revamp of Soham Das's portfolio. It is meant to be **read in order** when starting work, and **referred back to** mid-task.

The "what exists today" baseline lives one level up in [`../CLAUDE_UNDERSTANDINGS.md`](../CLAUDE_UNDERSTANDINGS.md). Read that first.

## Reading order

| Doc | What it covers |
|---|---|
| [01-current-state.md](./01-current-state.md) | Detailed inventory of the current implementation (files, APIs, animations). |
| [02-security-audit.md](./02-security-audit.md) | Severity-ranked vulnerabilities and the fix for each. **Goal #2.** |
| [03-revamp-plan.md](./03-revamp-plan.md) | The sequenced execution plan. The roadmap that ties all goals together. |
| [04-animation-migration.md](./04-animation-migration.md) | Framer Motion → GSAP + Lenis migration, primitive-by-primitive. **Goal #1.** |
| [05-design-system.md](./05-design-system.md) | Design language, tokens, shadcn-style component library. **Goal #3.** |
| [06-architecture-target.md](./06-architecture-target.md) | Target Server/Client component split and data layer. **Goal #2.** |
| [07-experience-and-gamification.md](./07-experience-and-gamification.md) | Loading/entry screens, gamification, 404. **Goal #4.** |

## The four goals (verbatim from the brief)

1. Fully discard Framer Motion; use **GSAP + Lenis** for smooth scroll animations.
2. **Security enhancements** over spinning up client components — proper **Server Components** where appropriate.
3. **Design revamp** — modular design + a shadcn-style component library on Tailwind; full revamp of architecture, look & feel, vibrant developer vibes.
4. A touch of **gamification**, beautiful **loading/entry screens**, and a proper **404**.

## Conventions used in these docs
- ✅ keep · 🔁 refactor · ❌ remove · ➕ add
- Severity: 🔴 critical · 🟠 high · 🟡 medium · 🟢 low
- File references use `path:line` form so they're clickable in the editor.

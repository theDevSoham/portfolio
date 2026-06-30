"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ArrowUp,
  ArrowDown,
  X,
  Plus,
  Image as ImageIcon,
  FolderGit2,
  Star,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { HOME_DEFAULTS } from "@/lib/homeDefaults";
import {
  AdminModal,
  Field,
  adminInput,
  PageHeader,
  Spinner,
  type ToastState,
} from "@/components/admin/AdminKit";

type Proj = {
  id: string;
  title: string;
  slug: string;
  featured: boolean;
  featuredOrder: number;
  images?: { url: string }[];
};

type ImageField = "heroImage" | "statsImage";

type HomeForm = {
  heroBadge: string;
  heroHeadline: string;
  heroHighlight: string;
  heroTagline: string;
  heroRoles: string;
  heroImage: string;
  marqueeItems: string;
  statsEyebrow: string;
  statsTitle: string;
  statsHighlight: string;
  statsImage: string;
  funStatValue: string;
  funStatLabel: string;
  ctaEyebrow: string;
  ctaHeading: string;
  ctaHighlight: string;
  ctaSubtext: string;
  ctaButton: string;
};

const split = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
const join = (a?: string[] | null) => (a && a.length ? a.join(", ") : "");

const iconBtn =
  "grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors";

export default function AdminHome({ onToast }: { onToast: (t: ToastState) => void }) {
  const [form, setForm] = useState<HomeForm | null>(null);
  const [projects, setProjects] = useState<Proj[]>([]);
  const [aboutAvatar, setAboutAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<ImageField | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/home").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/about").then((r) => r.json()),
    ])
      .then(([home, projs, about]) => {
        const skills: string[] = Array.isArray(about?.skills)
          ? about.skills.map((s: { name: string }) => s.name)
          : [];
        setAboutAvatar(about?.avatarUrl ?? null);
        // Pre-fill with the live content (home value → built-in default).
        setForm({
          heroBadge: home?.heroBadge ?? HOME_DEFAULTS.heroBadge,
          heroHeadline: home?.heroHeadline ?? HOME_DEFAULTS.heroHeadline,
          heroHighlight: home?.heroHighlight ?? HOME_DEFAULTS.heroHighlight,
          heroTagline: home?.heroTagline ?? HOME_DEFAULTS.heroTagline,
          heroRoles: home?.heroRoles?.length ? join(home.heroRoles) : HOME_DEFAULTS.heroRoles.join(", "),
          heroImage: home?.heroImage ?? "",
          marqueeItems: home?.marqueeItems?.length
            ? join(home.marqueeItems)
            : (skills.length ? skills : [...HOME_DEFAULTS.marqueeFallback]).join(", "),
          statsEyebrow: home?.statsEyebrow ?? HOME_DEFAULTS.statsEyebrow,
          statsTitle: home?.statsTitle ?? HOME_DEFAULTS.statsTitle,
          statsHighlight: home?.statsHighlight ?? HOME_DEFAULTS.statsHighlight,
          statsImage: home?.statsImage ?? "",
          funStatValue: home?.funStatValue ?? HOME_DEFAULTS.funStatValue,
          funStatLabel: home?.funStatLabel ?? HOME_DEFAULTS.funStatLabel,
          ctaEyebrow: home?.ctaEyebrow ?? HOME_DEFAULTS.ctaEyebrow,
          ctaHeading: home?.ctaHeading ?? HOME_DEFAULTS.ctaHeading,
          ctaHighlight: home?.ctaHighlight ?? HOME_DEFAULTS.ctaHighlight,
          ctaSubtext: home?.ctaSubtext ?? HOME_DEFAULTS.ctaSubtext,
          ctaButton: home?.ctaButton ?? HOME_DEFAULTS.ctaButton,
        });
        setProjects(Array.isArray(projs) ? projs : []);
      })
      .catch(() => onToast({ message: "Failed to load home content", type: "error" }))
      .finally(() => setLoading(false));
  }, [onToast]);

  const set = (k: keyof HomeForm, v: string) =>
    setForm((p) => (p ? { ...p, [k]: v } : p));

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>, field: ImageField) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      set(field, url);
      onToast({ message: "Image uploaded" });
    } catch {
      onToast({ message: "Upload failed", type: "error" });
    } finally {
      setUploading(null);
    }
  };

  const save = async () => {
    if (!form) return;
    setSaving(true);
    const payload = {
      ...form,
      heroRoles: split(form.heroRoles),
      marqueeItems: split(form.marqueeItems),
    };
    try {
      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      onToast({ message: "Home page saved" });
    } catch {
      onToast({ message: "Save failed — check your inputs", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // --- Featured ---
  const featuredList = projects
    .filter((p) => p.featured)
    .sort((a, b) => a.featuredOrder - b.featuredOrder);

  const patchFeatured = async (id: string, body: { featured?: boolean; featuredOrder?: number }) => {
    try {
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...body }),
      });
      if (!res.ok) throw new Error();
      const updated: Proj = await res.json();
      setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, ...updated } : p)));
      return updated;
    } catch {
      onToast({ message: "Update failed", type: "error" });
      return null;
    }
  };

  const toggleFeatured = (p: Proj) => patchFeatured(p.id, { featured: !p.featured });

  const moveFeatured = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= featuredList.length) return;
    const a = featuredList[i];
    const b = featuredList[j];
    await Promise.all([
      patchFeatured(a.id, { featuredOrder: b.featuredOrder }),
      patchFeatured(b.id, { featuredOrder: a.featuredOrder }),
    ]);
  };

  if (loading || !form) {
    return (
      <div className="px-6 pb-12">
        <PageHeader title="Home" subtitle="Loading…" />
        <div className="max-w-3xl space-y-6">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const heroPreview = form.heroImage || aboutAvatar || HOME_DEFAULTS.heroImageFallback;
  const statsPreview = form.statsImage || aboutAvatar || "";

  const imageCard = (field: ImageField, label: string, preview: string) => (
    <Field label={label} hint="upload to override — falls back to your About avatar">
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt={label} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-muted-foreground">
              <ImageIcon size={22} />
            </div>
          )}
          {uploading === field && (
            <div className="absolute inset-0 grid place-items-center bg-background/60">
              <Spinner />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => uploadImage(e, field)}
            className="text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-2 file:text-foreground hover:file:bg-border"
          />
          {form[field] && (
            <button onClick={() => set(field, "")} className="block text-xs text-red-400 hover:underline">
              Remove uploaded image
            </button>
          )}
        </div>
      </div>
    </Field>
  );

  return (
    <div className="px-6 pb-12">
      <PageHeader
        title="Home"
        subtitle="Edit the live landing page — text and images"
        action={
          <Button onClick={save} variant="gradient" size="sm" disabled={saving}>
            {saving ? <Spinner /> : <Check size={16} />} Save changes
          </Button>
        }
      />

      <div className="max-w-3xl space-y-6">
        {/* Hero */}
        <Card className="space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold">Hero</h2>
          {imageCard("heroImage", "Hero portrait", heroPreview)}
          <Field label="Badge">
            <input className={adminInput} value={form.heroBadge} onChange={(e) => set("heroBadge", e.target.value)} />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Headline">
              <input className={adminInput} value={form.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} />
            </Field>
            <Field label="Highlighted phrase" hint="rendered as a gradient">
              <input className={adminInput} value={form.heroHighlight} onChange={(e) => set("heroHighlight", e.target.value)} />
            </Field>
          </div>
          <Field label="Tagline">
            <textarea rows={2} className={adminInput} value={form.heroTagline} onChange={(e) => set("heroTagline", e.target.value)} />
          </Field>
          <Field label="Rotating roles" hint="comma separated">
            <input className={adminInput} value={form.heroRoles} onChange={(e) => set("heroRoles", e.target.value)} />
          </Field>
        </Card>

        {/* Marquee */}
        <Card className="space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold">Tech marquee</h2>
          <Field label="Items" hint="comma separated">
            <input className={adminInput} value={form.marqueeItems} onChange={(e) => set("marqueeItems", e.target.value)} />
          </Field>
        </Card>

        {/* Stats */}
        <Card className="space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold">Stats section</h2>
          {imageCard("statsImage", "Avatar image", statsPreview)}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Eyebrow">
              <input className={adminInput} value={form.statsEyebrow} onChange={(e) => set("statsEyebrow", e.target.value)} />
            </Field>
            <Field label="Title">
              <input className={adminInput} value={form.statsTitle} onChange={(e) => set("statsTitle", e.target.value)} />
            </Field>
            <Field label="Highlighted phrase">
              <input className={adminInput} value={form.statsHighlight} onChange={(e) => set("statsHighlight", e.target.value)} />
            </Field>
          </div>
          <p className="text-xs text-muted-foreground">
            The 3 number stats are computed automatically. The 4th is yours:
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Fun stat value">
              <input className={adminInput} value={form.funStatValue} onChange={(e) => set("funStatValue", e.target.value)} />
            </Field>
            <Field label="Fun stat label">
              <input className={adminInput} value={form.funStatLabel} onChange={(e) => set("funStatLabel", e.target.value)} />
            </Field>
          </div>
        </Card>

        {/* Featured */}
        <Card className="space-y-4 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">Featured projects</h2>
            <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>
              <Star size={15} /> Update featured list
            </Button>
          </div>

          {featuredList.length > 0 ? (
            <div className="space-y-2">
              {featuredList.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-2">
                  <span className="font-mono text-xs text-muted-foreground w-5 text-center">{i + 1}</span>
                  <div className="h-10 w-14 shrink-0 overflow-hidden rounded bg-muted">
                    {p.images?.[0]?.url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0].url} alt={p.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <span className="min-w-0 flex-1 truncate text-sm">{p.title}</span>
                  <button onClick={() => moveFeatured(i, -1)} disabled={i === 0} aria-label="Move up" className={`${iconBtn} hover:text-foreground disabled:opacity-30`}>
                    <ArrowUp size={14} />
                  </button>
                  <button onClick={() => moveFeatured(i, 1)} disabled={i === featuredList.length - 1} aria-label="Move down" className={`${iconBtn} hover:text-foreground disabled:opacity-30`}>
                    <ArrowDown size={14} />
                  </button>
                  <button onClick={() => toggleFeatured(p)} aria-label="Remove" className={`${iconBtn} hover:border-red-500/40 hover:text-red-400`}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              None selected — the home page shows your 3 newest projects.
            </p>
          )}
        </Card>

        {/* CTA */}
        <Card className="space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold">Closing call-to-action</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Eyebrow" hint="shown as // eyebrow">
              <input className={adminInput} value={form.ctaEyebrow} onChange={(e) => set("ctaEyebrow", e.target.value)} />
            </Field>
            <Field label="Button label">
              <input className={adminInput} value={form.ctaButton} onChange={(e) => set("ctaButton", e.target.value)} />
            </Field>
            <Field label="Heading">
              <input className={adminInput} value={form.ctaHeading} onChange={(e) => set("ctaHeading", e.target.value)} />
            </Field>
            <Field label="Highlighted phrase">
              <input className={adminInput} value={form.ctaHighlight} onChange={(e) => set("ctaHighlight", e.target.value)} />
            </Field>
          </div>
          <Field label="Subtext">
            <textarea rows={2} className={adminInput} value={form.ctaSubtext} onChange={(e) => set("ctaSubtext", e.target.value)} />
          </Field>
        </Card>
      </div>

      {/* Featured picker modal */}
      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Featured projects"
        size="wide"
        footer={
          <Button variant="gradient" size="sm" onClick={() => setModalOpen(false)}>
            Done
          </Button>
        }
      >
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects yet — add some in the Projects tab.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {projects.map((p) => (
              <div
                key={p.id}
                className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                  p.featured ? "border-primary/50 bg-primary/5" : "border-border bg-card/50"
                }`}
              >
                <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {p.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0].url} alt={p.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center text-muted-foreground">
                      <FolderGit2 size={16} />
                    </div>
                  )}
                </div>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{p.title}</span>
                {p.featured ? (
                  <Button variant="outline" size="sm" className="text-red-400 hover:border-red-500/40" onClick={() => toggleFeatured(p)}>
                    <X size={14} /> Remove
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => toggleFeatured(p)}>
                    <Plus size={14} /> Add
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </AdminModal>
    </div>
  );
}

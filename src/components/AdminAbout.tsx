/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Plus, Check, Trash2, Edit2, User } from "lucide-react";
import Image from "next/image";
import type { About } from "@/lib/about";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  AdminModal,
  Field,
  adminInput,
  PageHeader,
  Spinner,
  type ToastState,
} from "@/components/admin/AdminKit";

type SectionType = "skills" | "education" | "experiences" | "achievements";

const iconBtn =
  "grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors";

export default function AdminAbout({ onToast }: { onToast: (t: ToastState) => void }) {
  const [aboutData, setAboutData] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<SectionType>("skills");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [tempValue, setTempValue] = useState<any>({});

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch("/api/about");
        const data = await res.json();
        setAboutData({
          id: data?.id ?? "",
          name: data?.name ?? "",
          headline: data?.headline ?? "",
          bio: data?.bio ?? "",
          avatarUrl: data?.avatarUrl ?? "",
          createdAt: data?.createdAt ?? "",
          updatedAt: data?.updatedAt ?? "",
          education: data?.education ?? [],
          experiences: data?.experiences ?? [],
          skills: data?.skills ?? [],
          achievements: data?.achievements ?? [],
        });
      } catch {
        onToast({ message: "Failed to load About data", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, [onToast]);

  const openModal = (type: SectionType, item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) setTempValue(item);
    else if (type === "skills") setTempValue({ name: "" });
    else if (type === "education")
      setTempValue({ degree: "", school: "", startYear: "", endYear: "", grade: "" });
    else if (type === "experiences")
      setTempValue({ role: "", company: "", duration: "", desc: "" });
    else if (type === "achievements") setTempValue({ text: "" });
    setModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!aboutData) return;
    const updated: About = {
      ...aboutData,
      education: aboutData.education ?? [],
      experiences: aboutData.experiences ?? [],
      skills: aboutData.skills ?? [],
      achievements: aboutData.achievements ?? [],
    };

    switch (modalType) {
      case "skills": {
        const names = tempValue.name.split(",").map((s: string) => s.trim()).filter(Boolean);
        if (editingItem)
          updated.skills = updated.skills.map((s) =>
            s.id === editingItem.id ? { ...s, name: tempValue.name } : s
          );
        else updated.skills.push(...names.map((name: string) => ({ name })));
        break;
      }
      case "achievements": {
        const texts = tempValue.text.split(",").map((a: string) => a.trim()).filter(Boolean);
        if (editingItem)
          updated.achievements = updated.achievements.map((a) =>
            a.id === editingItem.id ? { ...a, text: tempValue.text } : a
          );
        else updated.achievements.push(...texts.map((text: string) => ({ text })));
        break;
      }
      case "education": {
        if (editingItem)
          updated.education = updated.education.map((e) =>
            e.id === editingItem.id ? { ...e, ...tempValue } : e
          );
        else updated.education.push({ ...tempValue });
        break;
      }
      case "experiences": {
        if (editingItem)
          updated.experiences = updated.experiences.map((e) =>
            e.id === editingItem.id ? { ...e, ...tempValue } : e
          );
        else updated.experiences.push({ ...tempValue });
        break;
      }
    }
    setAboutData(updated);
    setModalOpen(false);
  };

  const handleDelete = async (type: SectionType, id: string) => {
    if (!aboutData) return;
    if (id) {
      await fetch("/api/about", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      }).catch(() => onToast({ message: "Delete failed", type: "error" }));
    }
    const updated: About = { ...aboutData };
    updated[type] = (updated[type] as any[]).filter((x) => x.id !== id) as any;
    setAboutData(updated);
  };

  const handleSubmit = async () => {
    if (!aboutData) return;
    setSaving(true);
    try {
      const method = aboutData.id ? "PUT" : "POST";
      const payload = {
        id: aboutData.id,
        name: aboutData.name,
        headline: aboutData.headline,
        bio: aboutData.bio,
        avatarUrl: aboutData.avatarUrl,
        skills: aboutData.skills.filter((s) => !s.id),
        achievements: aboutData.achievements.filter((a) => !a.id),
        education: aboutData.education.filter((e) => !e.id),
        experiences: aboutData.experiences.filter((ex) => !ex.id),
      };
      const res = await fetch("/api/about", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setAboutData(await res.json());
      onToast({ message: "About saved" });
    } catch {
      onToast({ message: "Save failed — check your inputs", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setAboutData((prev) => prev && { ...prev, avatarUrl: url });
      onToast({ message: "Avatar uploaded" });
    } catch {
      onToast({ message: "Upload failed", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-6 pb-12">
        <PageHeader title="About" subtitle="Loading…" />
        <div className="max-w-3xl space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }
  if (!aboutData) return <p className="p-6 text-muted-foreground">Failed to load data.</p>;

  const itemLabel = (section: SectionType, item: any) =>
    section === "skills"
      ? item.name
      : section === "education"
      ? `${item.degree} — ${item.school}`
      : section === "experiences"
      ? `${item.role} @ ${item.company}`
      : item.text;

  return (
    <div className="px-6 pb-12">
      <PageHeader
        title="About"
        subtitle="Profile, experience, education, skills & achievements"
        action={
          <Button onClick={handleSubmit} variant="gradient" size="sm" disabled={saving}>
            {saving ? <Spinner /> : <Check size={16} />} Save changes
          </Button>
        }
      />

      <div className="max-w-3xl space-y-6">
        {/* Profile */}
        <Card className="space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold">Profile</h2>
          <Field label="Name">
            <input
              className={adminInput}
              value={aboutData.name || ""}
              onChange={(e) => setAboutData((p) => p && { ...p, name: e.target.value })}
            />
          </Field>
          <Field label="Headline">
            <input
              className={adminInput}
              value={aboutData.headline || ""}
              onChange={(e) => setAboutData((p) => p && { ...p, headline: e.target.value })}
            />
          </Field>
          <Field label="Bio">
            <textarea
              rows={4}
              className={adminInput}
              value={aboutData.bio || ""}
              onChange={(e) => setAboutData((p) => p && { ...p, bio: e.target.value })}
            />
          </Field>
          <Field label="Avatar">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                {aboutData.avatarUrl ? (
                  <Image src={aboutData.avatarUrl} alt="Avatar" fill sizes="80px" className="object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-muted-foreground">
                    <User size={24} />
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 grid place-items-center bg-background/60">
                    <Spinner />
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={uploadAvatar}
                className="text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-2 file:text-foreground hover:file:bg-border"
              />
            </div>
          </Field>
        </Card>

        {/* Dynamic sections */}
        {(["experiences", "education", "skills", "achievements"] as const).map((section) => {
          const items = aboutData[section] ?? [];
          return (
            <Card key={section} className="space-y-3 p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold capitalize">{section}</h2>
                <Button variant="outline" size="sm" onClick={() => openModal(section)}>
                  <Plus size={16} /> Add
                </Button>
              </div>
              {items.length > 0 ? (
                <div className="space-y-2">
                  {items.map((item: any, index: number) => (
                    <div
                      key={item.id || `${section}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-4 py-2.5"
                    >
                      <span className="truncate text-sm">{itemLabel(section, item)}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openModal(section, item)}
                          aria-label="Edit"
                          className={`${iconBtn} hover:border-primary/40 hover:text-primary`}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(section, item.id)}
                          aria-label="Delete"
                          className={`${iconBtn} hover:border-red-500/40 hover:text-red-400`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No {section} yet — click <span className="text-foreground">Add</span>.
                </p>
              )}
            </Card>
          );
        })}
      </div>

      {/* Add/Edit item modal */}
      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`${editingItem ? "Edit" : "Add"} ${modalType}`}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" size="sm" onClick={handleSaveItem}>
              <Check size={16} /> Save
            </Button>
          </>
        }
      >
        {modalType === "skills" && (
          <Field label="Skill names" hint="comma separated to add several at once">
            <input
              className={adminInput}
              value={tempValue.name || ""}
              onChange={(e) => setTempValue((p: any) => ({ ...p, name: e.target.value }))}
            />
          </Field>
        )}
        {modalType === "education" && (
          <div className="space-y-4">
            <Field label="Degree">
              <input className={adminInput} value={tempValue.degree || ""} onChange={(e) => setTempValue((p: any) => ({ ...p, degree: e.target.value }))} />
            </Field>
            <Field label="School">
              <input className={adminInput} value={tempValue.school || ""} onChange={(e) => setTempValue((p: any) => ({ ...p, school: e.target.value }))} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Start year">
                <input type="number" className={adminInput} value={tempValue.startYear || ""} onChange={(e) => setTempValue((p: any) => ({ ...p, startYear: Number(e.target.value) }))} />
              </Field>
              <Field label="End year">
                <input type="number" className={adminInput} value={tempValue.endYear || ""} onChange={(e) => setTempValue((p: any) => ({ ...p, endYear: Number(e.target.value) }))} />
              </Field>
            </div>
            <Field label="Grade">
              <input className={adminInput} value={tempValue.grade || ""} onChange={(e) => setTempValue((p: any) => ({ ...p, grade: e.target.value }))} />
            </Field>
          </div>
        )}
        {modalType === "experiences" && (
          <div className="space-y-4">
            <Field label="Role">
              <input className={adminInput} value={tempValue.role || ""} onChange={(e) => setTempValue((p: any) => ({ ...p, role: e.target.value }))} />
            </Field>
            <Field label="Company">
              <input className={adminInput} value={tempValue.company || ""} onChange={(e) => setTempValue((p: any) => ({ ...p, company: e.target.value }))} />
            </Field>
            <Field label="Duration">
              <input className={adminInput} value={tempValue.duration || ""} onChange={(e) => setTempValue((p: any) => ({ ...p, duration: e.target.value }))} />
            </Field>
            <Field label="Description">
              <textarea rows={3} className={adminInput} value={tempValue.desc || ""} onChange={(e) => setTempValue((p: any) => ({ ...p, desc: e.target.value }))} />
            </Field>
          </div>
        )}
        {modalType === "achievements" && (
          <Field label="Achievements" hint="comma separated to add several at once">
            <textarea rows={3} className={adminInput} value={tempValue.text || ""} onChange={(e) => setTempValue((p: any) => ({ ...p, text: e.target.value }))} />
          </Field>
        )}
      </AdminModal>
    </div>
  );
}

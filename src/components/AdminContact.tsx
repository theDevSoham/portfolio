"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Check } from "lucide-react";
import Image from "next/image";
import { Contact as ContactType, SocialLink } from "@/lib/contact";
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

const iconBtn =
  "grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors";

export default function AdminContact({ onToast }: { onToast: (t: ToastState) => void }) {
  const [contact, setContact] = useState<ContactType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [tempSocial, setTempSocial] = useState<Partial<SocialLink>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/contact");
        const data = await res.json();
        setContact({
          id: data?.id ?? "",
          phone: data?.phone ?? "",
          email: data?.email ?? "",
          location: data?.location ?? "",
          resumeUrl: data?.resumeUrl ?? "",
          mediaUrl: data?.mediaUrl ?? "",
          socials: data?.socials ?? [],
          createdAt: data?.createdAt ?? "",
          updatedAt: data?.updatedAt ?? "",
        });
      } catch {
        onToast({ message: "Failed to load contact data", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [onToast]);

  const handleSave = async () => {
    if (!contact) return;
    setSaving(true);
    try {
      const method = contact.id ? "PUT" : "POST";
      const { id, ...rest } = contact;
      const payload = id ? { id, ...rest } : rest;
      const res = await fetch("/api/contact", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setContact(await res.json());
      onToast({ message: "Contact saved" });
    } catch {
      onToast({ message: "Save failed — check your inputs", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setContact((prev) => prev && { ...prev, mediaUrl: data.url });
      onToast({ message: "Media uploaded" });
    } catch {
      onToast({ message: "Upload failed", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const openSocialModal = (item: SocialLink | null = null) => {
    setEditingSocial(item);
    setTempSocial(item || {});
    setModalOpen(true);
  };

  const saveSocial = async () => {
    if (!contact) return;
    const socials = contact.socials || [];
    try {
      if (editingSocial) {
        const res = await fetch("/api/social", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingSocial.id, ...tempSocial }),
        });
        const updated = await res.json();
        setContact((prev) => ({
          ...prev!,
          socials: socials.map((s) => (s.id === updated.id ? updated : s)),
        }));
      } else {
        if (!contact.id) {
          onToast({ message: "Save the contact first, then add socials", type: "error" });
          return;
        }
        const res = await fetch("/api/social", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contactId: contact.id,
            platform: tempSocial.platform,
            url: tempSocial.url,
          }),
        });
        const newSocial = await res.json();
        setContact((prev) => ({ ...prev!, socials: [...socials, newSocial] }));
      }
      setModalOpen(false);
      setTempSocial({});
      setEditingSocial(null);
      onToast({ message: "Social link saved" });
    } catch {
      onToast({ message: "Failed to save social link", type: "error" });
    }
  };

  const deleteSocial = async (id: string) => {
    if (!contact) return;
    try {
      await fetch("/api/social", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setContact((prev) => ({ ...prev!, socials: prev!.socials.filter((s) => s.id !== id) }));
    } catch {
      onToast({ message: "Failed to delete social link", type: "error" });
    }
  };

  if (loading) {
    return (
      <div className="px-6 pb-12">
        <PageHeader title="Contact" subtitle="Loading…" />
        <div className="max-w-3xl space-y-6">
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    );
  }
  if (!contact) return <p className="p-6 text-muted-foreground">Failed to load contact.</p>;

  const isVideo = contact.mediaUrl?.endsWith(".mp4");

  return (
    <div className="px-6 pb-12">
      <PageHeader
        title="Contact"
        subtitle="Details, media & social links"
        action={
          <Button onClick={handleSave} variant="gradient" size="sm" disabled={saving}>
            {saving ? <Spinner /> : <Check size={16} />} Save changes
          </Button>
        }
      />

      <div className="max-w-3xl space-y-6">
        {/* Details */}
        <Card className="space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold">Contact details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Email">
              <input type="email" className={adminInput} value={contact.email || ""} onChange={(e) => setContact((p) => p && { ...p, email: e.target.value })} />
            </Field>
            <Field label="Phone">
              <input className={adminInput} value={contact.phone || ""} onChange={(e) => setContact((p) => p && { ...p, phone: e.target.value })} />
            </Field>
            <Field label="Location">
              <input className={adminInput} value={contact.location || ""} onChange={(e) => setContact((p) => p && { ...p, location: e.target.value })} />
            </Field>
            <Field label="Resume URL">
              <input className={adminInput} value={contact.resumeUrl || ""} onChange={(e) => setContact((p) => p && { ...p, resumeUrl: e.target.value })} />
            </Field>
          </div>
        </Card>

        {/* Media */}
        <Card className="space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold">Decorative media</h2>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-2 file:text-foreground hover:file:bg-border"
          />
          {(contact.mediaUrl || uploading) && (
            <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-xl border border-border bg-muted">
              {contact.mediaUrl &&
                (isVideo ? (
                  <video src={contact.mediaUrl} muted loop autoPlay playsInline className="h-full w-full object-cover" />
                ) : (
                  <Image src={contact.mediaUrl} alt="Media" fill className="object-cover" />
                ))}
              {uploading && (
                <div className="absolute inset-0 grid place-items-center bg-background/60">
                  <Spinner size={22} />
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Socials */}
        <Card className="space-y-3 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Social links</h2>
            <Button variant="outline" size="sm" onClick={() => openSocialModal()}>
              <Plus size={16} /> Add
            </Button>
          </div>
          {contact.socials.length > 0 ? (
            <div className="space-y-2">
              {contact.socials.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-4 py-2.5"
                >
                  <span className="min-w-0 truncate text-sm">
                    <span className="font-medium">{s.platform}</span>
                    <span className="text-muted-foreground"> · {s.url}</span>
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => openSocialModal(s)} aria-label="Edit" className={`${iconBtn} hover:border-primary/40 hover:text-primary`}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => deleteSocial(s.id)} aria-label="Delete" className={`${iconBtn} hover:border-red-500/40 hover:text-red-400`}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No social links yet — click <span className="text-foreground">Add</span>.
            </p>
          )}
        </Card>
      </div>

      {/* Social modal */}
      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSocial ? "Edit social link" : "Add social link"}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" size="sm" onClick={saveSocial}>
              <Check size={16} /> Save
            </Button>
          </>
        }
      >
        <Field label="Platform" hint="e.g. Github, Linkedin">
          <input className={adminInput} value={tempSocial.platform || ""} onChange={(e) => setTempSocial((p) => ({ ...p, platform: e.target.value }))} />
        </Field>
        <Field label="URL">
          <input type="url" className={adminInput} value={tempSocial.url || ""} onChange={(e) => setTempSocial((p) => ({ ...p, url: e.target.value }))} />
        </Field>
      </AdminModal>
    </div>
  );
}

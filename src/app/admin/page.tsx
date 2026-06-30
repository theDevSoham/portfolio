"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FolderGit2,
  Plus,
  Edit2,
  Trash2,
  Github,
  ExternalLink,
  Home,
  User,
  Mail,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import { signOut } from "next-auth/react";
import AdminHome from "@/components/AdminHome";
import AdminAbout from "@/components/AdminAbout";
import AdminContact from "@/components/AdminContact";
import { Project } from "@/lib/project";
import { iconMap } from "@/lib/iconMap";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  AdminModal,
  Field,
  adminInput,
  Toast,
  type ToastState,
  EmptyState,
  PageHeader,
  Spinner,
} from "@/components/admin/AdminKit";

type Section = "home" | "projects" | "about" | "contact";

const NAV: { key: Section; label: string; icon: typeof FolderGit2 }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "projects", label: "Projects", icon: FolderGit2 },
  { key: "about", label: "About", icon: User },
  { key: "contact", label: "Contact", icon: Mail },
];

const emptyForm = {
  title: "",
  description: "",
  icon: "FolderGit2",
  slug: "",
  tags: "",
  repoUrl: "",
  liveUrl: "",
  imageUrls: "",
  imageFiles: [] as File[],
};

export default function Admin() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setToast({ message: "Failed to load projects", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  const openAddModal = () => {
    setSelectedProject(null);
    setFormData(emptyForm);
    setModalType("add");
    setModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      icon: project.icon,
      slug: project.slug,
      tags: project.tags.join(", "),
      repoUrl: project.repoUrl || "",
      liveUrl: project.liveUrl || "",
      imageUrls: project.images?.map((img) => img.url).join(", ") || "",
      imageFiles: [],
    });
    setModalType("edit");
    setModalOpen(true);
  };

  const openDeleteModal = (project: Project) => {
    setSelectedProject(project);
    setModalType("delete");
    setModalOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFormData((prev) => ({ ...prev, imageFiles: files }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("icon", formData.icon);
    payload.append("slug", formData.slug);
    payload.append("tags", formData.tags);
    payload.append("repoUrl", formData.repoUrl);
    payload.append("liveUrl", formData.liveUrl);

    if (formData.imageUrls.trim()) {
      formData.imageUrls
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean)
        .forEach((url, i) => payload.append(`images[${i}]`, url));
    }
    formData.imageFiles.forEach((file) => payload.append("imageFiles", file));

    const method = modalType === "edit" ? "PUT" : "POST";
    if (modalType === "edit" && selectedProject) payload.append("id", selectedProject.id);

    try {
      const res = await fetch("/api/projects", { method, body: payload });
      if (!res.ok) throw new Error();
      const project = await res.json();

      if (modalType === "add") setProjects((prev) => [project, ...prev]);
      else setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)));

      setModalOpen(false);
      setToast({ message: modalType === "edit" ? "Project updated" : "Project added" });
    } catch {
      setToast({ message: "Save failed — check your inputs", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    setSaving(true);
    try {
      const res = await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedProject.id }),
      });
      if (!res.ok) throw new Error();
      setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
      setModalOpen(false);
      setToast({ message: "Project deleted" });
    } catch {
      setToast({ message: "Delete failed", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const iconBtn =
    "grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card/40 backdrop-blur-md md:flex">
        <div className="border-b border-border px-5 py-5">
          <p className="font-display text-lg font-bold">
            <span className="text-gradient">Soham</span>
            <span className="text-muted-foreground">.dev</span>
          </p>
          <p className="font-mono text-xs text-muted-foreground">admin console</p>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-border p-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowUpRight size={16} /> View site
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-red-400 hover:bg-red-500/10 hover:border-red-500/40"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </aside>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Mobile section switcher */}
        <div className="flex gap-2 overflow-x-auto border-b border-border p-3 md:hidden">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm whitespace-nowrap ${
                  active ? "bg-primary/15 text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon size={16} /> {item.label}
              </button>
            );
          })}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="ml-auto flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 whitespace-nowrap"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {activeSection === "projects" && (
          <div className="px-6 pb-12">
            <PageHeader
              title="Projects"
              subtitle={loading ? "Loading…" : `${projects.length} project${projects.length === 1 ? "" : "s"}`}
              action={
                <Button onClick={openAddModal} variant="gradient" size="sm">
                  <Plus size={16} /> Add Project
                </Button>
              }
            />

            {loading ? (
              <ul className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 rounded-xl border border-border bg-card/50 p-4"
                  >
                    <Skeleton className="h-16 w-16 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                      <Skeleton className="h-5 w-2/5" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : projects.length === 0 ? (
              <EmptyState
                icon={<FolderGit2 size={26} />}
                title="No projects yet"
                description="Your projects will show up here. Add your first one to get started."
                action={
                  <Button onClick={openAddModal} variant="gradient" size="sm">
                    <Plus size={16} /> Add Project
                  </Button>
                }
              />
            ) : (
              <ul className="space-y-3">
                {projects.map((project) => {
                  const Icon = iconMap[project.icon as keyof typeof iconMap] || FolderGit2;
                  const cover = project.images?.[0]?.url;
                  return (
                    <li
                      key={project.id}
                      className="group flex items-center gap-4 rounded-xl border border-border bg-card/50 p-3 transition-colors hover:border-primary/40 sm:p-4"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {cover ? (
                          <Image src={cover} alt={project.title} fill sizes="64px" className="object-cover" />
                        ) : (
                          <div className="grid h-full place-items-center text-muted-foreground">
                            <FolderGit2 size={20} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 shrink-0 text-accent" />
                          <h3 className="truncate font-semibold">{project.title}</h3>
                        </div>
                        <p className="truncate font-mono text-xs text-muted-foreground">
                          /projects/{project.slug}
                        </p>
                        {project.tags?.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {project.tags.slice(0, 4).map((tag, i) => (
                              <Badge key={i} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                            {project.tags.length > 4 && (
                              <span className="text-xs text-muted-foreground">
                                +{project.tags.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="hidden items-center gap-1 sm:flex">
                        {project.repoUrl && (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Repository"
                            className={`${iconBtn} hover:border-primary/40 hover:text-foreground`}
                          >
                            <Github size={16} />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Live site"
                            className={`${iconBtn} hover:border-primary/40 hover:text-foreground`}
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(project)}
                          aria-label="Edit"
                          className={`${iconBtn} hover:border-primary/40 hover:text-primary`}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(project)}
                          aria-label="Delete"
                          className={`${iconBtn} hover:border-red-500/40 hover:text-red-400`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {activeSection === "home" && <AdminHome onToast={setToast} />}
        {activeSection === "about" && <AdminAbout onToast={setToast} />}
        {activeSection === "contact" && <AdminContact onToast={setToast} />}
      </div>

      {/* Add / Edit modal */}
      <AdminModal
        open={modalOpen && modalType !== "delete"}
        onClose={() => !saving && setModalOpen(false)}
        title={modalType === "edit" ? "Edit project" : "Add project"}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="gradient" size="sm" type="submit" form="project-form" disabled={saving}>
              {saving ? <Spinner /> : null}
              {modalType === "edit" ? "Save changes" : "Add project"}
            </Button>
          </>
        }
      >
        <form id="project-form" onSubmit={handleSubmit} className="space-y-4">
          <Field label="Title">
            <input name="title" value={formData.title} onChange={handleChange} required className={adminInput} placeholder="My awesome project" />
          </Field>
          <Field label="Description">
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} required className={adminInput} placeholder="What it does, the stack, the impact…" />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Slug" hint="lowercase, hyphens only">
              <input name="slug" value={formData.slug} onChange={handleChange} required className={adminInput} placeholder="my-awesome-project" />
            </Field>
            <Field label="Icon">
              <select name="icon" value={formData.icon} onChange={handleChange} className={adminInput}>
                {Object.keys(iconMap).map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Tags" hint="comma separated">
            <input name="tags" value={formData.tags} onChange={handleChange} className={adminInput} placeholder="react, next.js, typescript" />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Repository URL">
              <input name="repoUrl" value={formData.repoUrl} onChange={handleChange} className={adminInput} placeholder="https://github.com/…" />
            </Field>
            <Field label="Live URL">
              <input name="liveUrl" value={formData.liveUrl} onChange={handleChange} className={adminInput} placeholder="https://…" />
            </Field>
          </div>
          <Field label="Image URLs" hint="comma separated, optional if uploading files">
            <textarea name="imageUrls" value={formData.imageUrls} onChange={handleChange} rows={2} className={adminInput} placeholder="https://res.cloudinary.com/…" />
          </Field>
          <Field label="Upload images">
            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-2 file:text-foreground hover:file:bg-border" />
          </Field>
        </form>
      </AdminModal>

      {/* Delete modal */}
      <AdminModal
        open={modalOpen && modalType === "delete"}
        onClose={() => !saving && setModalOpen(false)}
        title="Delete project"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-red-500 text-white hover:opacity-90"
              onClick={handleDelete}
              disabled={saving}
            >
              {saving ? <Spinner /> : <Trash2 size={16} />} Delete
            </Button>
          </>
        }
      >
        <p className="text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-foreground">{selectedProject?.title}</span>? This
          can&rsquo;t be undone.
        </p>
      </AdminModal>

      <Toast toast={toast} onDone={() => setToast(null)} />
    </div>
  );
}

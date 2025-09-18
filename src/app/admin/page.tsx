"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FolderGit2, Plus, Edit2, Trash2, Check, X } from "lucide-react";
import AdminAbout from "@/components/AdminAbout";
import Image from "next/image";
import { Project } from "@/lib/project";
import { iconMap } from "@/lib/iconMap";

// ---------------------- Modal ----------------------
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 p-6 rounded-xl max-w-lg w-full text-white shadow-2xl relative"
      >
        {children}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </motion.div>
    </div>
  );
};

// ---------------------- Main Component ----------------------
export default function Admin() {
  const [activeSection, setActiveSection] = useState<"projects" | "about">(
    "projects"
  );

  const [projects, setProjects] = useState<Project[]>([]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(
    null
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "FolderGit2",
    slug: "",
    tags: "",
    repoUrl: "",
    liveUrl: "",
    imageUrl: "",
    imageFile: null as File | null,
  });

  // Fetch projects on mount
  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  // Open Modals
  const openAddModal = () => {
    setSelectedProject(null);
    setFormData({
      title: "",
      description: "",
      icon: "FolderGit2",
      slug: "",
      tags: "",
      repoUrl: "",
      liveUrl: "",
      imageUrl: "",
      imageFile: null,
    });
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
      imageUrl: project.imageUrl || "",
      imageFile: null, // user can still upload a new file
    });
    setModalType("edit");
    setModalOpen(true);
  };

  const openDeleteModal = (project: Project) => {
    setSelectedProject(project);
    setModalType("delete");
    setModalOpen(true);
  };

  // ----------------- CRUD Handlers -----------------

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, imageFile: file }));
  };

  // Add/Edit Project
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append("description", formData.description);
    formPayload.append("icon", formData.icon);
    formPayload.append("slug", formData.slug);
    formPayload.append("tags", formData.tags); // still comma-separated
    formPayload.append("repoUrl", formData.repoUrl);
    formPayload.append("liveUrl", formData.liveUrl);

    if (formData.imageFile) {
      formPayload.append("imageFile", formData.imageFile);
    } else if (formData.imageUrl) {
      formPayload.append("imageUrl", formData.imageUrl);
    }

    let url = "/api/projects";
    let method = "POST";

    if (modalType === "edit" && selectedProject) {
      url = "/api/projects";
      method = "PUT";
      formPayload.append("id", selectedProject.id);
    }

    const res = await fetch(url, {
      method,
      body: formPayload,
    });

    const project = await res.json();

    if (modalType === "add") {
      setProjects((prev) => [...prev, project]);
    } else if (modalType === "edit") {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? project : p))
      );
    }

    setModalOpen(false);
  };

  // Delete Project
  const handleDelete = async () => {
    if (!selectedProject) return;
    await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedProject.id }),
    });
    setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
    setModalOpen(false);
  };

  // ----------------- Render -----------------
  return (
    <div className="flex min-h-screen bg-transparent text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col gap-6 rounded-lg">
        <h2 className="text-2xl font-bold text-indigo-400">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          <a
            href="#"
            onClick={() => setActiveSection("projects")}
            className="hover:text-indigo-500"
          >
            Projects
          </a>
          <a
            href="#"
            onClick={() => setActiveSection("about")}
            className="hover:text-indigo-500"
          >
            About
          </a>
          <a href="#contact" className="hover:text-indigo-500">
            Contact
          </a>
        </nav>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-400 rounded-md hover:bg-indigo-500 transition mt-4"
        >
          <Plus size={18} /> Add Project
        </button>
      </aside>

      {/* Main */}
      {activeSection === "projects" && (
        <main className="flex-1 p-8 overflow-y-auto space-y-6">
          <h1 className="text-3xl font-bold text-indigo-400 mb-4">
            Manage Projects
          </h1>
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
              <FolderGit2 className="w-16 h-16 mb-4 animate-bounce" />
              <h2 className="text-2xl font-semibold mb-2">No Projects Yet</h2>
              <p className="max-w-md">
                Your projects will appear here once you add them. Click the{" "}
                <span className="font-bold text-indigo-400">Add Project</span>{" "}
                button to get started!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                const Icon = iconMap[project.icon];
                return (
                  <motion.div
                    key={project.id}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col gap-4 relative"
                    whileHover={{ scale: 1.03 }}
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <Icon className="w-8 h-8 text-indigo-400" />
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300">{project.description}</p>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-indigo-500 text-white px-2 py-1 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex flex-col gap-1 text-sm">
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:underline block truncate max-w-xs"
                          title={project.repoUrl} // shows full URL on hover
                        >
                          Repo: {project.repoUrl}
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:underline block truncate max-w-xs"
                          title={project.liveUrl}
                        >
                          Live: {project.liveUrl}
                        </a>
                      )}
                    </div>

                    {/* Image preview */}
                    {project.imageUrl && (
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-40 object-cover rounded-md mt-2"
                        width={500}
                        height={500}
                      />
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => openEditModal(project)}
                        className="p-2 bg-indigo-400 rounded hover:bg-indigo-500 transition"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(project)}
                        className="p-2 bg-red-500 rounded hover:bg-red-600 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>
      )}

      {activeSection === "about" && <AdminAbout />}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {modalType === "delete" ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-red-400">Delete Project</h2>
            <p>
              Are you sure you want to delete &quot;{selectedProject?.title}
              &quot;?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition flex items-center gap-2"
              >
                <Trash2 /> Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-indigo-400">
              {modalType === "edit" ? "Edit Project" : "Add Project"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
                rows={3}
              />
              <input
                type="text"
                name="slug"
                placeholder="Slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
              />
              <input
                type="text"
                name="tags"
                placeholder="Tags (comma separated)"
                value={formData.tags}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
              />
              <input
                type="text"
                name="repoUrl"
                placeholder="Repository URL"
                value={formData.repoUrl}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
              />
              <input
                type="text"
                name="liveUrl"
                placeholder="Live URL"
                value={formData.liveUrl}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
              />
              <input
                type="text"
                name="imageUrl"
                placeholder="Image URL (optional if uploading file)"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-gray-300"
              />
              <select
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
              >
                {Object.keys(iconMap).map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition"
              >
                <Check size={18} />
                {modalType === "edit" ? "Save Changes" : "Add Project"}
              </button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}

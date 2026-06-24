/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Plus, Check, Trash2, Edit2, X } from "lucide-react";
import type { About } from "@/lib/about";
import Image from "next/image";

// ---------------------- Modal ----------------------
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

type SectionType = "skills" | "education" | "experiences" | "achievements";

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="modal-pop bg-gray-800 p-6 rounded-xl max-w-lg w-full text-white shadow-2xl relative">
        {children}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

// ---------------------- Main ----------------------
export default function AdminAbout() {
  const [aboutData, setAboutData] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal state for adding/editing items
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<SectionType>("skills");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [tempValue, setTempValue] = useState<any>({});

  // ---------------------- Fetch existing data ----------------------
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch("/api/about");
        const data = await res.json();

        if (data?.id) {
          setAboutData({
            ...data,
            name: data.name ?? "",
            headline: data.headline ?? "",
            bio: data.bio ?? "",
            avatarUrl: data.avatarUrl ?? "",
            education: data.education ?? [],
            experiences: data.experiences ?? [],
            skills: data.skills ?? [],
            achievements: data.achievements ?? [],
          });
        } else {
          setAboutData({
            id: "",
            name: "",
            headline: "",
            bio: "",
            avatarUrl: "",
            createdAt: "",
            updatedAt: "",
            education: [],
            experiences: [],
            skills: [],
            achievements: [],
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  // ---------------------- Handlers ----------------------
  const openModal = (type: typeof modalType, item: any = null) => {
    setModalType(type);
    setEditingItem(item);

    if (item) {
      setTempValue(item);
    } else {
      // empty templates for each type
      if (type === "skills") setTempValue({ name: "" });
      if (type === "education")
        setTempValue({
          degree: "",
          school: "",
          startYear: "",
          endYear: "",
          grade: "",
        });
      if (type === "experiences")
        setTempValue({ role: "", company: "", duration: "", desc: "" });
      if (type === "achievements") setTempValue({ text: "" });
    }

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
        const skillNames = tempValue.name
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);

        if (editingItem) {
          // update existing skill: keep id
          updated.skills = updated.skills.map((s) =>
            s.id === editingItem.id ? { ...s, name: tempValue.name } : s
          );
        } else {
          // new skills: no id
          const newSkills = skillNames.map((name: string) => ({ name }));
          updated.skills.push(...newSkills);
        }
        break;
      }

      case "achievements": {
        const achievementTexts = tempValue.text
          .split(",")
          .map((a: string) => a.trim())
          .filter(Boolean);

        if (editingItem) {
          updated.achievements = updated.achievements.map((a) =>
            a.id === editingItem.id ? { ...a, text: tempValue.text } : a
          );
        } else {
          const newAchievements = achievementTexts.map((text: string) => ({
            text,
          }));
          updated.achievements.push(...newAchievements);
        }
        break;
      }

      case "education": {
        if (editingItem) {
          updated.education = updated.education.map((e) =>
            e.id === editingItem.id ? { ...e, ...tempValue } : e
          );
        } else {
          updated.education.push({ ...tempValue }); // no id
        }
        break;
      }

      case "experiences": {
        if (editingItem) {
          updated.experiences = updated.experiences.map((e) =>
            e.id === editingItem.id ? { ...e, ...tempValue } : e
          );
        } else {
          updated.experiences.push({ ...tempValue }); // no id
        }
        break;
      }
    }

    setAboutData(updated);
    setModalOpen(false);
  };

  const handleDelete = async (type: typeof modalType, id: string) => {
    if (!aboutData) return;

    // ✅ Send delete request to backend
    await fetch("/api/about", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id }),
    });

    // ✅ Update local state optimistically
    const updated: About = { ...aboutData };
    if (type === "skills")
      updated.skills = updated.skills.filter((s) => s.id !== id);
    if (type === "education")
      updated.education = updated.education.filter((e) => e.id !== id);
    if (type === "experiences")
      updated.experiences = updated.experiences.filter((e) => e.id !== id);
    if (type === "achievements")
      updated.achievements = updated.achievements.filter((a) => a.id !== id);

    setAboutData(updated);
  };

  const handleSubmit = async () => {
    if (!aboutData) return;
    try {
      const method = aboutData.id ? "PUT" : "POST";

      // Also include About main fields
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

      if (!res.ok) return alert("About save failed");

      const saved = await res.json();
      setAboutData(saved);
      alert("About saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving data");
    }
  };

  // ---------------------- UI ----------------------
  if (loading) return <p className="text-white">Loading...</p>;
  if (!aboutData) return <p className="text-white">Failed to load data</p>;

  return (
    <div className="flex min-h-screen bg-transparent text-white p-8">
      <main className="flex-1 space-y-6">
        <h1 className="text-3xl font-bold text-indigo-400 mb-4">
          Edit About Page
        </h1>

        {/* Name */}
        <div className="space-y-2">
          <label className="block text-gray-300">Name</label>
          <input
            type="text"
            value={aboutData.name || ""}
            onChange={(e) =>
              setAboutData((prev) => prev && { ...prev, name: e.target.value })
            }
            className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
          />
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <label className="block text-gray-300">Headline</label>
          <input
            type="text"
            value={aboutData.headline || ""}
            onChange={(e) =>
              setAboutData(
                (prev) => prev && { ...prev, headline: e.target.value }
              )
            }
            className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="block text-gray-300">Bio</label>
          <textarea
            value={aboutData.bio || ""}
            onChange={(e) =>
              setAboutData((prev) => prev && { ...prev, bio: e.target.value })
            }
            className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
            rows={3}
          />
        </div>

        {/* Avatar Upload */}
        <div className="space-y-2">
          <label className="block text-gray-300">Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const formData = new FormData();
              formData.append("file", file);

              try {
                // call backend to upload to Cloudinary
                const res = await fetch("/api/upload", {
                  method: "POST",
                  body: formData,
                });

                if (!res.ok) return alert("Upload failed");
                const { url } = await res.json();

                setAboutData((prev) => prev && { ...prev, avatarUrl: url });
              } catch (err) {
                console.error("Upload error:", err);
                alert("Failed to upload avatar");
              }
            }}
            className="w-full text-gray-300"
          />

          {aboutData.avatarUrl && (
            <Image
              src={aboutData.avatarUrl}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full object-cover border border-gray-600 mt-2"
              width={500}
              height={500}
            />
          )}
        </div>

        {/* Dynamic Lists */}
        {(["skills", "education", "experiences", "achievements"] as const).map(
          (section) => {
            const items = aboutData?.[section] ?? [];

            return (
              <div key={section} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-indigo-400 capitalize">
                    {section}
                  </h2>
                  <button
                    onClick={() => openModal(section)}
                    className="flex items-center gap-2 px-3 py-1 bg-indigo-400 rounded hover:bg-indigo-500"
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>

                {items.length > 0 ? (
                  <div className="grid gap-3">
                    {items.map((item: any, index: number) => (
                      <div
                        key={item.id || `${section}-temp-${index}`} // use index for new items
                        className="flex items-center justify-between bg-gray-800 p-3 rounded"
                      >
                        <span>
                          {section === "skills" && item.name}
                          {section === "education" &&
                            `${item.degree} - ${item.school}`}
                          {section === "experiences" &&
                            `${item.role} @ ${item.company}`}
                          {section === "achievements" && item.text}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(section, item)}
                            className="text-blue-400"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(section, item.id)}
                            className="text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">
                    No {section} added yet. Click{" "}
                    <span className="font-semibold">+ Add</span> to create one.
                  </p>
                )}
              </div>
            );
          }
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-6 py-3 bg-green-500 rounded-md hover:bg-green-600 mt-4"
        >
          <Check size={18} /> Save Changes
        </button>
      </main>

      {/* Modal for Add/Edit */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold text-indigo-400 mb-4 capitalize">
          {editingItem ? "Edit" : "Add"} {modalType}
        </h2>
        {/* Render fields dynamically */}
        {modalType === "skills" && (
          <input
            type="text"
            placeholder="Skill Names (comma separated)"
            value={tempValue.name || ""}
            onChange={(e) =>
              setTempValue((prev: any) => ({ ...prev, name: e.target.value }))
            }
            className="w-full bg-gray-700 rounded-md px-3 py-2 text-white mb-3"
          />
        )}
        {modalType === "education" && (
          <>
            <input
              type="text"
              placeholder="Degree"
              value={tempValue.degree || ""}
              onChange={(e) =>
                setTempValue((prev: any) => ({
                  ...prev,
                  degree: e.target.value,
                }))
              }
              className="w-full bg-gray-700 rounded-md px-3 py-2 text-white mb-2"
            />
            <input
              type="text"
              placeholder="School"
              value={tempValue.school || ""}
              onChange={(e) =>
                setTempValue((prev: any) => ({
                  ...prev,
                  school: e.target.value,
                }))
              }
              className="w-full bg-gray-700 rounded-md px-3 py-2 text-white mb-2"
            />
            <input
              type="number"
              placeholder="Start Year"
              value={tempValue.startYear || ""}
              onChange={(e) =>
                setTempValue((prev: any) => ({
                  ...prev,
                  startYear: Number(e.target.value),
                }))
              }
              className="w-full bg-gray-700 rounded-md px-3 py-2 text-white mb-2"
            />
            <input
              type="number"
              placeholder="End Year"
              value={tempValue.endYear || ""}
              onChange={(e) =>
                setTempValue((prev: any) => ({
                  ...prev,
                  endYear: Number(e.target.value),
                }))
              }
              className="w-full bg-gray-700 rounded-md px-3 py-2 text-white mb-2"
            />
            <input
              type="text"
              placeholder="Grade"
              value={tempValue.grade || ""}
              onChange={(e) =>
                setTempValue((prev: any) => ({
                  ...prev,
                  grade: e.target.value,
                }))
              }
              className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
            />
          </>
        )}
        {modalType === "experiences" && (
          <>
            <input
              type="text"
              placeholder="Role"
              value={tempValue.role || ""}
              onChange={(e) =>
                setTempValue((prev: any) => ({ ...prev, role: e.target.value }))
              }
              className="w-full bg-gray-700 rounded-md px-3 py-2 text-white mb-2"
            />
            <input
              type="text"
              placeholder="Company"
              value={tempValue.company || ""}
              onChange={(e) =>
                setTempValue((prev: any) => ({
                  ...prev,
                  company: e.target.value,
                }))
              }
              className="w-full bg-gray-700 rounded-md px-3 py-2 text-white mb-2"
            />
            <input
              type="text"
              placeholder="Duration"
              value={tempValue.duration || ""}
              onChange={(e) =>
                setTempValue((prev: any) => ({
                  ...prev,
                  duration: e.target.value,
                }))
              }
              className="w-full bg-gray-700 rounded-md px-3 py-2 text-white mb-2"
            />
            <textarea
              placeholder="Description"
              value={tempValue.desc || ""}
              onChange={(e) =>
                setTempValue((prev: any) => ({ ...prev, desc: e.target.value }))
              }
              className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
              rows={3}
            />
          </>
        )}
        {modalType === "achievements" && (
          <textarea
            placeholder="Achievements (comma separated)"
            value={tempValue.text || ""}
            onChange={(e) =>
              setTempValue((prev: any) => ({ ...prev, text: e.target.value }))
            }
            className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
            rows={2}
          />
        )}

        <button
          onClick={handleSaveItem}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 rounded hover:bg-green-600 mt-4"
        >
          <Check size={16} /> Save
        </button>
      </Modal>
    </div>
  );
}

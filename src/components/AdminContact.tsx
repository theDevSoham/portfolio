
"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { Contact as ContactType, SocialLink } from "@/lib/contact";
import Image from "next/image";

export default function AdminContact() {
  const [contact, setContact] = useState<ContactType | null>(null);
  const [loading, setLoading] = useState(true);

  // temp state for social modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [tempSocial, setTempSocial] = useState<Partial<SocialLink>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/contact");
        const data = await res.json();

        if (!res.ok) return alert("Failed to get data");

        if (data?.id) {
          setContact({
            id: data.id || "",
            phone: data.phone || "",
            email: data.email || "",
            location: data.location || "",
            resumeUrl: data.resumeUrl || "",
            mediaUrl: data.mediaUrl || "",
            socials: data.socials || [],
            ...data,
          });
        } else {
          setContact({
            id: "",
            phone: "",
            email: "",
            location: "",
            resumeUrl: "",
            mediaUrl: "",
            socials: [],
            createdAt: "",
            updatedAt: "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!contact) return;
    try {
      const method = contact.id ? "PUT" : "POST";

      const { id, ...rest } = contact;
      const finalPayload = id ? { id, ...rest } : rest;

      const res = await fetch("/api/contact", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });
      const saved = await res.json();
      setContact(saved);
      alert("Contact saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save contact");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setContact((prev) => prev && { ...prev, mediaUrl: data.url });
  };

  const openSocialModal = (item: SocialLink | null = null) => {
    setEditingSocial(item);
    setTempSocial(item || {});
    setModalOpen(true);
  };

  const saveSocial = async () => {
    if (!contact) return;

    // Ensure socials array exists
    const socials = contact.socials || [];

    try {
      if (editingSocial) {
        // Update existing social
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
          alert("Please save the contact first before adding socials.");
          return;
        }

        // Add new social
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
        setContact((prev) => ({
          ...prev!,
          socials: [...socials, newSocial],
        }));
      }

      setModalOpen(false);
      setTempSocial({});
      setEditingSocial(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save social link");
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
      setContact((prev) => ({
        ...prev!,
        socials: prev!.socials.filter((s) => s.id !== id),
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to delete social link");
    }
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (!contact) return <p className="text-white">Failed to load contact</p>;

  return (
    <div className="min-h-screen bg-transparent text-white p-8">
      <h1 className="text-3xl font-bold text-indigo-400 mb-6">
        Edit Contact Page
      </h1>

      <div className="space-y-4 max-w-2xl">
        <input
          type="text"
          placeholder="Phone Number"
          value={contact.phone}
          onChange={(e) =>
            setContact((prev) => prev && { ...prev, phone: e.target.value })
          }
          className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
        />

        <input
          type="email"
          placeholder="Email"
          value={contact.email}
          onChange={(e) =>
            setContact((prev) => prev && { ...prev, email: e.target.value })
          }
          className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
        />

        <input
          type="text"
          placeholder="Location"
          value={contact.location}
          onChange={(e) =>
            setContact((prev) => prev && { ...prev, location: e.target.value })
          }
          className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
        />

        <input
          type="text"
          placeholder="Resume Download URL"
          value={contact.resumeUrl}
          onChange={(e) =>
            setContact((prev) => prev && { ...prev, resumeUrl: e.target.value })
          }
          className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
        />

        <div>
          <label className="block mb-2 font-medium text-indigo-400">
            Decorative Media (Image/GIF/Video)
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="w-full text-gray-300 rounded-md border border-gray-600 p-2 bg-gray-700"
          />

          {contact.mediaUrl && (
            <div className="mt-4">
              <p className="text-sm text-indigo-400 mb-2">Current:</p>

              {/* Wrapper for styling */}
              <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-600">
                <Image
                  src={contact.mediaUrl}
                  alt="Decorative Media"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-indigo-400">
              Social Links
            </h2>
            <button
              onClick={() => openSocialModal()}
              className="px-3 py-1 bg-indigo-500 rounded hover:bg-indigo-600 flex items-center gap-2"
            >
              <Plus size={16} /> Add
            </button>
          </div>
          <div className="space-y-2">
            {contact.socials.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded"
              >
                <span>
                  {s.platform}: {s.url}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openSocialModal(s)}
                    className="text-blue-400"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteSocial(s.id)}
                    className="text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-green-500 rounded-md hover:bg-green-600 mt-6 flex items-center gap-2"
        >
          <Check size={18} /> Save Changes
        </button>
      </div>

      {/* Social Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 p-6 rounded-xl max-w-sm w-full shadow-2xl relative"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-indigo-400 mb-4">
              {editingSocial ? "Edit Social Link" : "Add Social Link"}
            </h2>
            <input
              type="text"
              placeholder="Platform (GitHub, LinkedIn, etc.)"
              value={tempSocial.platform || ""}
              onChange={(e) =>
                setTempSocial((prev) => ({ ...prev, platform: e.target.value }))
              }
              className="w-full bg-gray-700 rounded-md px-3 py-2 text-white mb-3"
            />
            <input
              type="url"
              placeholder="URL"
              value={tempSocial.url || ""}
              onChange={(e) =>
                setTempSocial((prev) => ({ ...prev, url: e.target.value }))
              }
              className="w-full bg-gray-700 rounded-md px-3 py-2 text-white"
            />
            <button
              onClick={saveSocial}
              className="px-4 py-2 bg-green-500 rounded mt-4 hover:bg-green-600 flex items-center gap-2"
            >
              <Check size={16} /> Save
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

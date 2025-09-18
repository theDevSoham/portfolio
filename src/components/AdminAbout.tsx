"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Code,
  Globe,
  Star,
  Plus,
  Check,
  Trash2,
  X,
  Edit2,
} from "lucide-react";

// ---------------------- Types ----------------------
interface Skill {
  id: string;
  name: string;
  icon: string;
}

interface AboutData {
  bio: string;
  description: string;
  profileImage: string;
  skills: Skill[];
}

// ---------------------- Icon Map ----------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  Code,
  Globe,
  Star,
  User,
};

// ---------------------- Initial Data ----------------------
const initialAbout: AboutData = {
  bio: "I’m Soham, a Full Stack Developer passionate about building beautiful, modern web applications with interactive UI, seamless performance, and scalable architecture.",
  description:
    "I specialize in developing modern web applications using technologies like Next.js, React, Node.js, and Tailwind CSS. I love creating interactive interfaces, optimizing performance, and ensuring great user experiences.",
  profileImage: "/placeholder-profile.png",
  skills: [
    { id: "1", name: "Web Development", icon: "Code" },
    { id: "2", name: "Full Stack Apps", icon: "Globe" },
    { id: "3", name: "UI/UX Design", icon: "Star" },
  ],
};

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

// ---------------------- Main Admin About ----------------------
export default function AdminAbout() {
  const [aboutData, setAboutData] = useState<AboutData>(initialAbout);

  // Modal state for skill add/edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillName, setSkillName] = useState("");
  const [skillIcon, setSkillIcon] = useState("Code");

  // Open Add Skill Modal
  const openAddSkill = () => {
    setEditingSkill(null);
    setSkillName("");
    setSkillIcon("Code");
    setModalOpen(true);
  };

  // Open Edit Skill Modal
  const openEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillName(skill.name);
    setSkillIcon(skill.icon);
    setModalOpen(true);
  };

  // Add/Edit Skill
  const handleSkillSubmit = () => {
    if (!skillName) return;
    if (editingSkill) {
      setAboutData((prev) => ({
        ...prev,
        skills: prev.skills.map((s) =>
          s.id === editingSkill.id
            ? { ...s, name: skillName, icon: skillIcon }
            : s
        ),
      }));
    } else {
      const newSkill: Skill = {
        id: Date.now().toString(),
        name: skillName,
        icon: skillIcon,
      };
      setAboutData((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }));
    }
    setModalOpen(false);
  };

  // Delete Skill
  const handleSkillDelete = (id: string) => {
    setAboutData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  // Submit About Data (bio/profile/skills)
  const handleSubmit = () => {
    console.log("Submitting About Data:", aboutData);
    alert("About page submitted! Check console for output.");
    // Integrate API here
  };

  return (
    <div className="flex min-h-screen bg-transparent text-white p-8">
      <main className="flex-1 space-y-6">
        <h1 className="text-3xl font-bold text-indigo-400 mb-4">
          Edit About Page
        </h1>

        {/* Profile Image */}
        <div className="space-y-2">
          <label className="block text-gray-300">Profile Image URL</label>
          <input
            type="text"
            value={aboutData.profileImage}
            onChange={(e) =>
              setAboutData((prev) => ({
                ...prev,
                profileImage: e.target.value,
              }))
            }
            className="w-full bg-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="block text-gray-300">Bio</label>
          <textarea
            value={aboutData.bio}
            onChange={(e) =>
              setAboutData((prev) => ({ ...prev, bio: e.target.value }))
            }
            className="w-full bg-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows={2}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-gray-300">Description</label>
          <textarea
            value={aboutData.description}
            onChange={(e) =>
              setAboutData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full bg-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows={4}
          />
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-indigo-400">Skills</h2>
            <button
              onClick={openAddSkill}
              className="flex items-center gap-2 px-3 py-1 bg-indigo-400 rounded hover:bg-indigo-500 transition"
            >
              <Plus size={16} /> Add Skill
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aboutData.skills.map((skill) => {
              const Icon = iconMap[skill.icon];
              return (
                <motion.div
                  key={skill.id}
                  className="flex items-center gap-3 p-4 bg-gray-800 rounded-xl shadow hover:shadow-indigo-500/20 transition"
                  whileHover={{ scale: 1.03 }}
                >
                  <Icon className="w-6 h-6 text-indigo-400" />
                  <span className="flex-1">{skill.name}</span>
                  <button onClick={() => openEditSkill(skill)} className="p-1">
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleSkillDelete(skill.id)}
                    className="p-1 text-red-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-6 py-3 bg-green-500 rounded-md hover:bg-green-600 transition mt-4"
        >
          <Check size={18} /> Save Changes
        </button>
      </main>

      {/* Skill Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold text-indigo-400 mb-2">
          {editingSkill ? "Edit Skill" : "Add Skill"}
        </h2>
        <input
          type="text"
          placeholder="Skill Name"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          className="w-full bg-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2"
        />
        <select
          value={skillIcon}
          onChange={(e) => setSkillIcon(e.target.value)}
          className="w-full bg-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
        >
          {Object.keys(iconMap).map((icon) => (
            <option key={icon} value={icon}>
              {icon}
            </option>
          ))}
        </select>
        <button
          onClick={handleSkillSubmit}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition"
        >
          <Check size={16} /> {editingSkill ? "Save Skill" : "Add Skill"}
        </button>
      </Modal>
    </div>
  );
}

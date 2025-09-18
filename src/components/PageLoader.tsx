"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Laptop, Code2, Rocket } from "lucide-react";

const icons = [Laptop, Code2, Rocket];

export default function PageLoader({ forced }: { forced?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [iconIndex, setIconIndex] = useState(0);
  const pathname = usePathname();

  // Show loader briefly on route change
  useEffect(() => {
    if (forced) return; // skip when it's forced (initial load)
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1200); // keep loader for ~1.2s
    return () => clearTimeout(timer);
  }, [pathname, forced]);

  // Cycle through icons
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % icons.length);
    }, 400);
    return () => clearInterval(interval);
  }, [loading]);

  const CurrentIcon = icons[iconIndex];

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Animated Icon */}
          <motion.div
            key={iconIndex} // makes AnimatePresence work on icon change
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: [0, 20, -20, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="text-indigo-400"
          >
            <CurrentIcon size={64} strokeWidth={1.5} />
          </motion.div>

          {/* Loading Text with bouncing dots */}
          <motion.div
            className="mt-6 text-white text-lg font-semibold flex items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Loading
            <motion.span
              className="inline-block"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              .
            </motion.span>
            <motion.span
              className="inline-block"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, delay: 0.2, repeat: Infinity }}
            >
              .
            </motion.span>
            <motion.span
              className="inline-block"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, delay: 0.4, repeat: Infinity }}
            >
              .
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

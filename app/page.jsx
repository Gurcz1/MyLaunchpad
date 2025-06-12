"use client";

import { useState, useEffect } from "react";
import { Youtube, Twitter, Instagram, Mail, Twitch, MessageCircle, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function App() {
  const links = [
    { href: "https://www.youtube.com", label: "YouTube", Icon: Youtube, style: "bg-[#FF0000]" },
    { href: "https://twitter.com", label: "Twitter", Icon: Twitter, style: "bg-[#1DA1F2]" },
    { href: "https://www.instagram.com", label: "Instagram", Icon: Instagram, style: "bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600" },
    { href: "https://mail.google.com", label: "Gmail", Icon: Mail, style: "bg-[#D44638]" },
    { href: "https://www.twitch.tv", label: "Twitch", Icon: Twitch, style: "bg-[#9146FF]" },
    { href: "https://chat.openai.com", label: "ChatGPT", Icon: MessageCircle, style: "bg-[#10A37F]" },
  ];

  // ─── Clock ──────────────────────────────────────────────────────────
  const [now, setNow] = useState(null);

  useEffect(() => {
    // ustawiamy od razu po zamontowaniu, żeby zaliczyć pierwsze „tyknięcie”
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // formatowanie – tylko gdy `now` istnieje (po stronie klienta)
  const dateStr = now?.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now?.toLocaleTimeString("pl-PL");

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-black p-4">
      {/* Date & Time (render only on client) */}
      <div
        className="absolute top-4 right-4 text-white text-lg font-bold font-mono select-none"
        suppressHydrationWarning
      >
        {now && (
          <div className="flex flex-col items-end leading-tight">
            <span>{dateStr}</span>
            <span className="tracking-wide">{timeStr}</span>
          </div>
        )}
      </div>

      {/* Link buttons */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-xl">
        {links.map(({ href, label, Icon, style }, idx) => (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1, type: "spring", stiffness: 120 }}
            whileHover={{ scale: 1.1, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center gap-3 rounded-2xl p-6 text-white shadow-lg ${style}`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-lg font-semibold">{label}</span>
          </motion.a>
        ))}
      </div>

      {/* Google button at the bottom */}
      <motion.a
        href="https://www.google.com"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: links.length * 0.1 + 0.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8 flex items-center gap-3 rounded-2xl px-8 py-4 bg-[#4285F4] text-white shadow-lg"
      >
        <Search className="w-6 h-6" />
        <span className="text-lg font-semibold">Google</span>
      </motion.a>
    </div>
  );
}

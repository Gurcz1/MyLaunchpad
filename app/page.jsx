"use client";

import { useState, useEffect } from "react";
import {
  Youtube,
  Twitter,
  Instagram,
  Mail,
  Twitch,
  MessageCircle,
  Search,
  Plus,
  X as Close,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

/********************
 * Brand icon colors *
 *******************/
const iconColors = {
  YouTube: "text-[#FF0000]",
  Twitter: "text-[#1DA1F2]",
  Instagram: "text-pink-500",
  Gmail: "text-[#EA4335]",
  Twitch: "text-[#9146FF]",
  ChatGPT: "text-[#10A37F]",
};

/*****************************
 * Optimistic click tracking *
 *****************************/
async function sendClick(label) {
  try {
    await fetch("/api/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label }),
    });
  } catch {
    /* ignore offline errors */
  }
}

export default function App() {
  const buttonClasses = "bg-blue-600 text-white";

  /*********************
   * Links management  *
   *********************/
  const defaultLinks = [
    { href: "https://www.youtube.com", label: "YouTube", Icon: Youtube, builtIn: true },
    { href: "https://twitter.com", label: "Twitter", Icon: Twitter, builtIn: true },
    { href: "https://www.instagram.com", label: "Instagram", Icon: Instagram, builtIn: true },
    { href: "https://mail.google.com", label: "Gmail", Icon: Mail, builtIn: true },
    { href: "https://www.twitch.tv", label: "Twitch", Icon: Twitch, builtIn: true },
    { href: "https://chat.openai.com", label: "ChatGPT", Icon: MessageCircle, builtIn: true },
  ];

  const [links, setLinks] = useState(defaultLinks);
  const [stats, setStats] = useState({}); // {label: count}
  const [showForm, setShowForm] = useState(false);

  // ── Load custom links & stats on mount ────────────────────────────
  useEffect(() => {
    const storedLinks = JSON.parse(localStorage.getItem("customLinks") || "[]");
    if (storedLinks.length) {
      setLinks([
        ...defaultLinks,
        ...storedLinks.map((l) => ({ ...l, Icon: MessageCircle, builtIn: false })),
      ]);
    }

    fetch("/api/clicks")
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  // ── CRUD helpers ──────────────────────────────────────────────────
  const addCustomLink = (href, label) => {
    const stored = JSON.parse(localStorage.getItem("customLinks") || "[]");
    stored.push({ href, label });
    localStorage.setItem("customLinks", JSON.stringify(stored));
    setLinks((prev) => [...prev, { href, label, Icon: MessageCircle, builtIn: false }]);
  };

  const removeCustomLink = (label) => {
    const stored = JSON.parse(localStorage.getItem("customLinks") || "[]");
    localStorage.setItem(
      "customLinks",
      JSON.stringify(stored.filter((l) => l.label !== label)),
    );
    setLinks((prev) => prev.filter((l) => l.label !== label));
  };

  const handleLinkClick = (label) => {
    setStats((prev) => ({ ...prev, [label]: (prev[label] || 0) + 1 }));
    sendClick(label);
  };

  // ── Clock ─────────────────────────────────────────────────────────
  const [now, setNow] = useState(null);
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const dateStr = now?.toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" });
  const timeStr = now?.toLocaleTimeString("pl-PL");

  return (
    <div className="min-h-screen flex flex-col items-center bg-black text-white px-4 py-10">
      {/* Clock */}
      {now && (
        <div className="absolute top-4 right-4 font-mono text-sm sm:text-base text-right select-none">
          <div>{dateStr}</div>
          <div>{timeStr}</div>
        </div>
      )}

      {/* Logo */}
      <div className="flex flex-col items-center gap-2 mb-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-10 h-10 text-blue-600"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" fill="none" />
          <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 className="text-3xl font-extrabold">MyLaunchpad</h1>
        <p className="text-sm text-gray-300">Twoje centrum szybkiego dostępu</p>
      </div>

      {/* Links grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-xl mb-16">
        {links.map(({ href, label, Icon, builtIn }, idx) => (
          <div key={`${label}-${idx}`} className="relative">
            {!builtIn && (
              <button
                onClick={() => removeCustomLink(label)}
                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow"
                aria-label="Usuń link"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <motion.a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(label)}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center gap-2 rounded-2xl p-5 shadow hover:shadow-xl active:scale-95 ${buttonClasses}`}
            >
              <Icon className={`w-6 h-6 ${iconColors[label] || "text-white"}`} />
              <span className="font-semibold">{label}</span>
              <span className="text-xs opacity-80">
                {stats[label] ? `${stats[label]} użyć w tym tygodniu` : "‑"}
              </span>
            </motion.a>
          </div>
        ))}
      </div>

      {/* Google search */}
      <form action="https://www.google.com/search" method="GET" target="_blank" className="w-full max-w-md mb-20">
        <div className="flex items-center gap-2">
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <input
            name="q"
            placeholder="Szukaj w Google..."
            className="flex-grow rounded-l-2xl px-4 py-3 bg-gray-200 text-black"
          />
          <button
            type="submit"
            className="rounded-r-2xl px-4 py-3 bg-blue-600 text-white hover:shadow-xl active:scale-95 transition"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Add link FAB */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-xl hover:shadow-2xl active:scale-95 transition"
        aria-label="Dodaj link"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const label = fd.get("label")?.toString().trim();
              const url = fd.get("url")?.toString().trim();
              if (!label || !url) return;
              addCustomLink(url, label);
              setShowForm(false);
            }}
            className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4"
          >
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-lg font-bold text-white">Dodaj link</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-800 rounded-full"
                aria-label="Zamknij"
              >
                <Close className="w-4 h-4 text-white" />
              </button>
            </div>

            <input
              name="label"
              placeholder="Nazwa linku"
              className="rounded px-4 py-2 bg-gray-800 text-white"
              required
            />

            <input
              name="url"
              type="url"
              placeholder="https://example.com"
              className="rounded px-4 py-2 bg-gray-800 text-white"
              required
            />

            <button
              type="submit"
              className="py-2 rounded bg-blue-600 text-white hover:shadow-xl active:scale-95 transition"
            >
              Zapisz
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

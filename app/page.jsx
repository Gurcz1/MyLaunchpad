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
  Sun,
  Moon,
  Plus,
  X as Close,
} from "lucide-react";
import { motion } from "framer-motion";

// ── Brand colors for icons ───────────────────────────────────────────
const iconColors = {
  YouTube: "text-[#FF0000]",
  Twitter: "text-[#1DA1F2]",
  Instagram: "text-pink-500",
  Gmail: "text-[#EA4335]",
  Twitch: "text-[#9146FF]",
  ChatGPT: "text-[#10A37F]",
};

export default function App() {
  // ── Theme state with persistence ───────────────────────────────────
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) setDarkMode(saved === "true");
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // button color adapts to theme (slightly lighter in dark)
  const buttonBg = darkMode ? "bg-blue-500" : "bg-blue-600";
  const buttonClasses = `${buttonBg} text-white`;

  // ── Default & custom links ─────────────────────────────────────────
  const defaultLinks = [
    { href: "https://www.youtube.com", label: "YouTube", Icon: Youtube },
    { href: "https://twitter.com", label: "Twitter", Icon: Twitter },
    { href: "https://www.instagram.com", label: "Instagram", Icon: Instagram },
    { href: "https://mail.google.com", label: "Gmail", Icon: Mail },
    { href: "https://www.twitch.tv", label: "Twitch", Icon: Twitch },
    { href: "https://chat.openai.com", label: "ChatGPT", Icon: MessageCircle },
  ];
  const [links, setLinks] = useState(defaultLinks);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("customLinks") || "[]");
    if (stored.length) {
      setLinks([
        ...defaultLinks,
        ...stored.map((l) => ({ ...l, Icon: MessageCircle })),
      ]);
    }
  }, []);

  const addCustomLink = (href, label) => {
    const stored = JSON.parse(localStorage.getItem("customLinks") || "[]");
    stored.push({ href, label });
    localStorage.setItem("customLinks", JSON.stringify(stored));
    setLinks((prev) => [...prev, { href, label, Icon: MessageCircle }]);
  };

  // ── Clock ──────────────────────────────────────────────────────────
  const [now, setNow] = useState(null);
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const dateStr = now?.toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" });
  const timeStr = now?.toLocaleTimeString("pl-PL");

  // ── Modal state ────────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-black text-black dark:text-white transition-colors px-4 py-10">
      {/* Top bar */}
      <div className="w-full flex justify-between items-center mb-6 max-w-6xl">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          aria-label="Przełącz tryb"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        {now && (
          <div className="font-mono text-sm sm:text-base text-right select-none">
            <div>{dateStr}</div>
            <div>{timeStr}</div>
          </div>
        )}
      </div>

      {/* Logo / Title */}
      <div className="flex flex-col items-center gap-2 mb-12">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-blue-600">
          <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" fill="none" />
          <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 className="text-3xl font-extrabold">MyLaunchpad</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Twoje centrum szybkiego dostępu</p>
      </div>

      {/* Links grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-xl mb-16">
        {links.map(({ href, label, Icon }, idx) => (
          <motion.a
            key={`${label}-${idx}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center gap-3 rounded-2xl p-5 shadow hover:shadow-xl active:scale-95 ${buttonClasses}`}
          >
            <Icon className={`w-6 h-6 ${iconColors[label] || "text-white"}`} />
            <span className="font-semibold">{label}</span>
          </motion.a>
        ))}
      </div>

      {/* Google search */}
      <form action="https://www.google.com/search" method="GET" target="_blank" className="w-full max-w-md">
        <div className="flex items-center gap-2">
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <input
            name="q"
            placeholder="Szukaj w Google..."
            className="flex-grow rounded-l-2xl px-4 py-3 bg-gray-100 dark:bg-gray-800"
          />
          <button
            type="submit"
            className={`rounded-r-2xl px-4 py-3 hover:shadow-xl active:scale-95 transition ${buttonBg}`}
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Floating add button */}
      <button
        onClick={() => setShowForm(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-xl hover:shadow-2xl active:scale-95 transition ${buttonBg}`}
        aria-label="Dodaj link"
      >
        <Plus className="w-6 h-6 text-white" />
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
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4"
          >
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-lg font-bold">Dodaj link</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full"
              >
                <Close className="w-4 h-4" />
              </button>
            </div>
            <input
              name="label"
              placeholder="Nazwa linku"
              className="rounded px-4 py-2 bg-gray-100 dark:bg-gray-800"
            />
            <input
              name="url"
              placeholder="https://example.com"
              type="url"
              className="rounded px-4 py-2 bg-gray-100 dark:bg-gray-800"
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

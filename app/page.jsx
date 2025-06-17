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
  Minus,
  X as Close,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

/* Brand icon colours (Tailwind text classes) */
const iconColors = {
  YouTube: "text-[#FF0000]",
  Twitter: "text-[#1DA1F2]",
  Instagram: "text-pink-500",
  Gmail: "text-[#EA4335]",
  Twitch: "text-[#9146FF]",
  ChatGPT: "text-[#10A37F]",
};

/* Send click to API (optimistic) */
async function sendClick(label) {
  try {
    await fetch("/api/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label }),
    });
  } catch {
    // offline – ignore
  }
}

export default function App() {
  const buttonClasses = "bg-blue-600 text-white";

  /* Default links */
  const defaultLinks = [
    { href: "https://www.youtube.com", label: "YouTube", Icon: Youtube, builtIn: true },
    { href: "https://twitter.com", label: "Twitter", Icon: Twitter, builtIn: true },
    { href: "https://www.instagram.com", label: "Instagram", Icon: Instagram, builtIn: true },
    { href: "https://mail.google.com", label: "Gmail", Icon: Mail, builtIn: true },
    { href: "https://www.twitch.tv", label: "Twitch", Icon: Twitch, builtIn: true },
    { href: "https://chat.openai.com", label: "ChatGPT", Icon: MessageCircle, builtIn: true },
  ];

  const [links, setLinks] = useState(defaultLinks);
  const [stats, setStats] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("customLinks") || "[]");
    if (stored.length) {
      setLinks([
        ...defaultLinks,
        ...stored.map((l) => ({ ...l, Icon: MessageCircle, builtIn: false })),
      ]);
    }

    fetch("/api/clicks")
      .then((r) => (r.ok ? r.json() : {}))
      .then((d) => setStats(d))
      .catch(() => {});
  }, []);

  const addCustomLink = (href, label) => {
    const stored = JSON.parse(localStorage.getItem("customLinks") || "[]");
    stored.push({ href, label });
    localStorage.setItem("customLinks", JSON.stringify(stored));
    setLinks((p) => [...p, { href, label, Icon: MessageCircle, builtIn: false }]);
  };

  const removeCustomLink = (label) => {
    const stored = JSON.parse(localStorage.getItem("customLinks") || "[]");
    localStorage.setItem(
      "customLinks",
      JSON.stringify(stored.filter((l) => l.label !== label)),
    );
    setLinks((p) => p.filter((l) => l.label !== label));
  };

  const handleLinkClick = (label) => {
    setStats((s) => ({ ...s, [label]: (s[label] || 0) + 1 }));
    sendClick(label);
  };

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-black text-white px-4 py-10">
      <div className="absolute top-4 right-4 font-mono text-xs sm:text-sm text-right select-none">
        <div>{now.toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" })}</div>
        <div>{now.toLocaleTimeString("pl-PL")}</div>
      </div>

      <div className="flex flex-col items-center gap-2 mb-12">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 className="text-3xl font-extrabold">MyLaunchpad</h1>
        <p className="text-sm text-gray-300">Twoje centrum szybkiego dostępu</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-xl mb-16">
        {links.map(({ href, label, Icon, builtIn }, idx) => (
          <div key={label} className="relative">
            {deleteMode && !builtIn && (
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
                {stats[label] ? `${stats[label]} użyć w tym tygodniu` : "-"}
              </span>
            </motion.a>
          </div>
        ))}
      </div>

      <form action="https://www.google.com/search" method="GET" target="_blank" className="w-full max-w-md mb-20">
        <div className="flex items-center gap-2">
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <input name="q" placeholder="Szukaj w Google..." className="flex-grow rounded-l-2xl px-4 py-3 bg-gray-200 text-black" />
          <button type="submit" className="rounded-r-2xl px-4 py-3 bg-blue-600 text-white hover:shadow-xl active:scale-95 transition">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      <button onClick={() => setShowForm(true)} className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-xl hover:shadow-2xl active:scale-95 transition" aria-label="Dodaj link">
        <Plus className="w-6 h-6" />
      </button>

      <button onClick={() => setDeleteMode((d) => !d)} className="fixed bottom-6 left-6 p-4 bg-red-600 text-white rounded-full shadow-xl hover:shadow-2xl active:scale-95 transition" aria-label="Usuń linki">
        {deleteMode ? <Close className="w-6 h-6" /> : <Minus className="w-6 h-6" />}
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <form
            className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const url = fd.get("url");
              const label = fd.get("label");
              if (url && label) addCustomLink(url, label);
              setShowForm(false);
            }}
          >
            <h2 className="text-xl font-bold">Dodaj link</h2>
            <input name="label" placeholder="Nazwa" className="rounded px-4 py-2 bg-gray-800" />
            <input name="url" placeholder="https://example.com" type="url" className="rounded px-4 py-2 bg-gray-800" />
            <div className="flex gap-4 mt-2">
              <button type="submit" className="flex-1 bg-blue-600 rounded px-4 py-2">Dodaj</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-700 rounded px-4 py-2">Anuluj</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

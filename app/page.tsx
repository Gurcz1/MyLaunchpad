"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const iconColors = {
  YouTube: "text-[#FF0000]",
  Twitter: "text-[#1DA1F2]",
  Instagram: "text-pink-500",
  Gmail: "text-[#EA4335]",
  Twitch: "text-[#9146FF]",
  ChatGPT: "text-[#10A37F]",
};

// Move defaultLinks outside component to fix useEffect dependency warning
const defaultLinks = [
  { href: "https://www.youtube.com", label: "YouTube", Icon: Youtube },
  { href: "https://twitter.com", label: "Twitter", Icon: Twitter },
  { href: "https://www.instagram.com", label: "Instagram", Icon: Instagram },
  { href: "https://mail.google.com", label: "Gmail", Icon: Mail },
  { href: "https://www.twitch.tv", label: "Twitch", Icon: Twitch },
  { href: "https://chat.openai.com", label: "ChatGPT", Icon: MessageCircle },
];

interface SortableLinkProps {
  id: string;
  children: React.ReactNode;
}

function SortableLink({ id, children }: SortableLinkProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

interface LinkType {
  href: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface StoredLink {
  href: string;
  label: string;
}

export default function App() {
  const buttonClasses = "bg-blue-700 text-white focus-visible:ring-4 ring-offset-2 focus:outline-none";

  const [links, setLinks] = useState<LinkType[]>(defaultLinks);
  const [showForm, setShowForm] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    const stored: StoredLink[] = JSON.parse(localStorage.getItem("customLinks") || "[]");
    const ordered: string[] = JSON.parse(localStorage.getItem("orderedLinks") || "[]");
    let combined = [...defaultLinks, ...stored.map((l: StoredLink) => ({ ...l, Icon: MessageCircle }))] as LinkType[];
    if (ordered.length) {
      combined = ordered.map((label: string) => combined.find((l) => l.label === label)).filter(Boolean) as LinkType[];
    }
    setLinks(combined);
  }, []); // Now the dependency array is correct since defaultLinks is outside the component

  const addCustomLink = (href: string, label: string) => {
    const stored = JSON.parse(localStorage.getItem("customLinks") || "[]");
    stored.push({ href, label });
    localStorage.setItem("customLinks", JSON.stringify(stored));
    const newLinks = [...links, { href, label, Icon: MessageCircle }];
    setLinks(newLinks);
    localStorage.setItem("orderedLinks", JSON.stringify(newLinks.map((l) => l.label)));
  };

  const removeCustomLink = (label: string) => {
    const stored: StoredLink[] = JSON.parse(localStorage.getItem("customLinks") || "[]");
    localStorage.setItem("customLinks", JSON.stringify(stored.filter((l: StoredLink) => l.label !== label)));
    const newLinks = links.filter((l) => l.label !== label);
    setLinks(newLinks);
    localStorage.setItem("orderedLinks", JSON.stringify(newLinks.map((l) => l.label)));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = links.findIndex((i) => i.label === active.id);
      const newIndex = links.findIndex((i) => i.label === over?.id);
      const newLinks = arrayMove(links, oldIndex, newIndex);
      setLinks(newLinks);
      localStorage.setItem("orderedLinks", JSON.stringify(newLinks.map((l) => l.label)));
    }
  };

  const sensors = useSensors(useSensor(PointerSensor));
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-black text-white px-4 py-10">
      <a
        href="https://gurcz1.github.io/Strona/#"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 left-4 text-xs sm:text-sm underline hover:text-blue-500 transition flex items-center gap-1"
      >
        <ExternalLink className="w-4 h-4" /> Moja strona
      </a>

      <div className="absolute top-4 right-4 font-mono text-xs sm:text-sm text-right select-none">
        <div>{now.toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" })}</div>
        <div>{now.toLocaleTimeString("pl-PL")}</div>
      </div>

      <div className="flex flex-col items-center gap-2 mb-12">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 className="text-3xl font-extrabold">MyLaunchpad</h1>
        <p className="text-sm text-gray-300">Twoje centrum szybkiego dostępu</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links.map((l) => l.label)} strategy={verticalListSortingStrategy}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-xl mb-16">
            {links.map(({ href, label, Icon }, idx) => (
              <SortableLink key={label} id={label}>
                <div className="relative group">
                  {deleteMode && (
                    <button
                      onClick={() => removeCustomLink(label)}
                      className="absolute -top-2 -right-2 z-20 bg-red-600 text-white rounded-full p-1 shadow transition-all focus-visible:ring-4 ring-offset-2"
                      aria-label="Usuń link"
                      role="button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <motion.a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative z-10 flex flex-col items-center gap-2 rounded-2xl p-5 shadow hover:shadow-xl active:scale-95 ${buttonClasses}`}
                    role="menuitem"
                  >
                    <Icon className={`w-6 h-6 ${iconColors[label as keyof typeof iconColors] || "text-white"}`} />
                    <span className="font-semibold">{label}</span>
                  </motion.a>
                </div>
              </SortableLink>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <form action="https://www.google.com/search" method="GET" target="_blank" className="w-full max-w-md mb-20">
        <div className="flex items-center gap-2">
          <Image 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            width={20}
            height={20}
            className="w-5 h-5" 
          />
          <input name="q" placeholder="Szukaj w Google..." className="flex-grow rounded-l-2xl px-4 py-3 bg-gray-200 text-black" />
          <button type="submit" className="rounded-r-2xl px-4 py-3 bg-blue-700 text-white hover:shadow-xl active:scale-95 transition focus-visible:ring-4 ring-offset-2">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      <button onClick={() => setShowForm(true)} className="fixed bottom-6 right-6 p-4 bg-blue-700 text-white rounded-full shadow-xl hover:shadow-2xl active:scale-95 transition focus-visible:ring-4 ring-offset-2" aria-label="Dodaj link" role="button">
        <Plus className="w-6 h-6" />
      </button>

      <button onClick={() => setDeleteMode((d) => !d)} className="fixed bottom-6 left-6 p-4 bg-red-600 text-white rounded-full shadow-xl hover:shadow-2xl active:scale-95 transition focus-visible:ring-4 ring-offset-2" aria-label="Usuń linki" role="button">
        {deleteMode ? <Close className="w-6 h-6" /> : <Minus className="w-6 h-6" />}
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target as HTMLFormElement);
              const url = fd.get("url") as string;
              const label = fd.get("label") as string;
              if (url && label) addCustomLink(url, label);
              setShowForm(false);
            }}
            className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">Dodaj link</h2>
              <button type="button" onClick={() => setShowForm(false)} aria-label="Zamknij formularz" role="button">
                <Close className="w-5 h-5 text-white" />
              </button>
            </div>
            <input name="label" placeholder="Nazwa" required className="rounded px-4 py-2 bg-gray-800 text-white" />
            <input name="url" placeholder="https://example.com" type="url" required className="rounded px-4 py-2 bg-gray-800 text-white" />
            <button type="submit" className="mt-2 bg-blue-700 text-white py-2 rounded hover:shadow-xl active:scale-95 transition focus-visible:ring-4 ring-offset-2" role="button">
              Dodaj
            </button>
          </form>
        </div>
      )}

    </div>
  );
}

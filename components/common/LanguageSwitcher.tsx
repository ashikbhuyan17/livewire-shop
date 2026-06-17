"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "bn", label: "বাংলা" },
  { code: "hi", label: "हिंदी" },
];

export default function LanguageSwitcher() {
  const handleChange = (lang: string) => {
    const googleSelect = document.querySelector(
      ".goog-te-combo",
    ) as HTMLSelectElement | null;

    if (!googleSelect) return;

    googleSelect.value = lang;
    googleSelect.dispatchEvent(new Event("change"));
  };

  return (
    <Select onValueChange={handleChange} defaultValue="en">
      <SelectTrigger className="h-8 w-[92px] border border-white/30 bg-white/10 text-xs text-white backdrop-blur-sm hover:bg-white/20 hover:text-white lg:h-9 hidden md:flex">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

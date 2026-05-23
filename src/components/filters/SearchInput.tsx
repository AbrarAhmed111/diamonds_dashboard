"use client";

import { Search } from "lucide-react";
import Input from "@/components/ui/Input";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search signals…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <Input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label="Search signals"
      leadingIcon={<Search className="h-4 w-4" />}
      containerClassName="w-full"
    />
  );
}

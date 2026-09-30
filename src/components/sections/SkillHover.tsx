"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface SkillHoverState {
  hovered: string | null;
  setHovered: (id: string | null) => void;
}

const SkillHoverContext = createContext<SkillHoverState>({ hovered: null, setHovered: () => {} });

export const useSkillHover = () => useContext(SkillHoverContext);

export function SkillHoverProvider({ children }: { children: ReactNode }) {
  const [hovered, setHovered] = useState<string | null>(null);
  return <SkillHoverContext.Provider value={{ hovered, setHovered }}>{children}</SkillHoverContext.Provider>;
}

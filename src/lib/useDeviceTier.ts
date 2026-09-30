"use client";

import { useSyncExternalStore } from "react";

export type DeviceTier = "none" | "low" | "high";

export interface DeviceInfo {
  tier: DeviceTier;
  isMobile: boolean;
  finePointer: boolean;
}

const SERVER: DeviceInfo = { tier: "none", isMobile: false, finePointer: false };
let cached: DeviceInfo | null = null;

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function detect(): DeviceInfo {
  if (cached) return cached;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  const isMobile = window.matchMedia("(max-width: 1023px)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let tier: DeviceTier = "high";
  if (reduced || cores <= 4 || !hasWebGL()) tier = "none";
  else if (isMobile) tier = "low";
  cached = { tier, isMobile, finePointer };
  return cached;
}

const subscribe = () => () => {};

/**
 * Capability snapshot used to gate 3D and pointer effects.
 * "none" → static fallback, "low" → reduced scene (mobile), "high" → full scene.
 */
export function useDeviceTier(): DeviceInfo {
  return useSyncExternalStore(subscribe, detect, () => SERVER);
}

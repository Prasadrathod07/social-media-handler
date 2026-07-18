import { create } from "zustand";
import { Cadence, Platform } from "../types";

interface OnboardingState {
  resumeText: string;
  bio: string;
  aboutMe: string;
  platforms: Platform[];
  cadence: Cadence;
  time: string;
  autoPublish: boolean;
  setField: <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => void;
  togglePlatform: (platform: Platform) => void;
  reset: () => void;
}

const defaults = {
  resumeText: "",
  bio: "",
  aboutMe: "",
  platforms: [] as Platform[],
  cadence: "weekly" as Cadence,
  time: "09:00",
  autoPublish: false,
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...defaults,
  setField: (key, value) => set({ [key]: value } as Partial<OnboardingState>),
  togglePlatform: (platform) => {
    const current = get().platforms;
    set({
      platforms: current.includes(platform) ? current.filter((p) => p !== platform) : [...current, platform],
    });
  },
  reset: () => set(defaults),
}));

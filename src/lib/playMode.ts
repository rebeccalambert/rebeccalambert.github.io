import { createContext, useContext } from 'react';

// sessionStorage, not localStorage: a recruiter coming back later should land
// on the classic view, but a reload mid-visit shouldn't kick you out of play mode.
const STORAGE_KEY = 'play-mode';

export function getInitialPlayMode(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'on';
  } catch {
    // sessionStorage can throw (private browsing, storage disabled) — default to classic.
    return false;
  }
}

export function applyPlayMode(isPlayMode: boolean): void {
  document.documentElement.setAttribute('data-mode', isPlayMode ? 'play' : 'classic');
  try {
    sessionStorage.setItem(STORAGE_KEY, isPlayMode ? 'on' : 'off');
  } catch {
    // Non-fatal: mode still applies, just won't survive a reload.
  }
}

interface PlayModeContextValue {
  isPlayMode: boolean;
  setPlayMode: (isPlayMode: boolean) => void;
}

export const PlayModeContext = createContext<PlayModeContextValue | null>(null);

export function usePlayMode(): PlayModeContextValue {
  const context = useContext(PlayModeContext);
  if (!context) throw new Error('usePlayMode must be used inside <PlayModeProvider>');
  return context;
}

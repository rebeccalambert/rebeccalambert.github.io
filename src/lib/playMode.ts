import { createContext, useContext, useSyncExternalStore } from 'react';

// sessionStorage, not localStorage: a recruiter coming back later should land
// on the classic view, but a reload mid-visit shouldn't kick you out of play mode.
const STORAGE_KEY = 'play-mode';

/** Play mode is desktop-only: its layouts and drag interactions need the width. */
export const PLAY_MODE_MEDIA = '(min-width: 1024px)';

function screenFitsPlayMode(): boolean {
  return window.matchMedia(PLAY_MODE_MEDIA).matches;
}

function subscribeToScreenSize(onChange: () => void): () => void {
  const query = window.matchMedia(PLAY_MODE_MEDIA);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/** True while the viewport is wide enough for Play mode; updates on resize. */
export function useCanPlay(): boolean {
  return useSyncExternalStore(subscribeToScreenSize, screenFitsPlayMode);
}

export function getInitialPlayMode(): boolean {
  if (!screenFitsPlayMode()) return false;
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'on';
  } catch {
    // sessionStorage can throw (private browsing, storage disabled) — default to classic.
    return false;
  }
}

export function persistPlayMode(isPlayMode: boolean): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, isPlayMode ? 'on' : 'off');
  } catch {
    // Non-fatal: mode still applies, just won't survive a reload.
  }
}

/**
 * Switches the page's color scheme. Called when the main content actually swaps
 * (after the exit animation), not when the toggle is pressed, so the classic
 * sections don't recolor while they're animating out.
 */
export function applyDocumentMode(isPlayMode: boolean): void {
  document.documentElement.setAttribute('data-mode', isPlayMode ? 'play' : 'classic');
}

interface PlayModeContextValue {
  isPlayMode: boolean;
  canPlay: boolean;
  setPlayMode: (isPlayMode: boolean) => void;
}

export const PlayModeContext = createContext<PlayModeContextValue | null>(null);

export function usePlayMode(): PlayModeContextValue {
  const context = useContext(PlayModeContext);
  if (!context) throw new Error('usePlayMode must be used inside <PlayModeProvider>');
  return context;
}

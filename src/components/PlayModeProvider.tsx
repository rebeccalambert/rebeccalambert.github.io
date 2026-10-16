import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { getInitialPlayMode, persistPlayMode, PlayModeContext, useCanPlay } from '../lib/playMode';

export default function PlayModeProvider({ children }: { children: ReactNode }) {
  const canPlay = useCanPlay();
  const [isPlayMode, setPlayMode] = useState(getInitialPlayMode);
  const [prevCanPlay, setPrevCanPlay] = useState(canPlay);

  // Shrinking the window below the breakpoint drops back to classic, and stays
  // there — growing the window again shouldn't silently re-enter Play mode.
  // Adjusted during render (not in an effect) per React's "storing information
  // from previous renders" pattern, so there's no extra render pass.
  if (canPlay !== prevCanPlay) {
    setPrevCanPlay(canPlay);
    if (!canPlay) setPlayMode(false);
  }

  useEffect(() => {
    persistPlayMode(isPlayMode);
  }, [isPlayMode]);

  const value = useMemo(
    () => ({ isPlayMode: isPlayMode && canPlay, canPlay, setPlayMode }),
    [isPlayMode, canPlay],
  );

  return <PlayModeContext value={value}>{children}</PlayModeContext>;
}

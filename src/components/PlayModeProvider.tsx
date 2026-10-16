import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { applyPlayMode, getInitialPlayMode, PlayModeContext } from '../lib/playMode';

export default function PlayModeProvider({ children }: { children: ReactNode }) {
  const [isPlayMode, setPlayMode] = useState(getInitialPlayMode);

  useEffect(() => {
    applyPlayMode(isPlayMode);
  }, [isPlayMode]);

  const value = useMemo(() => ({ isPlayMode, setPlayMode }), [isPlayMode]);

  return <PlayModeContext value={value}>{children}</PlayModeContext>;
}

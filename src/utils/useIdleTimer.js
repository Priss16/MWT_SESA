import { useEffect, useRef, useState, useCallback } from 'react';

// Real portals holding student/staff data (banking, university ERPs,
// exam cells) auto-lock or sign out idle sessions instead of staying
// open forever once someone's signed in. This hook is the timer behind
// that: it watches for real user activity (mouse, keyboard, touch,
// scroll) and reports back when the session has been idle long enough
// to warn, and long enough to lock.
//
// It only measures time - IdleGuard (the component using this hook)
// decides what "warn" and "lock" actually do (show a countdown modal,
// show a lock screen, etc).
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel'];

export function useIdleTimer({ enabled, idleMs, warningMs, onIdle }) {
  const [warning, setWarning] = useState(false);
  const [remainingMs, setRemainingMs] = useState(warningMs);
  const lastActivityRef = useRef(Date.now());
  const warningRef = useRef(false);

  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (warningRef.current) {
      warningRef.current = false;
      setWarning(false);
      setRemainingMs(warningMs);
    }
  }, [warningMs]);

  useEffect(() => {
    if (!enabled) return undefined;

    resetActivity();
    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, resetActivity, { passive: true }));

    // A single interval checking elapsed time is simpler and cheaper
    // than a fresh setTimeout per event - activity just pushes the
    // deadline back rather than resetting any timer machinery.
    const tick = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      const warnAt = idleMs - warningMs;

      if (elapsed >= idleMs) {
        clearInterval(tick);
        onIdle();
        return;
      }

      if (elapsed >= warnAt) {
        warningRef.current = true;
        setWarning(true);
        setRemainingMs(Math.max(0, idleMs - elapsed));
      }
    }, 1000);

    return () => {
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, resetActivity));
      clearInterval(tick);
    };
  }, [enabled, idleMs, warningMs, onIdle, resetActivity]);

  return { warning, remainingMs, stayActive: resetActivity };
}

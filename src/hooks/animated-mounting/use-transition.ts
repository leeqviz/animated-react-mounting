import { useCallback, useEffect, useState, type TransitionEvent } from "react";

export const useTransition = (active: boolean) => {
  const [mounted, setMounted] = useState(active);
  const [visible, setVisible] = useState(active);
  const [prevActive, setPrevActive] = useState(active);

  if (active !== prevActive) {
    setPrevActive(active);
    if (active) setMounted(true);
    else setVisible(false);
  }

  useEffect(() => {
    if (active && mounted && !visible) {
      const id = requestAnimationFrame(() => {
        setVisible(true);
      });
      return () => cancelAnimationFrame(id);
    }
  }, [active, mounted, visible]);

  const unmount = useCallback(
    (e: TransitionEvent<HTMLElement>) => {
      if (e.target !== e.currentTarget) return;
      if (!active) setMounted(false);
    },
    [active],
  );

  return { mounted, visible, unmount };
};

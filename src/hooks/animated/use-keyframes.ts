import { useCallback, useState, type AnimationEvent } from "react";

export const useKeyframes = (active: boolean) => {
  const [mounted, setMounted] = useState(active);
  const [prevActive, setPrevActive] = useState(active);

  if (active !== prevActive) {
    setPrevActive(active);
    if (active) setMounted(true);
  }

  const unmount = useCallback(
    (e: AnimationEvent<HTMLElement>) => {
      if (e.target !== e.currentTarget) return;
      if (!active) setMounted(false);
    },
    [active],
  );

  return { mounted, unmount };
};

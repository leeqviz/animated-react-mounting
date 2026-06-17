import { useCallback, useEffect, useState } from "react";

interface UseTransitionModalReturn {
  animationClass: "show" | "";
  isLeaving: boolean;
  startCloseAnimation: () => void;
  handleTransitionEnd: () => void;
}

export function useTransitionModal(
  onClose: () => void,
): UseTransitionModalReturn {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isLeaving, setIsLeaving] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const startCloseAnimation = useCallback(() => {
    setIsLeaving(true);
  }, []);

  const handleTransitionEnd = useCallback(() => {
    if (isLeaving) onClose();
  }, [isLeaving, onClose]);

  const animationClass = isMounted && !isLeaving ? "show" : "";

  return {
    animationClass,
    isLeaving,
    startCloseAnimation,
    handleTransitionEnd,
  };
}

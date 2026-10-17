import {
  useEffect,
  useRef,
  useState,
  type AnimationEvent,
  type TransitionEvent,
} from "react";

export interface UseAnimationOptions {
  isVisible: boolean;
  delay?: number;
}

export const useAnimation = ({ isVisible, delay }: UseAnimationOptions) => {
  const [mounted, setMounted] = useState(isVisible);
  const [prevIsVisible, setPrevIsVisible] = useState(isVisible);
  const elementRef = useRef<HTMLElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Синхронизация пропса и стейта во время рендера
  if (isVisible !== prevIsVisible) {
    setPrevIsVisible(isVisible);
    if (isVisible) {
      setMounted(true);
    }
  }

  // Эффект-предохранитель (fallback timeout)
  useEffect(() => {
    if (delay) {
      if (isVisible) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      } else if (mounted) {
        let computedDelay = undefined;
        if (elementRef.current) {
          const styles = window.getComputedStyle(elementRef.current);

          const transitionDuration =
            Number.parseFloat(styles.transitionDuration) ?? 0;
          const animationDuration =
            Number.parseFloat(styles.animationDuration) ?? 0;

          const maxDurationSec = Math.max(
            transitionDuration,
            animationDuration,
          );
          computedDelay = maxDurationSec * 1000 + 50;
        }

        timeoutRef.current = setTimeout(() => {
          setMounted(false);
        }, computedDelay ?? delay);
      }
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    } else {
      return () => {};
    }
  }, [isVisible, mounted, delay]);

  // Функция для вызова вручную на onAnimationEnd / onTransitionEnd
  const unmount = (
    e: TransitionEvent<HTMLElement> | AnimationEvent<HTMLElement>,
  ) => {
    // Защита: реагируем только на события самого контейнера, а не его дочерних элементов
    if (e.target !== e.currentTarget) return;

    if (!isVisible) {
      setMounted(false);
    }
  };

  return {
    elementRef,
    mounted,
    unmount,
  };
};

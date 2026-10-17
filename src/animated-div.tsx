import { type PropsWithChildren } from "react";
import { useAnimation } from "./use-animation";

interface AnimatedDivProps extends PropsWithChildren {
  isVisible: boolean;
  duration?: number; // Время в мс (запасной таймер)
  fromCSSClass?: string; // Класс для появления
  toCSSClass?: string;
  className?: string;
}

const ANIMATION_DURATION = 300;

export const AnimatedDiv = ({
  isVisible,
  children,
  duration = ANIMATION_DURATION,
  fromCSSClass = "fade-in",
  toCSSClass = "fade-out",
  className = "",
  ...props
}: AnimatedDivProps) => {
  const { elementRef, mounted, unmount } = useAnimation({
    isVisible,
    delay: duration + 50, // Небольшой запас к основной анимации
  });

  if (!mounted) return null;

  return (
    <div
      {...props}
      ref={(node: HTMLElement | null) => {
        // Записываем ноду в наш хук-реф
        elementRef.current = node;
      }}
      className={`${isVisible ? fromCSSClass : toCSSClass} ${className}`.trim()}
      onAnimationEnd={unmount}
      onTransitionEnd={unmount}
    >
      {children}
    </div>
  );
};

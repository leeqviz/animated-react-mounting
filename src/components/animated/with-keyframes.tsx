import {
  cloneElement,
  isValidElement,
  type ComponentType,
  type HTMLAttributes,
} from "react";
import { useKeyframes } from "../../hooks/animated";

interface WithKeyframesProps {
  active: boolean;
}

export function withKeyframes<P extends { className?: string }>(
  Component: ComponentType<P>,
  enterCSSClass: string,
  exitCSSClass: string,
) {
  return function AnimatedComponent(props: P & WithKeyframesProps) {
    const { active } = props;
    const { mounted, unmount } = useKeyframes(active);

    if (!mounted) return null;

    const element = <Component {...props} />;

    if (!isValidElement(element)) return element;

    return cloneElement(element, {
      onAnimationEnd: unmount,
      className:
        `${(element.props as P).className ?? ""} ${active ? enterCSSClass : exitCSSClass}`.trim(),
    } as Partial<P> & HTMLAttributes<HTMLElement>);
  };
}

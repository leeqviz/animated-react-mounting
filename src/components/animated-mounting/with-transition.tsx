import {
  cloneElement,
  isValidElement,
  type ComponentType,
  type HTMLAttributes,
} from "react";
import { useTransition } from "../../hooks/animated-mounting";

interface WithTransitionProps {
  active: boolean;
}

export function withTransition<P extends { className?: string }>(
  Component: ComponentType<P>,
  baseCSSClass: string,
  transitionCSSClass: string,
) {
  return function AnimatedComponent(props: P & WithTransitionProps) {
    const { active } = props;
    const { mounted, visible, unmount } = useTransition(active);

    if (!mounted) return null;

    const element = <Component {...props} />;

    if (!isValidElement(element)) return element;

    return cloneElement(element, {
      onTransitionEnd: unmount,
      className:
        `${(element.props as P).className || ""} ${baseCSSClass} ${visible ? transitionCSSClass : ""}`.trim(),
    } as Partial<P> & HTMLAttributes<HTMLElement>);
  };
}

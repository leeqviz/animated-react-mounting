import {
  cloneElement,
  isValidElement,
  type ComponentType,
  type HTMLAttributes,
} from "react";
import { useTransitions } from "../../hooks/animated-mounting";

interface WithTransitionsProps {
  active: boolean;
}

export function withTransitions<P extends { className?: string }>(
  Component: ComponentType<P>,
  baseCSSClass: string,
  transitionCSSClass: string,
) {
  return function AnimatedComponent(props: P & WithTransitionsProps) {
    const { active } = props;
    const { mounted, visible, unmount } = useTransitions(active);

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

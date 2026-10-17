# React Animation Mount/Unmount HOC Components & Hooks

Легковесное и производительное решение для монтирования и размонтирования React-компонентов с плавными анимациями **без использования таймеров (`setTimeout`)** в коде JavaScript и гибкого встраивания в уже готовые бизнес-компоненты. Всё что нужно сделать, это прописать свои стили анимации CSS и завернуть компонент в HOC, или использовать hook с логикой напрямую.

Вся логика завязана на нативных браузерных событиях `animationend` и `transitionend`. CSS является единственным источником правды для таймингов и описания анимации. А JS синхронизирует анимацию CSS с жизненным циклом компонентов React. После монтирования, проигрывается анимация монтирования, а перед размонтированием, React ждет окончания анимации.

## ✨ Преимущества подхода

- **60 FPS:** Анимации полностью обрабатываются графическим процессором (GPU) через CSS. React рендерит всё только один раз при монтировании и при размонтировании.
- **Синхронизация:** При изменении длительности анимации в CSS (`.module.css`), JS-код автоматически подстраивается под новые тайминги, потому что просто дожидается окончания анимации.
- **Чистая архитектура:** Логика полностью скрыта в кастомных хуках и Компонентах Высшего Порядка (HOC). Бизнес-компоненты остаются чистыми, что позволяет добиться достаточно гибкой интеграции. Лучше всего использовать анимацию на keyframes, а не с помощью transition, так как keyframes именно для этого и предназначены, а transition предназначен для элементов, которые уже есть в DOM.
- **Типобезопасность:** Полная поддержка TypeScript.

## 🛠️ Реализация

### 1. Подход через CSS Keyframes

#### `use-keyframes.ts`

Хук синхронно перехватывает изменение пропса `active` во время рендера (без сторонних эффектов в useEffect) и управляет жизненным циклом монтирования. Возвращает флаг монтирования для условного рендеринга компонента и функцию размонтирования, которую нужно передать в обработчик onAnimationEnd

```typescript
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
```

#### `with-keyframes.tsx`

Компонент высшего порядка, который обогащает любой компонент логикой анимированного монтирования и размонтирования с помощью хука и возвращает новый компонент с обработчиком окончания анимации, и встраивает кастомные классы анимации, которые ему были переданы

```tsx
import {
  cloneElement,
  isValidElement,
  type ComponentType,
  type HTMLAttributes,
} from "react";
import { useKeyframes } from "../../hooks/animated-mounting";

interface WithKeyframesProps {
  active: boolean;
}

export function withKeyframes<P extends { className?: string }>(
  Component: ComponentType<P>,
  startCSSClass: string,
  endCSSClass: string,
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
        `${(element.props as P).className ?? ""} ${active ? startCSSClass : endCSSClass}`.trim(),
    } as Partial<P> & HTMLAttributes<HTMLElement>);
  };
}
```

---

### 2. Подход через CSS Transitions (крайне не рекомендуется)

#### `use-transitions.ts`

Использует `requestAnimationFrame`, чтобы дать браузеру отрендерить базовое состояние элемента перед запуском плавного перехода (`transition`). Своего рода костыль, который, в теории, может создать рассинхронизацию анимирования CSS и JS

```typescript
import { useCallback, useEffect, useState, type TransitionEvent } from "react";

export const useTransitions = (active: boolean) => {
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
```

#### `with-transitions.tsx`

```tsx
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
```

---

## 🚀 Пример использования

### ⚠️ Важное требование к компонентам

Целевой компонент, который мы хотим обогатить логикой анимированного монтирования и размонтирования через HOC, **обязан принимать пропсы** (`className`, `onAnimationEnd`/`onTransitionEnd`) и прокидывать их на свой корневой HTML-тег, в который HOC компонент встроит классы анимации, которые мы ему передадим, и будет слушать его `onAnimationEnd`/`onTransitionEnd`. При использовании хука напрямую, придется прокидывать всё вручную.

#### `example.tsx`

```tsx
const example = {
  firstName: "Иван",
  lastName: "Иванов",
} as const;

interface ExampleProps {
  title?: string;
  className?: string;
}

export function Example({ title, ...rest }: Readonly<ExampleProps>) {
  return (
    <div {...rest}>
      {title && <h1>{title}</h1>}
      <h2>Мой Профиль</h2>
      <div
        style={{
          background: "#f9f9f9",
          padding: "16px",
          borderRadius: "6px",
          marginBottom: "16px",
        }}
      >
        <p>
          <strong>Имя:</strong> {example.firstName}
        </p>
        <p>
          <strong>Фамилия:</strong> {example.lastName}
        </p>
      </div>
    </div>
  );
}
```

### Создание и рендер анимированных компонентов

#### `example-with-keyframes.ts`

```typescript
import { withKeyframes } from "../../animated-mounting";
import { Example } from "../example";
import classes from "./example-with-keyframes.module.css";

export const ExampleWithKeyframes = withKeyframes(
  Example,
  classes.appear,
  classes.disappear,
);
```

#### `example-with-transitions.ts`

```typescript
import { withTransitions } from "../../animated-mounting";
import { Example } from "../example";
import classes from "./example-with-transitions.module.css";

export const ExampleWithTransitions = withTransitions(
  Example,
  classes.invisible,
  classes.visible,
);
```

#### `app.tsx`

```tsx
import { useState } from "react";
import {
  Example,
  ExampleWithKeyframes,
  ExampleWithTransitions,
} from "../components/example";

export const App = () => {
  const [active, setActive] = useState<boolean>(false);

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        maxWidth: "400px",
        margin: "40px auto",
      }}
    >
      <button
        style={{ marginBottom: "30px" }}
        onClick={() => setActive(!active)}
      >
        {active ? "Скрыть" : "Показать"}
      </button>
      <Example title="Компонент по умолчанию" />
      <ExampleWithKeyframes
        active={active}
        title="Сделано через keyframes (предпочтительно для монтирования элемента на экране)"
      />
      <ExampleWithTransitions
        active={active}
        title="Сделано через transitions (предпочтительно только для переходов уже существующих элементов на экране)"
      />
    </div>
  );
};
```

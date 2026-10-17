import { useState } from "react";
import { User } from "./components/user";
import { UserWithKeyframes } from "./components/user/user-with-keyframes";
import { UserWithTransition } from "./components/user/user-with-transition";

export const App = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

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
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? "Скрыть" : "Показать"}
      </button>
      <User title="Компонент по умолчанию" />
      <UserWithKeyframes
        active={isVisible}
        title="Сделано через keyframes (предпочтительно для монтирования элемента на экране)"
      />
      <UserWithTransition
        active={isVisible}
        title="Сделано через transition (предпочтительно только для переходов уже существующих элементов на экране)"
      />
    </div>
  );
};

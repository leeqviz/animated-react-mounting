import { useState } from "react";
import { AnimatedDiv } from "./animated-div";

const user = {
  firstName: "Иван",
  lastName: "Иванов",
} as const;

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
        {isVisible ? "Закрыть профиль" : "Открыть профиль"}
      </button>
      <AnimatedDiv isVisible={isVisible}>
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
            <strong>Имя:</strong> {user.firstName}
          </p>
          <p>
            <strong>Фамилия:</strong> {user.lastName}
          </p>
        </div>
      </AnimatedDiv>
    </div>
  );
};

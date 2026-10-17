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

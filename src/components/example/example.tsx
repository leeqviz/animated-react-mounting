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

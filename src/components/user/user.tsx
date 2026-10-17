const user = {
  firstName: "Иван",
  lastName: "Иванов",
} as const;

interface UserProps {
  title?: string;
  className?: string;
}

export function User({ title, ...rest }: Readonly<UserProps>) {
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
          <strong>Имя:</strong> {user.firstName}
        </p>
        <p>
          <strong>Фамилия:</strong> {user.lastName}
        </p>
      </div>
    </div>
  );
}

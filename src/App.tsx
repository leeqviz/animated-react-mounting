import { useState } from "react";
import { ProfileForm, type User } from "./ProfileForm";

export default function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [user, setUser] = useState<User>({
    firstName: "Иван",
    lastName: "Иванов",
  });

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        maxWidth: "400px",
        margin: "40px auto",
      }}
    >
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

      <button onClick={() => setIsOpen(true)}>Редактировать данные</button>

      {isOpen && (
        <ProfileForm
          key={user.firstName + user.lastName}
          initialUser={user}
          onClose={() => setIsOpen(false)}
          onSave={(newData: User) => {
            setUser(newData);
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}

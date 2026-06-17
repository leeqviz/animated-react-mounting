import React, { useEffect, useRef, useState } from "react";
import { useTransitionModal } from "./useTransitionModal";

export interface User {
  firstName: string;
  lastName: string;
}

interface ProfileFormProps {
  initialUser: User;
  onClose: () => void;
  onSave: (newData: User) => void;
}

const fakeSaveUserApi = async (
  userData: User,
): Promise<{ success: boolean }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.3) {
        reject(new Error("Ошибка сервера. Попробуйте еще раз."));
      } else {
        resolve({ success: true });
      }
    }, 1200);
  });
};

export function ProfileForm({
  initialUser,
  onClose,
  onSave,
}: ProfileFormProps) {
  const [firstName, setFirstName] = useState<string>(initialUser.firstName);
  const [lastName, setLastName] = useState<string>(initialUser.lastName);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const firstInputRef = useRef<HTMLInputElement>(null);

  const pendingDataRef = useRef<User | null>(null);

  const {
    animationClass,
    isLeaving,
    startCloseAnimation,
    handleTransitionEnd,
  } = useTransitionModal(() => {
    if (pendingDataRef.current) {
      onSave(pendingDataRef.current);
    } else {
      onClose();
    }
  });

  useEffect(() => {
    if (!isLeaving) firstInputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) startCloseAnimation();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLoading, isLeaving, startCloseAnimation]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await fakeSaveUserApi({ firstName, lastName });
      pendingDataRef.current = { firstName, lastName };
      startCloseAnimation();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className={`modal-backdrop ${animationClass}`}>
      <form
        onSubmit={handleSubmit}
        className={`modal-content ${animationClass}`}
        onTransitionEnd={handleTransitionEnd}
      >
        <h3>Редактирование профиля</h3>

        {error && <div className="error-message">{error}</div>}

        <div>
          <label>Имя:</label>
          <input
            ref={firstInputRef}
            type="text"
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFirstName(e.target.value)
            }
            disabled={isLoading}
          />
        </div>

        <div>
          <label>Фамилия:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLastName(e.target.value)
            }
            disabled={isLoading}
          />
        </div>

        <div className="buttons-group">
          <button
            type="button"
            onClick={startCloseAnimation}
            disabled={isLoading}
          >
            Отмена
          </button>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </form>
    </div>
  );
}

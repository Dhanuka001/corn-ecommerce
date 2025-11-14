"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { NotificationStack } from "@/components/notifications/notification-stack";

type NotificationType = "success" | "error";

export type NotificationRecord = {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration: number;
  dismissing?: boolean;
};

type NotificationInput = {
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
};

type NotificationContextValue = {
  notify: (input: NotificationInput) => string;
  notifySuccess: (
    title: string,
    message?: string,
    options?: { duration?: number },
  ) => string;
  notifyError: (
    title: string,
    message?: string,
    options?: { duration?: number },
  ) => string;
  dismiss: (id: string) => void;
};

const EXIT_DURATION_MS = 220;
const EXIT_TIMER_PREFIX = "exit-";

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

const createId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const finalizeRemoval = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
    const exitTimerId = timersRef.current.get(`${EXIT_TIMER_PREFIX}${id}`);
    if (exitTimerId) {
      clearTimeout(exitTimerId);
      timersRef.current.delete(`${EXIT_TIMER_PREFIX}${id}`);
    }
  }, []);

  const beginDismiss = useCallback(
    (id: string) => {
      setNotifications((prev) => {
        let mutated = false;
        const next = prev.map((notification) => {
          if (notification.id !== id) {
            return notification;
          }
          if (notification.dismissing) {
            return notification;
          }
          mutated = true;
          return { ...notification, dismissing: true };
        });
        return mutated ? next : prev;
      });
      const existingExitTimer = timersRef.current.get(
        `${EXIT_TIMER_PREFIX}${id}`,
      );
      if (existingExitTimer) {
        return;
      }
      const timeout = setTimeout(() => finalizeRemoval(id), EXIT_DURATION_MS);
      timersRef.current.set(`${EXIT_TIMER_PREFIX}${id}`, timeout);
    },
    [finalizeRemoval],
  );

  const cancelTimer = useCallback((id: string) => {
    const timeoutId = timersRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timersRef.current.delete(id);
    }
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      cancelTimer(id);
      beginDismiss(id);
    },
    [beginDismiss, cancelTimer],
  );

  const scheduleRemoval = useCallback(
    (id: string, duration: number) => {
      const timeout = setTimeout(() => {
        timersRef.current.delete(id);
        beginDismiss(id);
      }, duration);
      timersRef.current.set(id, timeout);
    },
    [beginDismiss],
  );

  const notify = useCallback(
    (input: NotificationInput) => {
      const id = createId();
      const baseDuration = input.type === "success" ? 3600 : 5200;
      const displayDuration =
        input.duration && input.duration > 0 ? input.duration : baseDuration;
      const totalDuration = displayDuration + EXIT_DURATION_MS;

      setNotifications((prev) => [
        ...prev,
        {
          id,
          type: input.type,
          title: input.title,
          message: input.message,
          duration: totalDuration,
        },
      ]);

      scheduleRemoval(id, Math.max(totalDuration, EXIT_DURATION_MS + 200));

      return id;
    },
    [scheduleRemoval],
  );

  const notifySuccess = useCallback(
    (
      title: string,
      message?: string,
      options?: {
        duration?: number;
      },
    ) =>
      notify({
        type: "success",
        title,
        message,
        duration: options?.duration,
      }),
    [notify],
  );

  const notifyError = useCallback(
    (
      title: string,
      message?: string,
      options?: {
        duration?: number;
      },
    ) =>
      notify({
        type: "error",
        title,
        message,
        duration: options?.duration,
      }),
    [notify],
  );

  const contextValue = useMemo<NotificationContextValue>(
    () => ({
      notify,
      notifySuccess,
      notifyError,
      dismiss,
    }),
    [dismiss, notify, notifyError, notifySuccess],
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationStack
        notifications={notifications}
        onDismiss={dismiss}
        exitDuration={EXIT_DURATION_MS}
      />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return ctx;
}

"use client";

import type { NotificationRecord } from "@/context/notification-context";

type NotificationStackProps = {
  notifications: NotificationRecord[];
  onDismiss: (id: string) => void;
  exitDuration: number;
};

const accentByType = {
  success:
    "from-emerald-500 via-emerald-400 to-emerald-500 text-white shadow-emerald-100/70",
  error: "from-red-500 via-rose-500 to-red-500 text-white shadow-red-100/70",
};

const ringByType = {
  success: "ring-emerald-100",
  error: "ring-red-100",
};

const badgeIcon = {
  success: (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M9.5 16.2 5.8 12.5l1.4-1.4 2.3 2.34 7.3-7.3 1.4 1.42z"
      />
    </svg>
  ),
  error: (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 13.4 8.3 17.1 6.9 15.7l3.7-3.7-3.7-3.7L8.3 6.9l3.7 3.7 3.7-3.7 1.4 1.4-3.7 3.7 3.7 3.7-1.4 1.4z"
      />
    </svg>
  ),
};

export function NotificationStack({
  notifications,
  onDismiss,
  exitDuration,
}: NotificationStackProps) {
  if (!notifications.length) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[1100] flex flex-col gap-3 px-4 sm:top-6 sm:right-6 sm:left-auto sm:bottom-auto sm:w-full sm:max-w-sm">
      {notifications.map((notification) => {
        const accent = accentByType[notification.type];
        const ring = ringByType[notification.type];
        const progressDuration = Math.max(
          notification.duration - exitDuration,
          250,
        );

        return (
          <div
            key={notification.id}
            className={`pointer-events-auto overflow-hidden rounded-3xl bg-white/95 p-4 shadow-2xl ring-1 backdrop-blur ${ring} ${
              notification.dismissing
                ? "notification-leave"
                : "notification-enter"
            }`}
            role="status"
            aria-live="assertive"
          >
            <div className="flex items-start gap-3">
              <div
                className={`rounded-2xl bg-gradient-to-br p-3 shadow-lg ${accent}`}
              >
                {badgeIcon[notification.type]}
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-slate-900">
                  {notification.title}
                </p>
                {notification.message && (
                  <p className="mt-1 text-sm text-slate-600">
                    {notification.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(notification.id)}
                aria-label="Dismiss notification"
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <span className="mt-4 block h-1 w-full rounded-full bg-slate-100">
              <span
                className={`notification-progress block h-full origin-left rounded-full ${
                  notification.type === "success"
                    ? "bg-emerald-500"
                    : "bg-red-500"
                }`}
                style={{
                  animationDuration: `${progressDuration}ms`,
                }}
              />
            </span>
          </div>
        );
      })}
    </div>
  );
}

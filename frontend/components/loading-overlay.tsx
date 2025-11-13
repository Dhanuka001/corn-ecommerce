import Image from "next/image";

type LoadingOverlayProps = {
  visible: boolean;
  background?: "solid" | "transparent";
};

export function LoadingOverlay({
  visible,
  background = "solid",
}: LoadingOverlayProps) {
  if (!visible) {
    return null;
  }

  const backdropClass =
    background === "transparent" ? "bg-transparent" : "bg-[var(--background)]";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[9999] flex items-center justify-center ${backdropClass} pointer-events-auto`}
    >
      <div className="relative flex h-40 w-40 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-primary/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-2 border-t-primary animate-[spin_1.4s_linear_infinite]" />

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-transparent">
          <Image
            src="/logo.png"
            alt="Corn Ecommerce logo"
            width={64}
            height={64}
            priority
            className="h-20 w-20 object-contain"
          />
        </div>
      </div>
    </div>
  );
}

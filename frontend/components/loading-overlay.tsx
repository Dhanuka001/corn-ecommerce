import Image from "next/image";

type LoadingOverlayProps = {
  visible: boolean;
};

export function LoadingOverlay({ visible }: LoadingOverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]">
      <div className="relative flex h-40 w-40 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-primary/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-2 border-t-primary animate-[spin_1.4s_linear_infinite]" />

        <div className="flex h-20 w-20 items-center justify-center rounded-full">
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

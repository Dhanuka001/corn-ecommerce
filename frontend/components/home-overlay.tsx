"use client";

import { useEffect, useState } from "react";

import { LoadingOverlay } from "@/components/loading-overlay";

export function HomeOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setVisible(false), 80);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return <LoadingOverlay visible={visible} />;
}

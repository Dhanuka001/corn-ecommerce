"use client";

import Script from "next/script";

type GoogleIdentityScriptProps = {
  clientId?: string;
};

export function GoogleIdentityScript({
  clientId,
}: GoogleIdentityScriptProps) {
  if (!clientId) {
    return null;
  }

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onLoad={() => {
        document.dispatchEvent(
          new Event("google-identity-service-loaded"),
        );
      }}
    />
  );
}

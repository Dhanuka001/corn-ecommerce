export {};

declare global {
  interface GoogleCredentialResponse {
    credential?: string;
    select_by?: string;
  }

  interface GooglePromptNotification {
    isNotDisplayed(): boolean;
    getNotDisplayedReason(): string;
    isSkippedMoment(): boolean;
    getSkippedReason(): string;
    isDismissedMoment(): boolean;
    getDismissedReason(): string;
  }

  interface GoogleIdInitializeConfig {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    ux_mode?: "popup" | "redirect";
    state_cookie_domain?: string;
    itp_support?: boolean;
  }

  interface GooglePromptOptions {
    use_fedcm_for_prompt?: boolean;
  }

  interface GoogleAccountsId {
    initialize: (config: GoogleIdInitializeConfig) => void;
    prompt: (
      momentListener?: (notification: GooglePromptNotification) => void,
      options?: GooglePromptOptions,
    ) => void;
  }

  interface Window {
    google?: {
      accounts?: {
        id?: GoogleAccountsId;
      };
    };
  }
}

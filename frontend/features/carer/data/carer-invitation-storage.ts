import type {
  CarerInvitationDraft,
  PendingCarerInvitation,
} from "@/features/carer/types/carer-invitation";

const DRAFT_STORAGE_KEY =
  "ai-dra:carer-invitation-draft";

const PENDING_STORAGE_KEY =
  "ai-dra:pending-carer-invitation";

const NOTICE_STORAGE_KEY =
  "ai-dra:invitation-notice";

function createExpiryDate() {
  const expiryDate = new Date();

  expiryDate.setDate(expiryDate.getDate() + 30);

  return expiryDate.toISOString();
}

export function saveInvitationDraft(
  draft: CarerInvitationDraft,
) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    DRAFT_STORAGE_KEY,
    JSON.stringify(draft),
  );
}

export function getInvitationDraft():
  | CarerInvitationDraft
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedDraft =
    window.sessionStorage.getItem(
      DRAFT_STORAGE_KEY,
    );

  if (!storedDraft) {
    return null;
  }

  try {
    return JSON.parse(
      storedDraft,
    ) as CarerInvitationDraft;
  } catch {
    return null;
  }
}

export function savePendingInvitation(
  draft: CarerInvitationDraft,
): PendingCarerInvitation | null {
  if (typeof window === "undefined") {
    return null;
  }

  const pendingInvitation: PendingCarerInvitation = {
    ...draft,
    status: "PENDING",
    sentAt: new Date().toISOString(),
    expiresAt: createExpiryDate(),
  };

  window.sessionStorage.setItem(
    PENDING_STORAGE_KEY,
    JSON.stringify(pendingInvitation),
  );

  return pendingInvitation;
}

export function getPendingInvitation():
  | PendingCarerInvitation
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedInvitation =
    window.sessionStorage.getItem(
      PENDING_STORAGE_KEY,
    );

  if (!storedInvitation) {
    return null;
  }

  try {
    return JSON.parse(
      storedInvitation,
    ) as PendingCarerInvitation;
  } catch {
    return null;
  }
}

export function resendPendingInvitation():
  | PendingCarerInvitation
  | null {
  const invitation = getPendingInvitation();

  if (!invitation) {
    return null;
  }

  const updatedInvitation: PendingCarerInvitation = {
    ...invitation,
    sentAt: new Date().toISOString(),
    expiresAt: createExpiryDate(),
  };

  window.sessionStorage.setItem(
    PENDING_STORAGE_KEY,
    JSON.stringify(updatedInvitation),
  );

  return updatedInvitation;
}

export function cancelPendingInvitation() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(
    PENDING_STORAGE_KEY,
  );
}

export function saveInvitationNotice(
  message: string,
) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    NOTICE_STORAGE_KEY,
    message,
  );
}

export function consumeInvitationNotice():
  | string
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  const message =
    window.sessionStorage.getItem(
      NOTICE_STORAGE_KEY,
    );

  window.sessionStorage.removeItem(
    NOTICE_STORAGE_KEY,
  );

  return message;
}
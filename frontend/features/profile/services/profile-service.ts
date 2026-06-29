export type EmergencyContact = {
  full_name: string;
  phone: string | null;
  email: string | null;
  relationship: string | null;
};

export type CurrentProfile = {
  id: string;
  role: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_path: string | null;
  avatar_url: string | null;
  affected_side: string | null;
  date_of_birth: string | null;
  created_at: string;
  onboarding_completed: boolean;
  onboarding_skipped: boolean;
  emergency_contact: EmergencyContact | null;
  rehabilitation_level: string;
  weekly_goal_minutes: number | null;
  sessions_completed: number;
};

type CurrentProfileResponse = {
  profile: CurrentProfile;
};

export async function getCurrentProfile(): Promise<CurrentProfile> {
  const response = await fetch(
    "/api/profile",
    {
      cache: "no-store",
    }
  );

  const data = (await response.json()) as
    | CurrentProfileResponse
    | { error?: string };

  if (
    !response.ok ||
    !("profile" in data)
  ) {
    throw new Error(
      "error" in data && data.error
        ? data.error
        : "Unable to load profile."
    );
  }

  return data.profile;
}

export type UpdateCurrentProfileInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
};

export async function updateCurrentProfile(
  input: UpdateCurrentProfileInput
): Promise<{
  emailConfirmationRequired: boolean;
}> {
  const response = await fetch(
    "/api/profile",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }
  );

  const data = (await response.json()) as {
    success?: boolean;
    error?: string;
    emailConfirmationRequired?: boolean;
  };

  if (!response.ok || !data.success) {
    throw new Error(
      data.error ||
        "Unable to update profile."
    );
  }

  return {
    emailConfirmationRequired:
      data.emailConfirmationRequired === true,
  };
}

export async function uploadProfileAvatar(
  file: File
): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "/api/profile/avatar",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = (await response.json()) as {
    success?: boolean;
    avatarUrl?: string | null;
    error?: string;
  };

  if (!response.ok || !data.success) {
    throw new Error(
      data.error ||
        "Unable to upload profile picture."
    );
  }

  return data.avatarUrl ?? null;
}

export async function removeProfileAvatar() {
  const response = await fetch(
    "/api/profile/avatar",
    {
      method: "DELETE",
    }
  );

  const data = (await response.json()) as {
    success?: boolean;
    error?: string;
  };

  if (!response.ok || !data.success) {
    throw new Error(
      data.error ||
        "Unable to remove profile picture."
    );
  }
}
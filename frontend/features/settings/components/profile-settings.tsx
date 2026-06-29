"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  updateCurrentProfile,
  type CurrentProfile,
} from "@/features/profile/services/profile-service";

type ProfileSettingsProps = {
  profile: CurrentProfile | null;
  isLoading: boolean;
  error: string | null;
  onProfileUpdated: () => Promise<CurrentProfile>;
  onChangePassword: () => void;
};

type ProfileFormState = {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phone: string;
};

const emptyForm: ProfileFormState = {
  firstName: "",
  lastName: "",
  email: "",
  dateOfBirth: "",
  phone: "",
};

export function ProfileSettings({
  profile,
  isLoading,
  error,
  onProfileUpdated,
  onChangePassword,
}: ProfileSettingsProps) {
  const [form, setForm] =
    useState<ProfileFormState>(emptyForm);

  const [isEditing, setIsEditing] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const [formError, setFormError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;

    setForm({
      firstName: profile.first_name ?? "",
      lastName: profile.last_name ?? "",
      email: profile.email ?? "",
      dateOfBirth: profile.date_of_birth ?? "",
      phone: profile.phone ?? "",
    });
  }, [profile]);

  const emergencyContact = useMemo(() => {
    if (!profile?.emergency_contact) {
      return "Not Set";
    }

    const {
      full_name,
      phone,
      email,
      relationship,
    } = profile.emergency_contact;

    const contactMethod =
      phone || email || "";

    const relationshipText = relationship
      ? ` — ${relationship}`
      : "";

    return contactMethod
      ? `${full_name} (${contactMethod})${relationshipText}`
      : `${full_name}${relationshipText}`;
  }, [profile]);

  const updateField = (
    field: keyof ProfileFormState,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setFormError(null);
    setSuccessMessage(null);
  };

  const handleCancel = () => {
    if (profile) {
      setForm({
        firstName: profile.first_name ?? "",
        lastName: profile.last_name ?? "",
        email: profile.email ?? "",
        dateOfBirth:
          profile.date_of_birth ?? "",
        phone: profile.phone ?? "",
      });
    }

    setIsEditing(false);
    setFormError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSaving) return;

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email
      .trim()
      .toLowerCase();

    if (!firstName || !lastName) {
      setFormError(
        "First name and last name are required."
      );
      return;
    }

    if (!email) {
      setFormError(
        "Email address is required."
      );
      return;
    }

    setIsSaving(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      const result =
        await updateCurrentProfile({
          firstName,
          lastName,
          email,
          phone:
            form.phone.trim() || null,
          dateOfBirth:
            form.dateOfBirth || null,
        });

      await onProfileUpdated();

      setIsEditing(false);

      setSuccessMessage(
        result.emailConfirmationRequired
          ? "Your profile was updated. Check both your current and new email addresses to confirm the email change."
          : "Your profile has been updated successfully."
      );
    } catch (saveError) {
      setFormError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to update your profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <div>
        <h1 className="text-[40px] font-bold text-[#1E1E1E]">
          Profile Settings
        </h1>

        <p className="mt-1 text-[20px] text-[#1E1E1E]">
          Manage your personal information.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-8">
          <p className="text-[#666666]">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div>
        <h1 className="text-[40px] font-bold text-[#1E1E1E]">
          Profile Settings
        </h1>

        <p className="mt-1 text-[20px] text-[#1E1E1E]">
          Manage your personal information.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-8">
          <p className="text-red-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-bold text-[#1E1E1E]">
            Profile Settings
          </h1>

          <p className="mt-1 text-[20px] text-[#1E1E1E]">
            Manage your personal information.
          </p>
        </div>

        {!isEditing && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsEditing(true);
              setFormError(null);
              setSuccessMessage(null);
            }}
            className="mt-2 h-12 rounded-full px-7"
          >
            Edit
          </Button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl bg-white p-8"
      >
        {successMessage && (
          <div className="mb-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {formError && (
          <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="first-name"
              className="text-sm text-[#666666]"
            >
              First name
            </label>

            <Input
              id="first-name"
              value={form.firstName}
              onChange={(event) =>
                updateField(
                  "firstName",
                  event.target.value
                )
              }
              disabled={!isEditing || isSaving}
              autoComplete="given-name"
              className="mt-2 h-16 rounded-xl disabled:cursor-default disabled:opacity-100"
            />
          </div>

          <div>
            <label
              htmlFor="last-name"
              className="text-sm text-[#666666]"
            >
              Last name
            </label>

            <Input
              id="last-name"
              value={form.lastName}
              onChange={(event) =>
                updateField(
                  "lastName",
                  event.target.value
                )
              }
              disabled={!isEditing || isSaving}
              autoComplete="family-name"
              className="mt-2 h-16 rounded-xl disabled:cursor-default disabled:opacity-100"
            />
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="email"
            className="text-sm text-[#666666]"
          >
            Email Address
          </label>

          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) =>
              updateField(
                "email",
                event.target.value
              )
            }
            disabled={!isEditing || isSaving}
            autoComplete="email"
            className="mt-2 h-16 rounded-xl disabled:cursor-default disabled:opacity-100"
          />

          {isEditing && (
            <p className="mt-2 text-xs text-[#777777]">
              Changing your email may require confirmation before it becomes active.
            </p>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="date-of-birth"
            className="text-sm text-[#666666]"
          >
            Date of Birth
          </label>

          <Input
            id="date-of-birth"
            type="date"
            value={form.dateOfBirth}
            onChange={(event) =>
              updateField(
                "dateOfBirth",
                event.target.value
              )
            }
            disabled={!isEditing || isSaving}
            autoComplete="bday"
            className="mt-2 h-16 rounded-xl disabled:cursor-default disabled:opacity-100"
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="emergency-contact"
            className="text-sm text-[#666666]"
          >
            Emergency Contact
          </label>

          <Input
            id="emergency-contact"
            value={emergencyContact}
            disabled
            className="mt-2 h-16 rounded-xl disabled:cursor-default disabled:opacity-100"
          />

          <p className="mt-2 text-xs text-[#777777]">
            Emergency contact details come from your primary caregiver.
          </p>
        </div>

        <div className="mt-4">
          <label
            htmlFor="phone"
            className="text-sm text-[#666666]"
          >
            Phone Number
          </label>

          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(event) =>
              updateField(
                "phone",
                event.target.value
              )
            }
            disabled={!isEditing || isSaving}
            placeholder="Not Set"
            autoComplete="tel"
            className="mt-2 h-16 rounded-xl disabled:cursor-default disabled:opacity-100"
          />
        </div>

        <div className="mt-4">
          <label className="text-sm text-[#666666]">
            Password
          </label>

          <div className="mt-2 flex min-h-16 items-center justify-between gap-4 rounded-xl border border-input bg-background px-4">
            <div>
              <p className="font-medium text-[#1E1E1E]">
                Password protected
              </p>

              <p className="text-sm text-[#777777]">
                Your current password is never displayed.
              </p>
            </div>

             <button
              type="button"
              onClick={onChangePassword}
              className="shrink-0 font-semibold text-[#592EBD] hover:underline"
            >
              Change Password
            </button>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex items-center gap-3">
            <Button
              type="submit"
              disabled={isSaving}
              className="h-14 rounded-full bg-[#592EBD] px-10 text-[16px] hover:bg-[#4B24A8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving
                ? "Saving..."
                : "Save Changes"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
              className="h-14 rounded-full px-10 text-[16px]"
            >
              Cancel
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Camera,
  CheckCircle2,
  ImagePlus,
  LockKeyhole,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";

import {
  SettingsPageHeader,
  SettingsToast,
} from "@/features/carer/components/settings/settings-ui";
import { cn } from "@/lib/utils";

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  preferredContact: string;
  supportInformation: string;
};

const initialProfile: ProfileForm = {
  firstName: "Haruna",
  lastName: "Nayaya",
  email: "harunanayaya37@gmail.com",
  phone: "+44 7700 900 184",
  location: "Derby, United Kingdom",
  preferredContact: "EMAIL",
  supportInformation:
    "I support linked survivors with rehabilitation reminders, encouragement and session follow-up.",
};

const inputClassName =
  "h-14 w-full rounded-xl border border-[#DEDAD6] bg-white px-4 text-sm text-[#302C29] outline-none transition placeholder:text-[#A09A96] focus:border-[#592EBD] focus:ring-2 focus:ring-[#E9E3F8]";

export function ProfileSettingsView() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] =
    useState<ProfileForm>(initialProfile);

  const [savedProfile, setSavedProfile] =
    useState<ProfileForm>(initialProfile);

  const [photoUrl, setPhotoUrl] =
    useState<string | null>(null);

  const [feedback, setFeedback] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoUrl]);

  function updateField(
    field: keyof ProfileForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("The profile photo must be 2 MB or smaller.");
      return;
    }

    if (photoUrl) {
      URL.revokeObjectURL(photoUrl);
    }

    setPhotoUrl(URL.createObjectURL(file));
    setError(null);
  }

  function removePhoto() {
    if (photoUrl) {
      URL.revokeObjectURL(photoUrl);
    }

    setPhotoUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSave(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim()
    ) {
      setError(
        "First name, last name and email address are required.",
      );

      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim(),
      )
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    setSavedProfile(form);
    setError(null);
    setFeedback("Profile information saved successfully.");
  }

  function handleCancel() {
    setForm(savedProfile);
    setError(null);
  }

  const initials = `${form.firstName
    .charAt(0)
    .toUpperCase()}${form.lastName
    .charAt(0)
    .toUpperCase()}`;

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <SettingsToast
        message={feedback}
        onDismiss={() => setFeedback(null)}
      />

      <SettingsToast
        message={error}
        tone="error"
        onDismiss={() => setError(null)}
      />

      <div className="mx-auto max-w-[1240px]">
        <SettingsPageHeader
          title="Profile Information"
          description="Manage your personal and contact information."
        />

        <div className="mt-8 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <form
            onSubmit={handleSave}
            className="rounded-3xl bg-[#F8F7F6] p-4 sm:p-5"
          >
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wide text-[#292522]">
                Profile Information
              </h2>

              <p className="mt-1 text-sm text-[#746D68]">
                Update the information used across the carer
                portal.
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative shrink-0">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Selected profile preview"
                    className="h-32 w-32 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-32 w-32 items-center justify-center rounded-full bg-[#EEE9FB] text-3xl font-bold text-[#592EBD]">
                    {initials}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full border-4 border-[#F8F7F6] bg-white text-[#514B47] shadow-sm"
                  aria-label="Choose profile photo"
                >
                  <Camera size={18} />
                </button>
              </div>

              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                <div className="grid max-w-md gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#DDD8D4] bg-white px-6 text-sm font-semibold text-[#403B37] hover:border-[#592EBD] hover:text-[#592EBD]"
                  >
                    <ImagePlus size={17} />
                    Upload New Photo
                  </button>

                  <button
                    type="button"
                    onClick={removePhoto}
                    disabled={!photoUrl}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#DDD8D4] bg-white px-6 text-sm font-semibold text-[#403B37] hover:border-[#F23636] hover:text-[#F23636] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 size={17} />
                    Remove Photo
                  </button>
                </div>

                <p className="mt-3 text-xs text-[#817A75]">
                  JPG, PNG or WEBP. Maximum size 2 MB.
                </p>
              </div>
            </div>

            <div className="mt-7">
              <h2 className="font-semibold text-[#292522]">
                Personal Details
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="text-sm font-medium text-[#514B47]">
                    First name
                  </span>

                  <input
                    value={form.firstName}
                    onChange={(event) =>
                      updateField(
                        "firstName",
                        event.target.value,
                      )
                    }
                    className={cn("mt-2", inputClassName)}
                  />
                </label>

                <label>
                  <span className="text-sm font-medium text-[#514B47]">
                    Last name
                  </span>

                  <input
                    value={form.lastName}
                    onChange={(event) =>
                      updateField(
                        "lastName",
                        event.target.value,
                      )
                    }
                    className={cn("mt-2", inputClassName)}
                  />
                </label>

                <label>
                  <span className="text-sm font-medium text-[#514B47]">
                    Email address
                  </span>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value,
                      )
                    }
                    className={cn("mt-2", inputClassName)}
                  />
                </label>

                <label>
                  <span className="text-sm font-medium text-[#514B47]">
                    Phone number
                  </span>

                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      updateField(
                        "phone",
                        event.target.value,
                      )
                    }
                    className={cn("mt-2", inputClassName)}
                  />
                </label>

                <label>
                  <span className="text-sm font-medium text-[#514B47]">
                    Location
                  </span>

                  <input
                    value={form.location}
                    onChange={(event) =>
                      updateField(
                        "location",
                        event.target.value,
                      )
                    }
                    className={cn("mt-2", inputClassName)}
                  />
                </label>

                <label>
                  <span className="text-sm font-medium text-[#514B47]">
                    Preferred contact method
                  </span>

                  <select
                    value={form.preferredContact}
                    onChange={(event) =>
                      updateField(
                        "preferredContact",
                        event.target.value,
                      )
                    }
                    className={cn(
                      "mt-2 appearance-none",
                      inputClassName,
                    )}
                  >
                    <option value="EMAIL">Email</option>
                    <option value="PHONE">Phone</option>
                    <option value="SMS">SMS</option>
                  </select>
                </label>
              </div>

              <label className="mt-4 block">
                <span className="text-sm font-medium text-[#514B47]">
                  About your support role
                </span>

                <textarea
                  value={form.supportInformation}
                  onChange={(event) =>
                    updateField(
                      "supportInformation",
                      event.target.value,
                    )
                  }
                  rows={5}
                  maxLength={500}
                  className="mt-2 w-full resize-y rounded-xl border border-[#DEDAD6] bg-white px-4 py-4 text-sm leading-6 text-[#302C29] outline-none focus:border-[#592EBD] focus:ring-2 focus:ring-[#E9E3F8]"
                />

                <p className="mt-2 text-right text-xs text-[#817A75]">
                  {form.supportInformation.length}/500
                </p>
              </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex min-h-12 min-w-[165px] items-center justify-center rounded-full border border-[#DDD8D4] bg-white px-6 text-sm font-semibold text-[#403B37] hover:border-[#592EBD] hover:text-[#592EBD]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex min-h-12 min-w-[175px] items-center justify-center rounded-full bg-[#592EBD] px-6 text-sm font-semibold text-white hover:bg-[#4B24A8]"
              >
                Save Changes
              </button>
            </div>
          </form>

          <aside className="space-y-4 xl:sticky xl:top-[118px]">
            <section className="rounded-2xl border border-[#DEDAD6] bg-white p-5 shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF3FF] text-[#3478EA]">
                  <UserRound size={22} />
                </span>

                <h2 className="text-lg font-semibold text-[#292522]">
                  Profile Summary
                </h2>
              </div>

              <dl className="mt-6 space-y-5">
                <div>
                  <dt className="text-sm text-[#514B47]">
                    Member Since
                  </dt>

                  <dd className="mt-1 text-lg font-medium text-[#292522]">
                    23 May 2026
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-[#514B47]">
                    Email address
                  </dt>

                  <dd className="mt-1 break-all text-lg font-medium text-[#292522]">
                    {form.email}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-[#514B47]">
                    Role
                  </dt>

                  <dd className="mt-1 text-lg font-medium text-[#292522]">
                    Carer
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-[#514B47]">
                    Phone
                  </dt>

                  <dd className="mt-1 text-lg font-medium text-[#292522]">
                    {form.phone || "Not provided"}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-[#514B47]">
                    Location
                  </dt>

                  <dd className="mt-1 text-lg font-medium text-[#292522]">
                    {form.location || "Not provided"}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-2xl border border-[#DEDAD6] bg-white p-5 shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
              <div className="flex gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF3FF] text-[#3478EA]">
                  <LockKeyhole size={20} />
                </span>

                <div>
                  <h2 className="font-semibold text-[#292522]">
                    Your information is secure
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#746D68]">
                    Personal information should only be
                    used to support your authenticated
                    AI-DRA account.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 rounded-full border border-[#DDD8D4] px-4 py-3 text-sm font-medium text-[#403B37]">
                <CheckCircle2 size={17} />
                Account data protected
              </div>
            </section>

            <section className="rounded-2xl border border-[#DEDAD6] bg-white p-5 shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
              <div className="flex gap-3">
                <ShieldCheck
                  size={21}
                  className="mt-0.5 shrink-0 text-[#592EBD]"
                />

                <p className="text-sm leading-6 text-[#746D68]">
                  Profile changes are currently stored only
                  in frontend state. Supabase persistence
                  will be connected later.
                </p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AddCarerStepProps = {
  onComplete: () => void;
};

export function AddCarerStep({
  onComplete,
}: AddCarerStepProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddCaregiver = async () => {
    if (isSaving || isSkipping) return;

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanRelationship = relationship.trim();

    if (!cleanFirstName || !cleanLastName) {
      setErrorMessage(
        "Enter the caregiver's first name and last name."
      );
      return;
    }

    if (!cleanEmail && !cleanPhone) {
      setErrorMessage(
        "Enter the caregiver's email address or phone number."
      );
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "COMPLETE",
          caregiver: {
            firstName: cleanFirstName,
            lastName: cleanLastName,
            email: cleanEmail || undefined,
            phone: cleanPhone || undefined,
            relationship: cleanRelationship || undefined,
          },
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to save caregiver details."
        );
      }

      onComplete();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to save caregiver details."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = async () => {
    if (isSaving || isSkipping) return;

    setIsSkipping(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "SKIP",
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to skip onboarding."
        );
      }

      onComplete();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to skip onboarding."
      );
    } finally {
      setIsSkipping(false);
    }
  };

  return (
    <div>
      <h1 className="text-[40px] font-bold text-[#010E0E]">
        Add a Caregiver
      </h1>

      <p className="mt-3 max-w-[420px] text-[16px] leading-[150%] text-[#757575]">
        You can add a family member or caregiver to receive updates about
        your progress.
      </p>

      <div className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="caregiver-first-name"
              className="text-sm"
            >
              Caregiver First name
            </label>

            <Input
              id="caregiver-first-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              disabled={isSaving || isSkipping}
              className="mt-2 h-16 rounded-xl"
              placeholder="Enter caregiver first name"
            />
          </div>

          <div>
            <label
              htmlFor="caregiver-last-name"
              className="text-sm"
            >
              Caregiver Last name
            </label>

            <Input
              id="caregiver-last-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              disabled={isSaving || isSkipping}
              className="mt-2 h-16 rounded-xl"
              placeholder="Enter caregiver last name"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="caregiver-email"
            className="text-sm"
          >
            Email Address
          </label>

          <Input
            id="caregiver-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSaving || isSkipping}
            className="mt-2 h-16 rounded-xl"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label
            htmlFor="caregiver-phone"
            className="text-sm"
          >
            Phone Number
          </label>

          <Input
            id="caregiver-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            disabled={isSaving || isSkipping}
            className="mt-2 h-16 rounded-xl"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label
            htmlFor="caregiver-relationship"
            className="text-sm"
          >
            Relationship
          </label>

          <Input
            id="caregiver-relationship"
            value={relationship}
            onChange={(event) => setRelationship(event.target.value)}
            disabled={isSaving || isSkipping}
            className="mt-2 h-16 rounded-xl"
            placeholder="For example, daughter, spouse or friend"
          />
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 text-[14px] text-[#757575]">
        <Info
          size={18}
          className="fill-[#9E9E9E] text-white"
        />
        Enter either an email address or phone number. You can also do this
        later.
      </p>

      {errorMessage && (
        <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <Button
        type="button"
        onClick={handleAddCaregiver}
        disabled={isSaving || isSkipping}
        className="mt-10 h-16 w-full rounded-full bg-[#592EBD] text-[16px] hover:bg-[#4B24A8] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Saving Caregiver..." : "Add Caregiver"}
      </Button>

      <button
        type="button"
        onClick={handleSkip}
        disabled={isSaving || isSkipping}
        className="mt-6 w-full text-center text-[16px] text-[#1E1E1E] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSkipping ? "Skipping..." : "Skip for Now"}
      </button>
    </div>
  );
}
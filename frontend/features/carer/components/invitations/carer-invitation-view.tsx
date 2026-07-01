"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  useEffect,
  useState,
} from "react";
import {
  Check,
  ChevronDown,
  ExternalLink,
  Info,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  getInvitationDraft,
  saveInvitationDraft,
} from "@/features/carer/data/carer-invitation-storage";
import { cn } from "@/lib/utils";

type Relationship =
  | ""
  | "PARENT"
  | "SPOUSE_PARTNER"
  | "CHILD"
  | "SIBLING"
  | "RELATIVE"
  | "FAMILY_FRIEND"
  | "FRIEND"
  | "PROFESSIONAL_CARER"
  | "OTHER";

type InvitationForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: Relationship;
  customRelationship: string;
  message: string;
};

type FormErrors = Partial<
  Record<keyof InvitationForm, string>
>;

const initialForm: InvitationForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  relationship: "",
  customRelationship: "",
  message: "",
};

const relationshipOptions: Array<{
  value: Relationship;
  label: string;
}> = [
  {
    value: "",
    label: "Select relationship to survivor",
  },
  {
    value: "PARENT",
    label: "Parent",
  },
  {
    value: "SPOUSE_PARTNER",
    label: "Spouse or Partner",
  },
  {
    value: "CHILD",
    label: "Child",
  },
  {
    value: "SIBLING",
    label: "Sibling",
  },
  {
    value: "RELATIVE",
    label: "Other Relative",
  },
  {
    value: "FAMILY_FRIEND",
    label: "Family Friend",
  },
  {
    value: "FRIEND",
    label: "Friend",
  },
  {
    value: "PROFESSIONAL_CARER",
    label: "Professional Carer",
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

const inputClassName =
  "h-14 w-full rounded-xl border border-[#DEDAD6] bg-white px-4 text-sm text-[#302C29] outline-none transition placeholder:text-[#A09A96] focus:border-[#592EBD] focus:ring-2 focus:ring-[#E9E3F8]";

function FieldError({
  message,
}: {
  message?: string;
}) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-1.5 text-xs font-medium text-[#D33B3B]">
      {message}
    </p>
  );
}

function ProgressSteps() {
  const steps = [
    "Enter Details",
    "Send Invitation",
    "Pending Acceptance",
  ];

  return (
    <section className="rounded-2xl border border-[#DEDAD6] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-0">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const active = stepNumber === 1;

          return (
            <div
              key={step}
              className="relative flex items-center gap-3 sm:pr-4"
            >
              <span
                className={cn(
                  "relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  active
                    ? "bg-[#592EBD] text-white"
                    : "bg-[#F1F0EF] text-[#403B37]",
                )}
              >
                {stepNumber}
              </span>

              <span
                className={cn(
                  "relative z-10 bg-white pr-3 text-sm font-semibold",
                  active
                    ? "text-[#592EBD]"
                    : "text-[#292522]",
                )}
              >
                {step}
              </span>

              {index < steps.length - 1 ? (
                <span className="absolute left-11 right-0 top-1/2 hidden h-px bg-[#E8E4E0] sm:block" />
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function BenefitsCard() {
  const benefits = [
    "Track their rehabilitation progress",
    "View their exercises and activities",
    "Share encouragement and support",
    "Stay connected during their recovery journey",
  ];

  return (
    <section className="rounded-2xl border border-[#DEDAD6] bg-white p-4 shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3FF] text-[#3478EA]">
          <UserRound size={20} />
        </span>

        <h2 className="text-lg font-semibold text-[#292522]">
          Benefits of Linking
        </h2>
      </div>

      <div className="mt-5 space-y-4">
        {benefits.map((benefit) => (
          <div
            key={benefit}
            className="flex items-start gap-3"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2DB36F] text-white">
              <Check
                size={13}
                strokeWidth={3}
              />
            </span>

            <p className="text-sm leading-5 text-[#746D68]">
              {benefit}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ImportantInformationCard() {
  const information = [
    {
      title: "Invitation required",
      description:
        "The survivor must accept your invitation before their account is linked.",
    },
    {
      title: "They stay in control",
      description:
        "The survivor can remove caregiver access at any time.",
    },
    {
      title: "Secure and private",
      description:
        "Rehabilitation information is shared only after acceptance.",
    },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-[#DEDAD6] bg-white shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
      <div className="flex items-center gap-3 border-b border-[#EEEAE6] px-4 py-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3FF] text-[#3478EA]">
          <ShieldCheck size={20} />
        </span>

        <h2 className="text-lg font-semibold text-[#292522]">
          Important to know
        </h2>
      </div>

      <div className="divide-y divide-[#ECE8E4] px-4">
        {information.map((item) => (
          <article
            key={item.title}
            className="flex gap-3 py-4"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F2F1F0] text-[#746D68]">
              <Info size={17} />
            </span>

            <div>
              <h3 className="text-sm font-semibold text-[#292522]">
                {item.title}
              </h3>

              <p className="mt-1 text-sm leading-5 text-[#746D68]">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function InvitationHelpCard() {
  return (
    <section className="rounded-2xl border border-[#DEDAD6] bg-white p-4 shadow-[0_1px_4px_rgba(28,23,20,0.04)]">
      <div className="flex gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF3FF] text-[#3478EA]">
          <Info size={20} />
        </span>

        <div className="min-w-0">
          <h2 className="font-semibold text-[#292522]">
            Invitation Help
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#746D68]">
            Learn more about inviting and linking
            survivors securely.
          </p>

          <button
            type="button"
            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#592EBD] hover:underline"
          >
            View Guide
            <ExternalLink size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}

export function CarerInvitationView() {
  const router = useRouter();

  const [form, setForm] =
    useState<InvitationForm>(initialForm);

  const [errors, setErrors] =
    useState<FormErrors>({});

  useEffect(() => {
    const savedDraft = getInvitationDraft();

    if (!savedDraft) {
      return;
    }

    setForm({
      firstName: savedDraft.firstName,
      lastName: savedDraft.lastName,
      email: savedDraft.email,
      phone: savedDraft.phone,
      relationship:
        savedDraft.relationship as Relationship,
      customRelationship:
        savedDraft.customRelationship,
      message: savedDraft.message,
    });
  }, []);

  function updateField<
    Key extends keyof InvitationForm,
  >(
    field: Key,
    value: InvitationForm[Key],
  ) {
    setForm((current) => {
      const updatedForm = {
        ...current,
        [field]: value,
      };

      if (
        field === "relationship" &&
        value !== "OTHER"
      ) {
        updatedForm.customRelationship = "";
      }

      return updatedForm;
    });

    setErrors((current) => ({
      ...current,
      [field]: undefined,
      ...(field === "relationship"
        ? {
            customRelationship: undefined,
          }
        : {}),
    }));
  }

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!form.firstName.trim()) {
      nextErrors.firstName =
        "Please enter the survivor’s first name.";
    }

    if (!form.lastName.trim()) {
      nextErrors.lastName =
        "Please enter the survivor’s last name.";
    }

    if (!form.email.trim()) {
      nextErrors.email =
        "Please enter the survivor’s email address.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim(),
      )
    ) {
      nextErrors.email =
        "Please enter a valid email address.";
    }

    if (!form.relationship) {
      nextErrors.relationship =
        "Please select your relationship to the survivor.";
    }

    if (
      form.relationship === "OTHER" &&
      !form.customRelationship.trim()
    ) {
      nextErrors.customRelationship =
        "Please specify your relationship.";
    }

    if (form.message.length > 200) {
      nextErrors.message =
        "The personal message cannot exceed 200 characters.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    saveInvitationDraft({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      relationship: form.relationship,
      customRelationship:
        form.customRelationship.trim(),
      message: form.message.trim(),
    });

    router.push("/carer/invitations/send");
  }

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-[-0.02em] text-[#211E1C]">
              Invite / Link Survivor
            </h1>

            <p className="mt-1 max-w-xl text-base leading-6 text-[#5F5955]">
              Invite a survivor to link their account
              with you so you can support their
              rehabilitation journey.
            </p>
          </div>

          <Link
            href="/carer/invitations/manage"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#592EBD] px-8 text-sm font-semibold text-white transition hover:bg-[#4B24A8]"
          >
            Manage Linked Survivor(s)
          </Link>
        </div>

        <div className="mt-5 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-4">
            <ProgressSteps />

            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl border border-[#DEDAD6] bg-white p-4 shadow-[0_1px_4px_rgba(28,23,20,0.04)] sm:p-5"
            >
              <h2 className="text-lg font-semibold text-[#292522]">
                Survivor Information
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#746D68]">
                Enter the survivor’s details to prepare
                their invitation. They must accept before
                their account is linked.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-[#514B47]">
                    First name
                  </span>

                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(event) =>
                      updateField(
                        "firstName",
                        event.target.value,
                      )
                    }
                    placeholder="Enter first name"
                    autoComplete="given-name"
                    aria-invalid={Boolean(
                      errors.firstName,
                    )}
                    className={cn(
                      "mt-2",
                      inputClassName,
                      errors.firstName &&
                        "border-[#F23636] focus:border-[#F23636] focus:ring-[#FFE1E1]",
                    )}
                  />

                  <FieldError
                    message={errors.firstName}
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-[#514B47]">
                    Last name
                  </span>

                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(event) =>
                      updateField(
                        "lastName",
                        event.target.value,
                      )
                    }
                    placeholder="Enter last name"
                    autoComplete="family-name"
                    aria-invalid={Boolean(
                      errors.lastName,
                    )}
                    className={cn(
                      "mt-2",
                      inputClassName,
                      errors.lastName &&
                        "border-[#F23636] focus:border-[#F23636] focus:ring-[#FFE1E1]",
                    )}
                  />

                  <FieldError
                    message={errors.lastName}
                  />
                </label>

                <label className="block">
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
                    placeholder="Enter email address"
                    autoComplete="email"
                    aria-invalid={Boolean(
                      errors.email,
                    )}
                    className={cn(
                      "mt-2",
                      inputClassName,
                      errors.email &&
                        "border-[#F23636] focus:border-[#F23636] focus:ring-[#FFE1E1]",
                    )}
                  />

                  <FieldError
                    message={errors.email}
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-[#514B47]">
                    Phone number{" "}
                    <span className="font-normal text-[#817A75]">
                      (Optional)
                    </span>
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
                    placeholder="+44 Enter phone number"
                    autoComplete="tel"
                    className={cn(
                      "mt-2",
                      inputClassName,
                    )}
                  />
                </label>
              </div>

              <label className="mt-4 block">
                <span className="text-sm font-medium text-[#514B47]">
                  Relationship to survivor
                </span>

                <span className="relative mt-2 block">
                  <select
                    value={form.relationship}
                    onChange={(event) =>
                      updateField(
                        "relationship",
                        event.target
                          .value as Relationship,
                      )
                    }
                    aria-invalid={Boolean(
                      errors.relationship,
                    )}
                    className={cn(
                      inputClassName,
                      "appearance-none pr-12",
                      errors.relationship &&
                        "border-[#F23636] focus:border-[#F23636] focus:ring-[#FFE1E1]",
                    )}
                  >
                    {relationshipOptions.map(
                      (option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ),
                    )}
                  </select>

                  <ChevronDown
                    size={19}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#403B37]"
                  />
                </span>

                <FieldError
                  message={errors.relationship}
                />
              </label>

              {form.relationship === "OTHER" ? (
                <label className="mt-4 block">
                  <span className="text-sm font-medium text-[#514B47]">
                    Please specify the relationship
                  </span>

                  <input
                    type="text"
                    value={form.customRelationship}
                    onChange={(event) =>
                      updateField(
                        "customRelationship",
                        event.target.value,
                      )
                    }
                    placeholder="For example, neighbour, church member or family friend"
                    aria-invalid={Boolean(
                      errors.customRelationship,
                    )}
                    className={cn(
                      "mt-2",
                      inputClassName,
                      errors.customRelationship &&
                        "border-[#F23636] focus:border-[#F23636] focus:ring-[#FFE1E1]",
                    )}
                  />

                  <FieldError
                    message={
                      errors.customRelationship
                    }
                  />
                </label>
              ) : null}

              <label className="mt-4 block">
                <span className="text-sm font-medium text-[#514B47]">
                  Add a personal message{" "}
                  <span className="font-normal text-[#817A75]">
                    (Optional)
                  </span>
                </span>

                <textarea
                  value={form.message}
                  onChange={(event) =>
                    updateField(
                      "message",
                      event.target.value,
                    )
                  }
                  placeholder="Write a message..."
                  rows={5}
                  maxLength={200}
                  className={cn(
                    "mt-2 w-full resize-y rounded-xl border border-[#DEDAD6] bg-white px-4 py-4 text-sm leading-6 text-[#302C29] outline-none transition placeholder:text-[#A09A96] focus:border-[#592EBD] focus:ring-2 focus:ring-[#E9E3F8]",
                    errors.message &&
                      "border-[#F23636]",
                  )}
                />

                <div className="mt-2 flex items-start justify-between gap-4">
                  <p className="flex items-start gap-2 text-xs leading-5 text-[#817A75]">
                    <Info
                      size={15}
                      className="mt-0.5 shrink-0"
                    />

                    Add a short message explaining why
                    you are inviting them.
                  </p>

                  <span className="shrink-0 text-xs font-medium text-[#514B47]">
                    {form.message.length}/200
                  </span>
                </div>

                <FieldError
                  message={errors.message}
                />
              </label>

              <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Link
                  href="/carer/survivors"
                  className="inline-flex min-h-12 min-w-[170px] items-center justify-center rounded-full border border-[#DDD8D4] px-6 text-sm font-semibold text-[#403B37] transition hover:border-[#592EBD] hover:text-[#592EBD]"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="inline-flex min-h-12 min-w-[180px] items-center justify-center gap-2 rounded-full bg-[#592EBD] px-6 text-sm font-semibold text-white transition hover:bg-[#4B24A8]"
                >
                  <Send size={17} />
                  Continue
                </button>
              </div>
            </form>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-[118px]">
            <BenefitsCard />
            <ImportantInformationCard />
            <InvitationHelpCard />
          </aside>
        </div>
      </div>
    </section>
  );
}
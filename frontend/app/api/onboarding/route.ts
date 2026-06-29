import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type OnboardingAction = "COMPLETE" | "SKIP";

type CompleteOnboardingRequest = {
  action: OnboardingAction;
  caregiver?: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    relationship?: string;
  };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CompleteOnboardingRequest;

    if (body.action !== "COMPLETE" && body.action !== "SKIP") {
      return NextResponse.json(
        { error: "Invalid onboarding action." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must be signed in to complete onboarding." },
        { status: 401 }
      );
    }

    if (body.action === "SKIP") {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          onboarding_completed: false,
          onboarding_skipped: true,
          onboarding_completed_at: null,
        })
        .eq("id", user.id);

      if (profileError) {
        console.error("Failed to skip onboarding:", profileError);

        return NextResponse.json(
          { error: "Unable to skip onboarding." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        onboardingStatus: "SKIPPED",
      });
    }

    const caregiver = body.caregiver;

    if (!caregiver) {
      return NextResponse.json(
        { error: "Caregiver details are required." },
        { status: 400 }
      );
    }

    const firstName = caregiver.firstName.trim();
    const lastName = caregiver.lastName.trim();
    const email = caregiver.email?.trim().toLowerCase() || null;
    const phone = caregiver.phone?.trim() || null;
    const relationship = caregiver.relationship?.trim() || null;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "Caregiver first name and last name are required." },
        { status: 400 }
      );
    }

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Enter a caregiver email address or phone number." },
        { status: 400 }
      );
    }

    const fullName = `${firstName} ${lastName}`.trim();

    const { data: existingContact, error: existingContactError } =
      await supabase
        .from("survivor_caregiver_contacts")
        .select("id")
        .eq("survivor_id", user.id)
        .eq("is_primary", true)
        .maybeSingle();

    if (existingContactError) {
      console.error(
        "Failed to check existing caregiver contact:",
        existingContactError
      );

      return NextResponse.json(
        { error: "Unable to save caregiver details." },
        { status: 500 }
      );
    }

    if (existingContact) {
      const { error: updateContactError } = await supabase
        .from("survivor_caregiver_contacts")
        .update({
          full_name: fullName,
          relationship,
          email,
          phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingContact.id);

      if (updateContactError) {
        console.error(
          "Failed to update caregiver contact:",
          updateContactError
        );

        return NextResponse.json(
          { error: "Unable to update caregiver details." },
          { status: 500 }
        );
      }
    } else {
      const { error: insertContactError } = await supabase
        .from("survivor_caregiver_contacts")
        .insert({
          survivor_id: user.id,
          full_name: fullName,
          relationship,
          email,
          phone,
          is_primary: true,
          invitation_status: "NOT_INVITED",
        });

      if (insertContactError) {
        console.error(
          "Failed to create caregiver contact:",
          insertContactError
        );

        return NextResponse.json(
          { error: "Unable to save caregiver details." },
          { status: 500 }
        );
      }
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        onboarding_completed: true,
        onboarding_skipped: false,
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (profileError) {
      console.error(
        "Caregiver saved but onboarding update failed:",
        profileError
      );

      return NextResponse.json(
        {
          error:
            "Caregiver details were saved, but onboarding could not be completed.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      onboardingStatus: "COMPLETED",
    });
  } catch (error) {
    console.error("Unexpected onboarding error:", error);

    return NextResponse.json(
      { error: "Invalid onboarding request." },
      { status: 400 }
    );
  }
}
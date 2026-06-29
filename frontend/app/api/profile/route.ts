import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type UpdateProfileRequest = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  dateOfBirth?: string | null;
};

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 }
      );
    }

    const [
      profileResult,
      caregiverResult,
      sessionsResult,
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select(
          `
            id,
            role,
            first_name,
            last_name,
            display_name,
            phone,
            avatar_path,
            affected_side,
            date_of_birth,
            created_at,
            onboarding_completed,
            onboarding_skipped
          `
        )
        .eq("id", user.id)
        .single(),

      supabase
        .from("survivor_caregiver_contacts")
        .select(
          `
            full_name,
            phone,
            email,
            relationship
          `
        )
        .eq("survivor_id", user.id)
        .eq("is_primary", true)
        .maybeSingle(),

      supabase
        .from("exercise_sessions")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("survivor_id", user.id)
        .eq("status", "COMPLETED"),
    ]);

    if (
      profileResult.error ||
      !profileResult.data
    ) {
      console.error(
        "Failed to load profile:",
        profileResult.error
      );

      return NextResponse.json(
        { error: "Profile not found." },
        { status: 404 }
      );
    }

    let avatarUrl: string | null = null;

    if (profileResult.data.avatar_path) {
      const { data: signedUrlData } =
        await supabase.storage
          .from("avatars")
          .createSignedUrl(
            profileResult.data.avatar_path,
            60 * 60
          );

      avatarUrl =
        signedUrlData?.signedUrl ?? null;
    }

    return NextResponse.json({
      profile: {
        ...profileResult.data,
        email: user.email ?? null,
        avatar_url: avatarUrl,

        emergency_contact:
          caregiverResult.data
            ? {
                full_name:
                  caregiverResult.data.full_name,
                phone:
                  caregiverResult.data.phone,
                email:
                  caregiverResult.data.email,
                relationship:
                  caregiverResult.data.relationship,
              }
            : null,

        rehabilitation_level:
          "Not Assessed Yet",

        weekly_goal_minutes: null,

        sessions_completed:
          sessionsResult.count ?? 0,
      },
    });
  } catch (error) {
    console.error(
      "Unexpected profile error:",
      error
    );

    return NextResponse.json(
      { error: "Unable to load profile." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body =
      (await request.json()) as UpdateProfileRequest;

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 }
      );
    }

    const firstName =
      body.firstName?.trim() ?? "";

    const lastName =
      body.lastName?.trim() ?? "";

    const cleanEmail =
      body.email?.trim().toLowerCase() ?? "";

    const phone =
      body.phone?.trim() || null;

    const dateOfBirth =
      body.dateOfBirth?.trim() || null;

    if (!firstName || !lastName) {
      return NextResponse.json(
        {
          error:
            "First name and last name are required.",
        },
        { status: 400 }
      );
    }

    if (!cleanEmail) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const displayName =
      `${firstName} ${lastName}`.trim();

    const { error: profileError } =
      await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          display_name: displayName,
          phone,
          date_of_birth: dateOfBirth,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (profileError) {
      console.error(
        "Failed to update profile:",
        profileError
      );

      return NextResponse.json(
        { error: "Unable to update profile." },
        { status: 500 }
      );
    }

    let emailConfirmationRequired = false;

    if (
      cleanEmail !==
      user.email?.toLowerCase()
    ) {
      const { error: emailError } =
        await supabase.auth.updateUser({
          email: cleanEmail,
        });

      if (emailError) {
        return NextResponse.json(
          {
            error:
              "Profile details were updated, but the email address could not be changed.",
          },
          { status: 400 }
        );
      }

      emailConfirmationRequired = true;
    }

    return NextResponse.json({
      success: true,
      emailConfirmationRequired,
    });
  } catch (error) {
    console.error(
      "Unexpected profile update error:",
      error
    );

    return NextResponse.json(
      { error: "Invalid profile request." },
      { status: 400 }
    );
  }
}
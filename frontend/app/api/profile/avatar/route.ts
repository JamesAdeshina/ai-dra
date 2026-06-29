import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const maxFileSize = 5 * 1024 * 1024;

export async function POST(request: Request) {
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

    const formData =
      await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Select an image to upload." },
        { status: 400 }
      );
    }

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json(
        {
          error:
            "Use a JPEG, PNG or WebP image.",
        },
        { status: 400 }
      );
    }

    if (file.size > maxFileSize) {
      return NextResponse.json(
        {
          error:
            "Profile pictures must be 5 MB or smaller.",
        },
        { status: 400 }
      );
    }

    const avatarPath =
      `${user.id}/profile`;

    const { error: uploadError } =
      await supabase.storage
        .from("avatars")
        .upload(avatarPath, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: "3600",
        });

    if (uploadError) {
      console.error(
        "Avatar upload failed:",
        uploadError
      );

      return NextResponse.json(
        {
          error:
            "Unable to upload profile picture.",
        },
        { status: 500 }
      );
    }

    const { error: profileError } =
      await supabase
        .from("profiles")
        .update({
          avatar_path: avatarPath,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (profileError) {
      return NextResponse.json(
        {
          error:
            "Image uploaded, but profile could not be updated.",
        },
        { status: 500 }
      );
    }

    const { data: signedUrlData } =
      await supabase.storage
        .from("avatars")
        .createSignedUrl(
          avatarPath,
          60 * 60
        );

    return NextResponse.json({
      success: true,
      avatarUrl:
        signedUrlData?.signedUrl ?? null,
    });
  } catch (error) {
    console.error(
      "Unexpected avatar upload error:",
      error
    );

    return NextResponse.json(
      { error: "Unable to upload image." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
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

    const { data: profile } =
      await supabase
        .from("profiles")
        .select("avatar_path")
        .eq("id", user.id)
        .single();

    if (profile?.avatar_path) {
      const { error: removeError } =
        await supabase.storage
          .from("avatars")
          .remove([profile.avatar_path]);

      if (removeError) {
        console.error(
          "Avatar removal failed:",
          removeError
        );
      }
    }

    const { error: profileError } =
      await supabase
        .from("profiles")
        .update({
          avatar_path: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (profileError) {
      return NextResponse.json(
        {
          error:
            "Unable to remove profile picture.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Unexpected avatar removal error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to remove profile picture.",
      },
      { status: 500 }
    );
  }
}
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/?error=missing_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] session exchange failed:", error.message);
    return NextResponse.redirect(`${origin}/?error=auth_failed`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/?error=no_user`);
  }

  // profiles 테이블에 신규 유저 등록 (중복이면 무시)
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (!existingProfile) {
    const rawNickname =
      (user.user_metadata?.name as string | undefined) ??
      (user.user_metadata?.full_name as string | undefined) ??
      "user";

    const username = await generateUniqueUsername(supabase, rawNickname);

    await supabase.from("profiles").insert({
      id: user.id,
      username,
      display_name: rawNickname,
      answers: {},
      is_published: false,
    });
  }

  return NextResponse.redirect(`${origin}/edit`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function generateUniqueUsername(supabase: any, raw: string): Promise<string> {
  const base = raw
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w가-힣-]/g, "")
    .slice(0, 28);

  let candidate = base;
  let suffix = 2;

  while (true) {
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", candidate)
      .maybeSingle();

    if (!data) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { type QuestionKey } from "@/lib/questions";

export type FormData = {
  displayName: string;
  tagline: string;
  answers: Record<QuestionKey, string>;
};

export async function saveProfile(formData: FormData): Promise<{ redirectTo: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { redirectTo: "/" };

  const { data, error } = await supabase
    .from("profiles")
    .update({
      display_name: formData.displayName,
      tagline: formData.tagline,
      answers: formData.answers,
      is_published: true,
    })
    .eq("id", user.id)
    .select("username")
    .single();

  if (error || !data) throw new Error(error?.message ?? "저장 실패");

  return { redirectTo: `/share/${data.username}` };
}

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

  const { data: existing } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (!existing) return { redirectTo: "/" };

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: formData.displayName,
      tagline: formData.tagline,
      answers: formData.answers,
      is_published: true,
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);

  return { redirectTo: `/share/${existing.username}` };
}

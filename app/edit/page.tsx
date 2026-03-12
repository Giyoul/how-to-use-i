import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileEditor } from "@/components/edit/ProfileEditor";
import type { Profile } from "@/lib/supabase/types";

export default async function EditPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = data as Profile | null;

  return (
    <main
      className="flex flex-col min-h-screen"
      style={{ maxWidth: 402, margin: "0 auto", background: "#F5F4F1" }}
    >
      {/* Status Bar */}
      <div
        className="flex items-center px-6"
        style={{ height: 62 }}
      >
        <span className="text-[#1A1918] font-semibold" style={{ fontSize: 15 }}>
          9:41
        </span>
      </div>

      {/* Content */}
      <div
        className="flex flex-col gap-4 flex-1"
        style={{ padding: "4px 24px 40px" }}
      >
        <div className="flex items-center">
          <h1
            className="text-[#1A1918] font-semibold"
            style={{ fontSize: 22, letterSpacing: -0.3 }}
          >
            나의 사용법
          </h1>
        </div>

        <p className="text-[#6D6C6A]" style={{ fontSize: 13 }}>
          한 질문씩 차근차근 나를 소개해봐요
        </p>

        <ProfileEditor initialData={profile} />
      </div>
    </main>
  );
}

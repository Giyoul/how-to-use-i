import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProfileHeader } from "@/components/share/ProfileHeader";
import { AnswerItem } from "@/components/share/AnswerItem";
import { ShareButton } from "@/components/share/ShareButton";
import { QUESTIONS } from "@/lib/questions";
import type { Profile } from "@/lib/supabase/types";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username: rawUsername } = await params;
  const username = decodeURIComponent(rawUsername);
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("display_name, tagline")
    .eq("username", username)
    .single();

  if (!data) return { title: "나의 사용법" };

  return {
    title: `${data.display_name}의 사용법`,
    description: data.tagline ?? "나를 이해하는 8가지 이야기",
    openGraph: {
      title: `${data.display_name}의 사용법`,
      description: data.tagline ?? "나를 이해하는 8가지 이야기",
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { username: rawUsername } = await params;
  const username = decodeURIComponent(rawUsername);
  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!data) notFound();

  const profile = data as Profile;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F5F4F1" }}>
      {/* Scrollable content */}
      <div className="flex flex-col gap-4 flex-1 w-full max-w-[800px] mx-auto px-6 py-6 md:py-10">
        {/* Nav header */}
        <div className="flex items-center justify-center">
          <span className="text-[#1A1918] font-semibold" style={{ fontSize: 18 }}>
            나의 사용법
          </span>
        </div>

        <ProfileHeader
          displayName={profile.display_name}
          tagline={profile.tagline}
        />

        <span className="text-[#9C9B99] font-semibold" style={{ fontSize: 12 }}>
          나의 이야기
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {QUESTIONS.map((q, i) => {
            const answer = profile.answers[q.key];
            if (!answer) return null;
            return (
              <AnswerItem
                key={q.key}
                questionNumber={i + 1}
                questionText={q.text}
                answer={answer}
              />
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="flex flex-col items-center gap-2"
          style={{
            background: "#EDECEA",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <span className="text-[#6D6C6A] font-semibold" style={{ fontSize: 14 }}>
            나의 사용법
          </span>
          <span className="text-[#9C9B99]" style={{ fontSize: 12 }}>
            howToUseI.com/share/{username}
          </span>
        </div>
      </div>

      {/* Sticky Share Bar */}
      <div className="sticky bottom-0">
        <div className="max-w-[800px] mx-auto w-full">
          <ShareButton username={username} />
        </div>
      </div>
    </div>
  );
}

export const revalidate = 60;

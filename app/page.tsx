import Image from "next/image";
import { KakaoLoginButton } from "@/components/auth/KakaoLoginButton";
import { Sprout } from "lucide-react";

export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen flex-col" style={{ maxWidth: 402, margin: "0 auto" }}>
      {/* Hero */}
      <section
        className="flex flex-col items-center justify-center gap-6 px-10 pb-6"
        style={{
          height: 530,
          background: "linear-gradient(180deg, #B8E8C6 0%, #E4F4EB 60%, #F5F4F1 100%)",
        }}
      >
        <div
          className="relative overflow-hidden rounded-full"
          style={{ width: 168, height: 168 }}
        >
          <Image
            src="/images/generated-1773235979771.png"
            alt="나의 사용법"
            fill
            className="object-cover"
            priority
          />
        </div>

        <h1
          className="text-[#1A1918] font-bold tracking-tight"
          style={{ fontSize: 34, letterSpacing: -0.8 }}
        >
          나의 사용법
        </h1>

        <div className="flex items-center gap-1.5">
          <Sprout size={15} color="#3D8A5A" />
          <span className="text-[#6D6C6A] text-sm">나를 이해하는 8가지 이야기</span>
        </div>
      </section>

      {/* Login Card */}
      <section
        className="flex flex-1 flex-col gap-4 px-7 pt-8 pb-12 bg-white"
        style={{ borderRadius: "24px 24px 0 0" }}
      >
        <h2
          className="text-[#1A1918] font-bold"
          style={{ fontSize: 24, letterSpacing: -0.3 }}
        >
          나답게 소개해봐요
        </h2>
        <p className="text-[#6D6C6A] text-sm leading-relaxed">
          8가지 질문에 답하면
          <br />
          나만의 사용법이 완성돼요
        </p>

        <div className="flex-1" />

        <KakaoLoginButton />

        <p className="text-[#9C9B99] text-[11px] leading-relaxed text-center">
          시작하면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다
        </p>
      </section>
    </main>
  );
}

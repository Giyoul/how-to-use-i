import Image from "next/image";
import { KakaoLoginButton } from "@/components/auth/KakaoLoginButton";
import { Sprout } from "lucide-react";

export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen flex-col md:flex-row md:items-stretch">
      {/* Hero */}
      <section
        className="flex flex-col items-center justify-center gap-6 px-10 pb-6 md:flex-1 md:pb-0 md:justify-center md:gap-8"
        style={{
          minHeight: 530,
          background: "linear-gradient(180deg, #B8E8C6 0%, #E4F4EB 60%, #F5F4F1 100%)",
        }}
      >
        <div
          className="relative overflow-hidden rounded-full"
          style={{ width: 168, height: 168 }}
        >
          <Image
            src="/images/generated-1773235979771.png"
            alt="나 사용법"
            fill
            className="object-cover"
            priority
          />
        </div>

        <h1
          className="text-[#1A1918] font-bold tracking-tight"
          style={{ fontSize: 34, letterSpacing: -0.8 }}
        >
          나 사용법
        </h1>

        <div className="flex items-center gap-1.5">
          <Sprout size={15} color="#3D8A5A" />
          <span className="text-[#6D6C6A] text-sm">나를 이해하는 8가지 이야기</span>
        </div>
      </section>

      {/* Login Card */}
      <section
        className="relative flex flex-col gap-4 px-7 pt-8 pb-12 bg-white md:w-[440px] md:justify-center md:py-16 md:px-12"
        style={{ borderRadius: "24px 24px 0 0" }}
      >
        {/* Made by */}
        <div className="absolute top-6 right-6 flex flex-col items-end gap-1">
          <a
            href="https://github.com/Giyoul"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9C9B99] underline underline-offset-2"
            style={{ fontSize: 11 }}
          >
            made by 영기
          </a>
          <a
            href="https://github.com/Giyoul/how-to-use-i#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9C9B99] underline underline-offset-2"
            style={{ fontSize: 11 }}
          >
            README
          </a>
        </div>

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

        <div className="flex-1 md:hidden" />
        <div className="md:mt-8" />

        <KakaoLoginButton />

        <p className="text-[#9C9B99] text-[11px] leading-relaxed text-center">
          시작하면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다
        </p>
      </section>
    </main>
  );
}

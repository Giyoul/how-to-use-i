import { QuestionBadge } from "./QuestionBadge";

type Props = {
  displayName: string;
  tagline: string;
  onChange: (field: "displayName" | "tagline", value: string) => void;
};

export function StepIntro({ displayName, tagline, onChange }: Props) {
  return (
    <div
      className="w-full bg-white flex flex-col gap-4"
      style={{
        borderRadius: 20,
        padding: "22px 20px",
        boxShadow: "0 2px 16px #1A191808",
      }}
    >
      <div className="flex items-center gap-3">
        <QuestionBadge number={1} size="lg" />
        <span
          className="text-[#1A1918] font-semibold leading-snug"
          style={{ fontSize: 18 }}
        >
          나를 소개해요
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[#9C9B99] font-semibold" style={{ fontSize: 11 }}>
          이름
        </label>
        <div
          className="flex items-center w-full"
          style={{
            height: 48,
            background: "#F5F4F1",
            borderRadius: 10,
            border: "1px solid #D1D0CD",
            padding: "0 14px",
          }}
        >
          <input
            type="text"
            value={displayName}
            onChange={(e) => onChange("displayName", e.target.value)}
            placeholder="내 이름을 입력해주세요"
            className="w-full bg-transparent outline-none text-[#1A1918] placeholder:text-[#C8C7C5]"
            style={{ fontSize: 15 }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[#9C9B99] font-semibold" style={{ fontSize: 11 }}>
          한 줄 소개
        </label>
        <div
          className="flex items-center w-full"
          style={{
            height: 48,
            background: "#F5F4F1",
            borderRadius: 10,
            border: "1px solid #D1D0CD",
            padding: "0 14px",
          }}
        >
          <input
            type="text"
            value={tagline}
            onChange={(e) => onChange("tagline", e.target.value)}
            placeholder="나를 한 줄로 표현한다면..."
            className="w-full bg-transparent outline-none text-[#1A1918] placeholder:text-[#C8C7C5]"
            style={{ fontSize: 15 }}
          />
        </div>
      </div>
    </div>
  );
}

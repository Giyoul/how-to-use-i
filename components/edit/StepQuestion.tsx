import { QuestionBadge } from "./QuestionBadge";

type Props = {
  questionNumber: number; // 1-based (1~8)
  questionText: string;
  answer: string;
  onChange: (value: string) => void;
};

export function StepQuestion({ questionNumber, questionText, answer, onChange }: Props) {
  return (
    <div
      className="w-full bg-white flex flex-col gap-4"
      style={{
        borderRadius: 20,
        padding: "22px 20px",
        boxShadow: "0 2px 16px #1A191808",
      }}
    >
      <div className="flex items-start gap-3">
        <QuestionBadge number={questionNumber} size="lg" />
        <span
          className="text-[#1A1918] font-semibold leading-snug pt-1"
          style={{ fontSize: 18 }}
        >
          {questionText}
        </span>
      </div>

      <div
        className="w-full"
        style={{
          background: "#FAFAF8",
          borderRadius: 12,
          border: "1px solid #E5E4E1",
          padding: "14px 16px",
          minHeight: 120,
        }}
      >
        <textarea
          value={answer}
          onChange={(e) => onChange(e.target.value)}
          placeholder="답변을 자유롭게 적어주세요..."
          className="w-full bg-transparent outline-none resize-none text-[#1A1918] placeholder:text-[#9C9B99] leading-relaxed"
          style={{ fontSize: 14, minHeight: 92 }}
        />
      </div>
    </div>
  );
}

import { QuestionBadge } from "@/components/edit/QuestionBadge";

type Props = {
  questionNumber: number;
  questionText: string;
  answer: string;
};

export function AnswerItem({ questionNumber, questionText, answer }: Props) {
  return (
    <div
      className="w-full bg-white flex flex-col gap-2.5"
      style={{
        borderRadius: 16,
        padding: "18px 20px",
        boxShadow: "0 2px 12px #1A191808",
      }}
    >
      <div className="flex items-center gap-2 w-full">
        <QuestionBadge number={questionNumber} size="sm" />
        <span
          className="text-[#6D6C6A] font-medium flex-1"
          style={{ fontSize: 13 }}
        >
          {questionText}
        </span>
      </div>

      <div className="w-full" style={{ height: 1, background: "#E5E4E1" }} />

      <p
        className="text-[#1A1918] w-full"
        style={{ fontSize: 15, lineHeight: 1.6 }}
      >
        {answer}
      </p>
    </div>
  );
}

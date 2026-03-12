export type QuestionKey = "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7" | "q8";

export const QUESTIONS: { key: QuestionKey; text: string }[] = [
  { key: "q1", text: "나에게 성공이란?" },
  { key: "q2", text: "나를 동기부여 시키는것은?" },
  { key: "q3", text: "나의 커뮤니케이션 스타일은?" },
  { key: "q4", text: "상대를 불편하게 만들수도 있는 나만의 성격은?" },
  { key: "q5", text: "나에게 신뢰를 얻거나 잃게 만드는 성격은?" },
  { key: "q6", text: "나만의 강점은?" },
  { key: "q7", text: "발전시키고 싶은 역량이 하나 있다면?" },
  { key: "q8", text: "살면서 느낀 가장 큰 성취감은?" },
];

export const TOTAL_STEPS = 9; // 1 intro + 8 questions

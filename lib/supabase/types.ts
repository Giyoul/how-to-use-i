export type Answers = {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
  q6?: string;
  q7?: string;
  q8?: string;
};

export type Profile = {
  id: string;
  username: string;
  display_name: string;
  tagline: string | null;
  answers: Answers;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

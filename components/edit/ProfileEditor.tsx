"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "./ProgressBar";
import { StepIntro } from "./StepIntro";
import { StepQuestion } from "./StepQuestion";
import { StepNavigator } from "./StepNavigator";
import { saveProfile } from "@/app/actions/profile";
import { QUESTIONS, TOTAL_STEPS, type QuestionKey } from "@/lib/questions";

const STORAGE_KEY = "howToUseI_draft";

type FormData = {
  displayName: string;
  tagline: string;
  answers: Record<QuestionKey, string>;
};

const EMPTY_FORM: FormData = {
  displayName: "",
  tagline: "",
  answers: { q1: "", q2: "", q3: "", q4: "", q5: "", q6: "", q7: "", q8: "" },
};

export function ProfileEditor() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = intro, 1~8 = questions
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // 로컬 스토리지에서 임시 저장 데이터 복원
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setForm(JSON.parse(saved));
    } catch {}
  }, []);

  // 변경 시 로컬 스토리지에 자동 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {}
  }, [form]);

  function updateIntro(field: "displayName" | "tagline", value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateAnswer(key: QuestionKey, value: string) {
    setForm((prev) => ({
      ...prev,
      answers: { ...prev.answers, [key]: value },
    }));
  }

  function canProceed(): boolean {
    if (step === 0) return form.displayName.trim().length > 0;
    const key = QUESTIONS[step - 1].key;
    return form.answers[key].trim().length > 0;
  }

  function handlePrev() {
    setStep((s) => Math.max(0, s - 1));
  }

  async function handleNext() {
    if (!canProceed()) return;
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
      return;
    }
    // 마지막 스텝 → 저장
    setSaving(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
      const { redirectTo } = await saveProfile(form);
      router.push(redirectTo);
    } catch {
      setSaving(false);
    }
  }

  const isLast = step === TOTAL_STEPS - 1;

  return (
    <div className="flex flex-col gap-4 w-full">
      <ProgressBar current={step + 1} total={TOTAL_STEPS} />

      {step === 0 ? (
        <StepIntro
          displayName={form.displayName}
          tagline={form.tagline}
          onChange={updateIntro}
        />
      ) : (
        <StepQuestion
          questionNumber={step}
          questionText={QUESTIONS[step - 1].text}
          answer={form.answers[QUESTIONS[step - 1].key]}
          onChange={(v) => updateAnswer(QUESTIONS[step - 1].key, v)}
        />
      )}

      <StepNavigator
        onPrev={handlePrev}
        onNext={handleNext}
        isFirst={step === 0}
        isLast={isLast}
        canProceed={canProceed()}
        saving={saving}
      />
    </div>
  );
}

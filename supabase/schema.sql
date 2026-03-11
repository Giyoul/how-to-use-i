-- profiles 테이블
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE NOT NULL,
  display_name  TEXT NOT NULL,
  tagline       TEXT,
  answers       JSONB NOT NULL DEFAULT '{}',
  is_published  BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles (username);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 본인만 INSERT/UPDATE/DELETE 가능
CREATE POLICY "본인 쓰기" ON public.profiles
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 공개된 프로필은 누구나 SELECT 가능
CREATE POLICY "공개 읽기" ON public.profiles
  FOR SELECT
  USING (is_published = true OR auth.uid() = id);

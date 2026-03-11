# "나의 사용법" 웹앱 설계 문서

## 1. 기술 스택 선정

### 최종 선정 스택

| 분류 | 기술 | 선정 근거 |
|------|------|-----------|
| Frontend Framework | Next.js 15 (App Router) | Vercel 무료 배포 최적화, SSR/SSG 혼합 지원 |
| Styling | Tailwind CSS | 빠른 모바일 UI 구현, 디자인 토큰 관리 용이 |
| Auth + DB | Supabase (Free Tier) | 카카오 OAuth 내장, PostgreSQL 500MB 무료 |
| 배포 | Vercel (Hobby Plan) | 무료, Next.js 네이티브 지원 |
| 폰트 | Google Fonts (Outfit) | 무료, `next/font` 최적화 내장 |

### 대안 비교

#### 백엔드/인증/DB 조합

| | Supabase | Firebase | PlanetScale + NextAuth |
|---|---|---|---|
| 무료 tier | PostgreSQL 500MB, 50K MAU | Firestore 1GB | MySQL 5GB |
| 카카오 OAuth | Auth Providers 직접 설정 | Custom OAuth 구현 필요 | NextAuth Kakao Provider |
| 운영 복잡도 | 낮음 | 낮음 | 높음 (3개 서비스) |
| **결론** | **선택** | 차선 | 제외 |

**Supabase 선택 핵심 근거**: 카카오 OAuth를 별도 백엔드 없이 Auth Provider 설정만으로 해결. 타입 안전한 DB 클라이언트로 Next.js Server Actions와 직접 연동.

---

## 2. 시스템 아키텍처

```
사용자 브라우저
  ├── / (온보딩)
  ├── /edit (편집)
  └── /share/{username} (공개 프로필)
         │
         ▼
  Vercel Edge Network
    └── Next.js 15 App Router
          ├── Client Components (편집 폼)
          └── Server Components / Server Actions (프로필 조회/저장)
                    │
                    ▼
              Supabase
                ├── Auth (카카오 OAuth)
                ├── PostgreSQL Database
                └── Row Level Security (RLS)
                          │
                          ▼
                  카카오 OAuth 서버
```

### 데이터 흐름

**인증 흐름**
```
사용자 → [카카오 로그인] → Supabase Auth
→ 카카오 동의 화면 → Authorization Code
→ Supabase Auth 콜백 처리 → 세션 생성 → /edit
```

**프로필 저장 흐름**
```
사용자 → [9단계 입력] → 로컬 상태 누적
→ [완료] → Server Action → Supabase upsert → /share/{username}
```

**공개 프로필 조회 흐름**
```
방문자 → /share/{username}
→ Server Component → Supabase DB 조회 → SSR 렌더링
```

---

## 3. 데이터베이스 스키마

### profiles 테이블

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID | PK, FK → auth.users | Supabase Auth UID |
| username | TEXT | UNIQUE, NOT NULL | 공유 URL 식별자 |
| display_name | TEXT | NOT NULL | 표시 이름 (Step 1) |
| tagline | TEXT | | 한 줄 소개 (Step 1) |
| answers | JSONB | NOT NULL DEFAULT '{}' | 8개 질문 답변 |
| is_published | BOOLEAN | DEFAULT false | 공개 여부 |
| created_at | TIMESTAMPTZ | DEFAULT now() | |
| updated_at | TIMESTAMPTZ | DEFAULT now() | |

### answers JSONB 구조

```json
{
  "q1": "나에게 성공이란 답변",
  "q2": "나를 동기부여 시키는 것 답변",
  "q3": "커뮤니케이션 스타일 답변",
  "q4": "불편하게 만들 수 있는 성격 답변",
  "q5": "신뢰를 얻거나 잃게 만드는 성격 답변",
  "q6": "나만의 강점 답변",
  "q7": "나의 발전방향 답변",
  "q8": "살면서 느낀 가장 큰 성취감 답변"
}
```

> JSONB 선택 근거: 단일 쿼리로 전체 프로필 조회. 향후 질문 추가/수정 시 스키마 변경 없이 유연하게 대응.

### RLS 정책

| 정책 | 대상 | 조건 |
|------|------|------|
| 본인 쓰기 | INSERT/UPDATE/DELETE | `auth.uid() = id` |
| 공개 읽기 | SELECT | `is_published = true OR auth.uid() = id` |

### username 자동생성 규칙

```
1. 카카오 닉네임 기반 생성
2. 영문 소문자 변환 + 공백 → 하이픈
3. 중복 시 → username-2, username-3 순서로 증가
4. 최대 30자
```

---

## 4. 라우팅 구조

### Next.js App Router 파일 트리

```
app/
├── layout.tsx                    ← 루트 레이아웃 (폰트, 전역 스타일)
├── page.tsx                      ← 온보딩/랜딩 (로그인)
│
├── auth/
│   └── callback/
│       └── route.ts              ← Supabase OAuth 콜백 처리
│
├── edit/
│   └── page.tsx                  ← 편집 화면 (9단계 스텝, Client Component)
│
└── share/
    └── [username]/
        ├── page.tsx              ← 공개 프로필 (Server Component, SSR)
        └── opengraph-image.tsx   ← OG 이미지 동적 생성
```

### 접근 제어

| 경로 | 인증 필요 | 설명 |
|------|-----------|------|
| `/` | X | 로그인 시 `/edit` 리다이렉트 |
| `/edit` | O | 미인증 시 `/` 리다이렉트 |
| `/share/[username]` | X | 누구나 접근 가능 |
| `/auth/callback` | X | OAuth 콜백 처리 |

> `middleware.ts`에서 Supabase 세션 쿠키 검증으로 처리.

### 렌더링 전략

| 경로 | 렌더링 | 캐싱 |
|------|--------|------|
| `/` | SSG | 빌드 타임 정적 |
| `/edit` | CSR | 없음 |
| `/share/[username]` | SSR | revalidate: 60초 |

---

## 5. 컴포넌트 트리

```
RootLayout
├── OnboardingPage (/)
│   └── KakaoLoginButton
│
├── EditPage (/edit)
│   └── ProfileEditor  ← Client Component, 스텝 상태 관리
│       ├── ProgressBar (현재 스텝 / 9)
│       ├── Step1_Intro
│       │   ├── NameInput
│       │   └── TaglineInput
│       ├── Step2to9_Question (공통 컴포넌트)
│       │   ├── QuestionBadge (홀수/짝수 색상 분기)
│       │   ├── QuestionText
│       │   └── AnswerTextarea
│       └── StepNavigator (이전/다음 버튼)
│
└── SharePage (/share/[username])
    └── ProfileCard  ← Server Component
        ├── ProfileHeader (아바타, 이름, 소개)
        ├── AnswerList
        │   └── AnswerItem × 8
        │       ├── QuestionBadge
        │       ├── QuestionText
        │       └── AnswerText
        └── ShareButton  ← Client Component (Web Share API)
```

### ProfileEditor 상태 구조

```typescript
// 관리 상태
currentStep: number  // 0~8 (0 = Step 1/9 소개, 1~8 = 질문 1~8)
formData: {
  displayName: string
  tagline: string
  answers: Record<"q1" | "q2" | ... | "q8", string>
}

// 부가 동작
- 로컬 스토리지 임시 저장 (새로고침 대비)
- 현재 스텝 유효성 검사 (다음 버튼 활성화 조건)
- 완료 시 Server Action 호출
```

### QuestionBadge 색상 규칙

```
홀수 질문 (q1, q3, q5, q7): background #EDF7F1, text #3D8A5A
짝수 질문 (q2, q4, q6, q8): background #FDE8DA, text #D89575
```

---

## 6. 카카오 OAuth 설정

### 카카오 Developers 설정

```
1. 애플리케이션 생성
2. 플랫폼 → Web → 사이트 도메인 등록:
   https://{your-project}.vercel.app
3. 카카오 로그인 활성화 (ON)
4. Redirect URI 등록:
   https://{supabase-project-id}.supabase.co/auth/v1/callback
5. 동의항목: 닉네임 (필수)
6. 앱 키 확인: REST API 키, Client Secret
```

### Supabase 설정

```
Authentication → Providers → Kakao
  Kakao enabled: ON
  Client ID: 카카오 REST API 키
  Client Secret: 카카오 Client Secret 코드

Authentication → URL Configuration
  Site URL: https://{your-project}.vercel.app
  Redirect URLs:
    https://{your-project}.vercel.app/auth/callback
    http://localhost:3000/auth/callback
```

### Supabase Free Tier 한도

| 항목 | 한도 | 예상 사용량 |
|------|------|------------|
| MAU | 50,000명 | 초기 충분 |
| DB 용량 | 500MB | 프로필당 ~2KB → 25만 명까지 |
| API 요청 | 무제한 | - |

### OAuth 콜백 처리 (`/auth/callback/route.ts`)

```
1. URL에서 code 파라미터 추출
2. supabase.auth.exchangeCodeForSession(code) 호출
3. 신규 사용자 → username 자동생성 후 profiles INSERT
4. 기존 사용자 → /edit 리다이렉트
5. 오류 시 → / 리다이렉트
```

---

## 7. 배포 전략

### Vercel 설정

```
1. vercel.com → New Project → GitHub 저장소 연결
2. Framework: Next.js (자동 감지)
3. 환경 변수 설정:
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 브랜치 전략

```
main      → Production 배포
develop   → Preview 배포 (자동 Preview URL)
feature/* → PR 생성 시 Preview URL 자동 생성
```

### 배포 체크리스트

```
초기 배포 전:
  [ ] Supabase 스키마 적용 및 RLS 활성화
  [ ] 카카오 Redirect URI 등록
  [ ] Supabase Auth Kakao Provider 설정
  [ ] Vercel 환경 변수 입력
  [ ] Vercel Production URL → 카카오 플랫폼 도메인 추가

배포 후 검증:
  [ ] 카카오 로그인 플로우
  [ ] 프로필 저장 → /share/{username} 접근
  [ ] 카카오톡 공유 시 OG 이미지 미리보기
  [ ] 모바일 레이아웃 (402px 기준)
```

---

## 8. 주요 아키텍처 결정 (ADR)

### ADR-001: 백엔드 없이 Supabase 직접 연동

**결정**: Next.js Server Actions + Supabase JS SDK 직접 연동. 별도 API 서버 미구성.

**이유**: 무료 배포 조건에서 별도 백엔드 서버는 비용 발생. Vercel + Supabase로 완전 무료 운용 가능.

**트레이드오프**: 향후 모바일 앱 추가 시 API 서버 분리 필요.

### ADR-002: 8개 답변을 JSONB로 저장

**결정**: `profiles.answers` JSONB 컬럼에 q1~q8 키로 저장.

**이유**: 단일 쿼리로 전체 프로필 조회. 질문 추가/수정 시 스키마 변경 불필요.

**트레이드오프**: 특정 답변 기반 검색 기능 추가 시 스키마 재설계 필요.

### ADR-003: 편집 화면을 단일 URL + 클라이언트 상태로 관리

**결정**: `/edit` 단일 경로에서 스텝 인덱스를 로컬 상태로 관리.

**이유**: 스텝 간 이동이 즉시 처리됨 (네트워크 요청 없음). 모바일 앱 전환 느낌.

**트레이드오프**: 특정 스텝 URL 직접 공유 불가. 로컬 스토리지 임시 저장으로 새로고침 대응.

---

## 9. 개발 Phase

### Phase 1 — 프로젝트 기반 세팅
**목표**: 개발 환경 완성. 이후 phase에서 UI/기능 작업만 집중할 수 있는 상태.

```
[ ] Next.js 15 프로젝트 생성 (TypeScript, App Router, Tailwind CSS)
[ ] Tailwind 디자인 토큰 설정 (colors, fontFamily: Outfit)
[ ] Supabase 프로젝트 생성
[ ] DB 스키마 적용 (profiles 테이블 + RLS 정책)
[ ] Supabase 환경 변수 연결 (.env.local)
[ ] Vercel 프로젝트 연결 + 환경 변수 등록
[ ] GitHub 저장소 생성 + main/develop 브랜치 전략 세팅
```

**완료 기준**: `npm run dev` 실행 시 빈 Next.js 앱이 뜨고, Supabase DB 연결이 정상 동작.

---

### Phase 2 — 인증 플로우
**목표**: 카카오 로그인 → 세션 생성 → 리다이렉트 전체 흐름 완성.

```
[ ] 카카오 Developers 앱 생성 + Redirect URI 등록
[ ] Supabase Auth Kakao Provider 설정
[ ] 온보딩 페이지 UI 구현 (/, 로그인 버튼)
[ ] /auth/callback route 구현 (OAuth 콜백 + 신규 유저 profiles INSERT)
[ ] middleware.ts 구현 (세션 기반 접근 제어)
[ ] 로그인 → /edit 리다이렉트 검증
```

**완료 기준**: 카카오 로그인 후 /edit로 이동, Supabase에 profiles 행 생성 확인.

---

### Phase 3 — 편집 화면 (9단계 스텝)
**목표**: 질문 답변 입력 → 저장 전체 플로우 완성.

```
[ ] ProfileEditor 클라이언트 컴포넌트 구현 (스텝 상태 관리)
[ ] Step 1 UI: 이름 + 한 줄 소개 입력 폼
[ ] Step 2~9 UI: 질문 카드 + 텍스트에리어 (공통 컴포넌트)
[ ] ProgressBar 컴포넌트 (현재 스텝 / 9)
[ ] QuestionBadge 컴포넌트 (홀수/짝수 색상 분기)
[ ] StepNavigator (이전/다음 버튼, 유효성 검사)
[ ] 로컬 스토리지 임시 저장 (새로고침 대비)
[ ] 완료 시 Server Action으로 profiles upsert
[ ] 저장 후 /share/{username} 리다이렉트
```

**완료 기준**: 9단계를 모두 완료하고 저장하면 DB에 답변이 저장되고 공유 페이지로 이동.

---

### Phase 4 — 공개 프로필 뷰
**목표**: /share/{username} 공개 페이지 완성. 외부 공유 가능한 상태.

```
[ ] /share/[username] Server Component 구현 (Supabase DB 조회)
[ ] ProfileHeader UI (아바타, 이름, 소개, 작성일)
[ ] AnswerList + AnswerItem UI (8개 Q&A 카드)
[ ] ShareButton 클라이언트 컴포넌트 (Web Share API + 클립보드 복사 폴백)
[ ] 하단 Sticky 공유 바 UI
[ ] 존재하지 않는 username 접근 시 404 처리
[ ] OG 메타태그 설정 (카카오톡 공유 미리보기)
```

**완료 기준**: /share/{username} URL을 카카오톡에 붙여넣으면 미리보기 카드가 표시됨.

---

### Phase 5 — 마무리 및 배포
**목표**: 프로덕션 품질 확보 후 실제 배포.

```
[ ] 모바일 레이아웃 전체 점검 (402px 기준)
[ ] 에러 상태 처리 (로그인 실패, 저장 실패, 404)
[ ] 로딩 상태 UI (스켈레톤 또는 스피너)
[ ] OG 이미지 동적 생성 (/share/[username]/opengraph-image.tsx)
[ ] Vercel Production 배포
[ ] 카카오 플랫폼 도메인 → Production URL 업데이트
[ ] 실제 카카오 로그인 → 전체 플로우 E2E 검증
```

**완료 기준**: 실제 기기에서 카카오 로그인 → 작성 → 공유 URL 전달 → 확인까지 동작.

---

### Phase별 의존성

```
Phase 1 (세팅)
    │
    ▼
Phase 2 (인증) ──────────────────────────────┐
    │                                        │
    ▼                                        ▼
Phase 3 (편집)                          Phase 4 (공개 프로필)
    │                                        │
    └─────────────────┬──────────────────────┘
                      ▼
                Phase 5 (배포)
```

> Phase 3과 Phase 4는 DB 스키마가 확정되면 병렬 진행 가능.

---

## 10. 디자인 시스템 토큰

```typescript
// tailwind.config.ts에 등록
colors: {
  primary: '#3D8A5A',
  background: '#F5F4F1',
  surface: '#FFFFFF',
  'text-primary': '#1A1918',
  'text-secondary': '#6D6C6A',
  'text-tertiary': '#9C9B99',
  border: '#E5E4E1',
  'badge-green-bg': '#EDF7F1',
  'badge-green-text': '#3D8A5A',
  'badge-orange-bg': '#FDE8DA',
  'badge-orange-text': '#D89575',
  kakao: '#FEE500',
}
```

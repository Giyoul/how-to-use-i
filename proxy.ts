import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: object }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // /edit는 로그인 필수
  if (!user && request.nextUrl.pathname.startsWith("/edit")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 이미 로그인한 상태에서 / 접근 시 /edit로
  if (user && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/edit", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/", "/edit/:path*"],
};

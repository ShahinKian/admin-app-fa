import { NextResponse } from "next/server";

const defaultLocale = "fa";
const locales = ["fa", "en"];

export function proxy(request: any) {
  const { pathname } = request.nextUrl;

  // The root and locale landing pages are entry points, not dashboards.
  if (pathname === "/" || locales.includes(pathname.slice(1))) {
    const hasSessionCookie =
      request.cookies.has("__Secure-next-auth.session-token") ||
      request.cookies.has("next-auth.session-token");

    return NextResponse.redirect(
      new URL(
        hasSessionCookie ? "/fa/dashboard" : "/fa/auth/login",
        request.url
      )
    );
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  // Routes without a locale use Persian as the default.
  if (!hasLocale) {
    const localizedPath = pathname === "/" ? "" : pathname;
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${localizedPath}${request.nextUrl.search}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|assets|docs|.*\\..*|_next).*)"],
};

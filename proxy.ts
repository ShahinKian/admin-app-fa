import { NextResponse } from "next/server";

export function proxy(request: any) {
  const { pathname, search } = request.nextUrl;

  // Remove legacy locale prefixes so old bookmarks keep working.
  if (pathname === "/fa" || pathname === "/en") {
    return NextResponse.redirect(new URL("/" + search, request.url));
  }
  if (pathname.startsWith("/fa/") || pathname.startsWith("/en/")) {
    const pathWithoutLocale = pathname.replace(/^\/(fa|en)/, "") || "/";
    return NextResponse.redirect(new URL(pathWithoutLocale + search, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|assets|docs|.*\\..*|_next).*)"],
};

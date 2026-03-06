import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "./lib/i18n/locale";

const ASSET_PATHS = ["/_next", "/favicon.ico", "/images"];

function isAssetRequest(pathname: string) {
  if (ASSET_PATHS.some((path) => pathname.startsWith(path))) {
    return true;
  }

  return /\.[^/]+$/.test(pathname);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAssetRequest(pathname)) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/en", request.url));
  }

  const [firstSegment] = pathname.split("/").filter(Boolean);

  if (!firstSegment || !isLocale(firstSegment)) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", firstSegment);
  requestHeaders.set("x-pathname", pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next).*)"],
};

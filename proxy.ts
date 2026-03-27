import { NextResponse, type NextRequest } from "next/server";

import { getCountdownDeadlineDate } from "@/lib/deadline";

const excludedPrefixes = ["/offer-ended", "/cca-admin-login", "/cca-admin-area"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (excludedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const deadline = getCountdownDeadlineDate();
  if (!deadline) {
    console.error("COUNTDOWN_DEADLINE could not be parsed; middleware bypassed.");
    return NextResponse.next();
  }

  if (Date.now() > deadline.getTime()) {
    return NextResponse.redirect(new URL("/offer-ended", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

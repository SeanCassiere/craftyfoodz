import { NextResponse, type NextRequest } from "next/server";

import { SUPER_ADMIN_DEVELOPER_ROLE } from "@craftyfoodz/db/enums";

import { AUTH_CONFIG } from "./lib/config";
import { verifyJwt } from "./lib/utils/jwt";

const isAuthed = async (req: NextRequest) => {
  const cookie = req.cookies.get(AUTH_CONFIG.cookie_session_jwt);
  if (!cookie) return null;

  const result = await verifyJwt(cookie.value);

  return result;
};

const publicPaths = ["/api/trpc*"];
const isPublicPath = (reqPath: string) => {
  return publicPaths.find((publicPath) =>
    reqPath.match(new RegExp(`^${publicPath}$`.replace("*$", "($|/)"))),
  );
};

const developerAdminPaths = ["/features*"];
const isDeveloperAdminPath = (reqPath: string) => {
  return developerAdminPaths.find((publicPath) =>
    reqPath.match(new RegExp(`^${publicPath}$`.replace("*$", "($|/)"))),
  );
};

export async function middleware(request: NextRequest) {
  const isLoggedIn = await isAuthed(request);

  if (request.nextUrl.pathname.toLowerCase() === "/") {
    if (isLoggedIn) {
      // redirect to restaurants if logged in
      return NextResponse.redirect(new URL("/restaurants", request.url));
    } else {
      return NextResponse.next();
    }
  } else if (isPublicPath(request.nextUrl.pathname)) {
    // allow public paths
    return NextResponse.next();
  }

  // redirect if not authed
  if (!isLoggedIn) {
    const signInUrl = new URL("/", request.url);
    signInUrl.searchParams.set("redirect_url", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // developer-only admin authed requests
  if (isDeveloperAdminPath(request.nextUrl.pathname)) {
    if (isLoggedIn.role !== SUPER_ADMIN_DEVELOPER_ROLE) {
      return NextResponse.redirect(new URL("/restaurants", request.url));
    }

    if (request.nextUrl.pathname.toLowerCase() === "/features") {
      return NextResponse.redirect(new URL(request.url + "/global"));
    }
  }

  // general authed requests
  if (request.nextUrl.pathname.toLowerCase() === "/settings") {
    return NextResponse.redirect(new URL(request.url + "/account"));
  }

  return NextResponse.next();
}

// Stop Middleware running on static files and public folder
export const config = {
  matcher: "/((?!_next/image|_next/static|favicon.ico|site.webmanifest).*)",
};

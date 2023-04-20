import { NextResponse, type NextRequest } from "next/server";

const publicPaths = ["/", "/dashboard", "/sign-in*", "/api/trpc*"];

const isAuthed = (_: NextRequest) => {
  return false;
};

const isPublic = (reqPath: string) => {
  return publicPaths.find((publicPath) =>
    reqPath.match(new RegExp(`^${publicPath}$`.replace("*$", "($|/)"))),
  );
};

export async function middleware(request: NextRequest) {
  console.log("middleware running");
  if (isPublic(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const isLoggedIn = isAuthed(request);

  if (!isLoggedIn) {
    const signInUrl = new URL("/", request.url);
    signInUrl.searchParams.set("redirect_url", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Stop Middleware running on static files and public folder
export const config = {
  matcher: "/((?!_next/image|_next/static|favicon.ico|site.webmanifest).*)",
};

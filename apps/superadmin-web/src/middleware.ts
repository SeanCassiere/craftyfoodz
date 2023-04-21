import { NextResponse, type NextRequest } from "next/server";

const publicPaths = [
  "/",
  "/restaurants*",
  "/features*",
  "/settings*",
  "/sign-in*",
  "/api/trpc*",
  "/api/trpc-panel*",
];

const isAuthed = (_: NextRequest) => {
  return false;
};

const isPublic = (reqPath: string) => {
  return publicPaths.find((publicPath) =>
    reqPath.match(new RegExp(`^${publicPath}$`.replace("*$", "($|/)"))),
  );
};

export async function middleware(request: NextRequest) {
  /**
   * @todo: Move this below the logged in check once auth is done
   *  */
  // START: MOVE ONCE AUTH IS DONE BELOW THE LOGGED IN CHECK
  if (request.nextUrl.pathname.toLowerCase() === "/features") {
    return NextResponse.redirect(new URL(request.url + "/global"));
  }
  if (request.nextUrl.pathname.toLowerCase() === "/settings") {
    return NextResponse.redirect(new URL(request.url + "/account"));
  }
  // END: MOVE ONCE AUTH IS DONE BELOW THE LOGGED IN CHECK

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

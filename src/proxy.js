import { NextResponse } from "next/server";

export function proxy(request) {
  const session = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  // Si no hay sesión y no estamos en login/registro, redirigir a login
  if (!session && pathname !== "/login" && pathname !== "/registro" && !pathname.startsWith("/api/auth")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si hay sesión e intenta ir a login/registro, redirigir a home
  if (session && (pathname === "/login" || pathname === "/registro")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - evidencias (uploaded files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|evidencias).*)",
  ],
};

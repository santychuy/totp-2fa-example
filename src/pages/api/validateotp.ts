import { db, User, eq } from "astro:db";
import { decodeHex } from "oslo/encoding";
import { TOTPController } from "oslo/otp";
import type { APIContext } from "astro";

import { lucia } from "@/auth";

export async function POST(context: APIContext): Promise<Response> {
  const { otp } = await context.request.json();

  if (!otp) return new Response("Invalid OTP", { status: 400 });

  const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return new Response("Invalid session", {
      status: 400,
    });
  }

  const { user } = await lucia.validateSession(sessionId);

  if (!user) {
    return new Response(null, {
      status: 401,
    });
  }

  const res = await db.select().from(User).where(eq(User.id, user.id));

  const validOTP = await new TOTPController().verify(
    otp,
    decodeHex(res[0].twoFactorSecret!),
  );

  // TODO: Validate here the OTP if its valid, redirect to the home page
  // if not send an error message with status 400

  return new Response(JSON.stringify({ validOTP }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

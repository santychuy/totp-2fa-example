import { db, User, eq } from "astro:db";
import { decodeHex } from "oslo/encoding";
import { TOTPController } from "oslo/otp";
import type { APIContext } from "astro";

import { lucia } from "@/auth";

export async function POST(context: APIContext): Promise<Response> {
  const { otp, id } = await context.request.json();

  if (!otp) return new Response("Invalid OTP", { status: 400 });

  const user = await db.select().from(User).where(eq(User.id, id));

  if (!user[0]) {
    return new Response("No user available", {
      status: 400,
    });
  }

  const validOTP = await new TOTPController().verify(
    otp,
    decodeHex(user[0].twoFactorSecret!),
  );

  const session = await lucia.createSession(user[0].id, {});

  const sessionCookie = lucia.createSessionCookie(session.id);

  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
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

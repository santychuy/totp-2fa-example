import { verify } from "@node-rs/argon2";
import { db, User, eq } from "astro:db";
import type { APIContext } from "astro";

import { lucia } from "@/auth";

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();

  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    !/^[a-z0-9_-]+@[a-z0-9_-]+\.[a-z]{2,}$/i.test(email)
  ) {
    return new Response("Invalid email", {
      status: 400,
    });
  }

  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return new Response("Invalid password", {
      status: 400,
    });
  }

  const existingUser = await db
    .select()
    .from(User)
    .where(eq(User.email, email));

  if (!existingUser[0]) {
    return new Response("Incorrect username or password", {
      status: 400,
    });
  }

  const validPassword = await verify(existingUser[0].password, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  if (!validPassword) {
    return new Response("Incorrect username or password", {
      status: 400,
    });
  }

  if (!!existingUser[0].twoFactorSecret) {
    return context.redirect(`/sign-in/2fa/${existingUser[0].id}`);
  }

  const session = await lucia.createSession(existingUser[0].id, {});

  const sessionCookie = lucia.createSessionCookie(session.id);

  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return context.redirect("/");
}

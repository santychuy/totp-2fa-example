import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
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

  const userId = generateIdFromEntropySize(10); // 16 characters long

  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const user = await db.select().from(User).where(eq(User.email, email));

  if (user[0]) {
    return new Response("Email already used", {
      status: 400,
    });
  }

  await db.insert(User).values({
    id: userId,
    email,
    password: passwordHash,
    twoFactorSecret: null,
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return context.redirect("/");
}

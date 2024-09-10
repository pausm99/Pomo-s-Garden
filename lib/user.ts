import { db } from "@/db/db";
import { UserCreateInputSchema } from "@/prisma/generated/zod";

export async function serverCreateUser(
  name: string,
  email: string,
  userClerkId: string
) {
  const data = {
    name,
    email,
    userClerkId,
  };
  try {
    UserCreateInputSchema.parse(data);
  } catch (error) {
    throw new Error(`Failed to parse user data: ${error}`);
  }
  try {
    const newUser = await db.user.create({
      data,
    });
    return newUser;
  } catch (error) {
    throw new Error(`Failed to create user: ${error}`);
  }
}

export async function serverGetUserIdByClerkId(userClerkId: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        userClerkId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user.id;
  } catch (error) {
    throw new Error(`Failed to get user: ${error}`);
  }
}

export async function serverGetUserById(id: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        id
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error(`Failed to get user: ${error}`);
  }
}

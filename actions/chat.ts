"use server";

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";
import { db } from "@/db/db";
import { auth } from "@clerk/nextjs/server";
import { serverGetUserIdByClerkId } from "@/lib/user";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

const { userId } = auth();
try {
  if (!userId) throw new Error("User not authenticated");
} catch (error) {
  throw new Error(`Failed to get user: ${error}`);
}
const dbUserId = serverGetUserIdByClerkId(userId);

// Continue an existing conversation or start a new one
export async function continueConversation(
  history: Message[],
  conversationId?: string | null
) {
  const userId = "66c60077cfa9f183ca355e23";
  if (!userId) throw new Error("User not authenticated");

  const stream = createStreamableValue();
  let conversation;

  if (conversationId) {
    // Fetch the existing conversation
    conversation = await db.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) throw new Error("Conversation not found");
  } else {
    // Start a new conversation
    conversation = await db.conversation.create({
      data: { userId, createdAt: new Date(), updatedAt: new Date() },
    });
    conversationId = conversation.id;
  }

  const messagesToSave = history.map((message) => ({
    role: message.role,
    content: message.content,
    conversationId,
  }));

  // Save the conversation messages to the database
  await db.message.createMany({ data: messagesToSave });

  (async () => {
    const { textStream } = await streamText({
      model: openai("gpt-3.5-turbo"),
      system:
        "You are a business casual professional productivity coach. You are helping a user with their productivity and answering questions, or supporting them in activities.",
      messages: history,
    });

    for await (const text of textStream) {
      stream.update(text);
    }

    stream.done();
  })();

  return {
    messages: history,
    newMessage: stream.value,
    conversationId, // Return the conversationId to maintain context
  };
}

// Fetch all conversations for the current user
export async function getConversations() {
  const userId = "66c60077cfa9f183ca355e23";

  if (!userId) throw new Error("User not authenticated");

  const conversations = await db.conversation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return conversations.map((conv) => ({
    id: conv.id,
    createdAt: conv.createdAt,
  }));
}

// Fetch messages of a specific conversation
export async function getConversationMessages(conversationId: string) {
  const userId = "66c60077cfa9f183ca355e23";

  if (!userId) throw new Error("User not authenticated");

  const conversation = await db.conversation.findUnique({
    where: { id: conversationId },
    include: { messages: true },
  });

  if (!conversation || conversation.userId !== userId) {
    throw new Error("Conversation not found");
  }

  return conversation.messages;
}

"use client";

import { actionCreateTag, actionGetAllTagsForUser } from "@/actions/tags";
import { Tag, TagCreateInputSchema } from "@/prisma/generated/zod";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { z } from "zod";

type TagCreateInput = z.infer<typeof TagCreateInputSchema>;

interface TagsContextProps {
  tagsCollection: Tag[];
  addTag: (tag: TagCreateInput) => Promise<Tag>;
  //   updateTag: (updatedTag: Tag) => void;
  //   deleteTag: (tagId: string) => void;
}

const TagsContext = createContext<TagsContextProps | undefined>(undefined);

export const TagsProvider = ({ children }: { children: ReactNode }) => {
  const [tagsCollection, setTagsCollection] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedTags = await actionGetAllTagsForUser(
          "66c60077cfa9f183ca355e23"
        );
        setTagsCollection(fetchedTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
      }
    };

    fetchTags();
  }, []);

  const addTag = async (tag: TagCreateInput) => {
    const newTag = await actionCreateTag(
      "66c60077cfa9f183ca355e23",
      tag.tagDesc,
      tag.color,
      []
    );
    setTagsCollection((prevTags) => [...prevTags, newTag]);
    return newTag;
  };

  return (
    <TagsContext.Provider value={{ tagsCollection, addTag }}>
      {children}
    </TagsContext.Provider>
  );
};

export const useTagsContext = () => {
  const context = useContext(TagsContext);
  if (context === undefined) {
    throw new Error("useTagsContext must be used within a TagsProvider");
  }
  return context;
};

export default TagsContext;
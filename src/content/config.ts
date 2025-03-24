import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string(),
    published: z.boolean(),
  }),
});

export const collections = {
  posts,
};

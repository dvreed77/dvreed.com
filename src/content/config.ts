import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string(),
    published: z.boolean(),
  }),
});

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    repoURL: z.string().optional(),
    projectURL: z.string().optional(),
    blurb: z.string(),
    images: z.array(z.string()),
  }),
});

export const collections = {
  posts,
  projects,
};

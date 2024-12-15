import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Workspace name is required')
    .max(256, 'Workspace name must be less than 256 characters long'),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((val) => (val === '' ? undefined : val)),
    ])
    .optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Workspace name must be at least 1 character long')
    .max(256, 'Workspace name must be less than 256 characters long')
    .optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((val) => (val === '' ? undefined : val)),
    ])
    .optional(),
});

import {z} from 'zod';

export const RINGS = ['adopt', 'trial', 'assess', 'hold'] as const;
export const USAGES = ['current', 'candidate', 'previous'] as const;
export const AREAS = ['development', 'platform', 'data', 'security'] as const;

const historySchema = z.object({
  date: z.string(),
  ring: z.enum(RINGS),
  usage: z.enum(USAGES),
  adr: z.string().optional(),
});

const technologySchema = z.object({
  id: z.string(),
  name: z.string(),
  area: z.enum(AREAS),
  ring: z.enum(RINGS),
  usage: z.enum(USAGES),
  description: z.string(),
  introduced: z.string(),
  lastReviewed: z.string(),
  tags: z.array(z.string()),
  website: z.string().optional(),
  replaces: z.array(z.string()),
  replacedBy: z.array(z.string()),
  history: z.array(historySchema),
  adrs: z.array(z.string()),
});

const adrSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(['proposed', 'accepted', 'rejected', 'superseded']),
  date: z.string(),
  technologies: z.array(z.string()),
  context: z.string(),
  decision: z.string(),
  alternatives: z.array(z.object({
    name: z.string(),
    reason: z.string(),
  })),
  consequences: z.object({
    positive: z.array(z.string()),
    negative: z.array(z.string()),
  }),
  revisitWhen: z.array(z.string()),
  links: z.array(z.object({
    label: z.string(),
    url: z.string(),
  })),
  supersedes: z.string().optional(),
  supersededBy: z.string().optional(),
});

export const contentSchema = z.object({
  schemaVersion: z.literal(1),
  radar: z.object({
    title: z.string(),
    areas: z.array(z.object({
      id: z.enum(AREAS),
      name: z.string(),
    })),
  }),
  technologies: z.array(technologySchema),
  adrs: z.array(adrSchema),
});

export type Ring = (typeof RINGS)[number];
export type Usage = (typeof USAGES)[number];
export type AreaId = (typeof AREAS)[number];
export type HistoryEntry = z.infer<typeof historySchema>;
export type Technology = z.infer<typeof technologySchema>;
export type Adr = z.infer<typeof adrSchema>;
export type ContentDocument = z.infer<typeof contentSchema>;

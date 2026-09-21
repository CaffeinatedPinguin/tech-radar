import {mkdir, readdir, readFile, writeFile} from 'node:fs/promises';
import {join, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import YAML from 'yaml';
import {z} from 'zod';

const root = fileURLToPath(new URL('..', import.meta.url));
const dataRoot = join(root, 'radar-data');
const outputPath = join(root, 'public', 'content', 'content.json');

const areas = ['development', 'platform', 'data', 'security'];
const rings = ['adopt', 'trial', 'assess', 'hold'];
const usages = ['current', 'candidate', 'previous'];
const adrStatuses = ['proposed', 'accepted', 'rejected', 'superseded'];

const nonEmpty = z.string().trim().min(1);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'must use YYYY-MM-DD').refine((value) => {
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(`${value}T00:00:00Z`);
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() + 1 === month && parsed.getUTCDate() === day;
}, 'must be a real calendar date');
const link = z.object({
  label: nonEmpty,
  url: z.string().url(),
});
const history = z.object({
  date,
  ring: z.enum(rings),
  usage: z.enum(usages),
  adr: nonEmpty.optional(),
});
const technology = z.object({
  id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
  name: nonEmpty,
  area: z.enum(areas),
  ring: z.enum(rings),
  usage: z.enum(usages),
  description: nonEmpty,
  introduced: date,
  lastReviewed: date,
  tags: z.array(nonEmpty).default([]),
  website: z.string().url().optional(),
  replaces: z.array(nonEmpty).default([]),
  history: z.array(history).default([]),
});
const alternative = z.object({
  name: nonEmpty,
  reason: nonEmpty,
});
const adr = z.object({
  id: z.string().regex(/^ADR-\d{3,}$/),
  title: nonEmpty,
  status: z.enum(adrStatuses),
  date,
  technologies: z.array(nonEmpty).default([]),
  context: nonEmpty,
  decision: nonEmpty,
  alternatives: z.array(alternative).default([]),
  consequences: z.object({
    positive: z.array(nonEmpty).default([]),
    negative: z.array(nonEmpty).default([]),
  }),
  revisitWhen: z.array(nonEmpty).default([]),
  links: z.array(link).default([]),
  supersedes: nonEmpty.optional(),
});
const radar = z.object({
  schemaVersion: z.literal(1),
  title: nonEmpty,
  areas: z.array(z.object({
    id: z.enum(areas),
    name: nonEmpty,
  })).length(4),
});

function formatIssue(source, issue) {
  const path = issue.path.length > 0 ? issue.path.join('.') : 'document';
  return `${source}:${path}: ${issue.message}`;
}

async function readYaml(path, source) {
  try {
    return YAML.parse(await readFile(path, 'utf8'));
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`${source}: document contains invalid YAML (${reason}).`, {cause: error});
  }
}

async function yamlFiles(directory) {
  const entries = await readdir(directory, {withFileTypes: true});

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.yaml'))
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function readEntityDirectory(kind, schema) {
  const directory = join(dataRoot, kind);
  const files = await yamlFiles(directory);
  const entities = [];
  for (const file of files) {
    const path = join(directory, file.name);
    const source = relative(root, path).replaceAll('\\', '/');
    const parsed = await readYaml(path, source);
    const result = schema.safeParse(parsed);
    if (!result.success) {
      throw new Error(`Content validation failed:\n${result.error.issues.map((issue) => formatIssue(source, issue)).join('\n')}`);
    }
    entities.push({source, data: result.data});
  }
  return entities;
}

function assertReference(source, path, id, index, label) {
  if (!index.has(id)) {
    throw new Error(`${source}:${path} references unknown ${label} "${id}".`);
  }
}

function detectCycles(graph, sourceFor) {
  const visiting = new Set();
  const visited = new Set();
  const walk = (node, path) => {
    if (visiting.has(node)) {
      throw new Error(`${sourceFor(node)}:${path} creates a relationship cycle at "${node}".`);
    }

    if (visited.has(node)) {
      return;
    }

    visiting.add(node);
    for (const next of graph.get(node) ?? []) {
      walk(next, `${path}.${next}`);
    }

    visiting.delete(node);
    visited.add(node);
  };

  for (const node of graph.keys()) {
    walk(node, 'relationships');
  }
}

function derive(technologies, adrs) {
  const technologyById = new Map(technologies.map((item) => [item.data.id, item.data]));
  const adrById = new Map(adrs.map((item) => [item.data.id, item.data]));

  for (const item of technologies) {
    const data = item.data;
    data.replaces.forEach((id, index) => assertReference(item.source, `replaces[${index}]`, id, technologyById, 'technology'));
    data.history.forEach((entry, index) => {
      if (entry.adr) {
        assertReference(item.source, `history[${index}].adr`, entry.adr, adrById, 'ADR');
      }
    });
  }
  for (const item of adrs) {
    const data = item.data;
    data.technologies.forEach((id, index) => assertReference(item.source, `technologies[${index}]`, id, technologyById, 'technology'));
    if (data.supersedes) {
      if (data.supersedes === data.id) {
        throw new Error(`${item.source}:supersedes cannot reference itself.`);
      }

      assertReference(item.source, 'supersedes', data.supersedes, adrById, 'ADR');
    }
  }
  const replacementGraph = new Map(technologies.map((item) => [item.data.id, item.data.replaces]));
  detectCycles(replacementGraph, (id) => technologyById.get(id)?.id ?? 'technologies');
  const supersedesGraph = new Map(adrs.map((item) => [item.data.id, item.data.supersedes ? [item.data.supersedes] : []]));
  detectCycles(supersedesGraph, (id) => adrs.find((item) => item.data.id === id)?.source ?? 'adrs');

  const replacedBy = new Map(technologies.map((item) => [item.data.id, []]));
  technologies.forEach((item) => {
    item.data.replaces.forEach((id) => replacedBy.get(id).push(item.data.id));
  });
  const supersededBy = new Map(adrs.map((item) => [item.data.id, undefined]));
  adrs.forEach((item) => {
    if (item.data.supersedes) {
      supersededBy.set(item.data.supersedes, item.data.id);
    }
  });
  const adrsByTechnology = new Map(technologies.map((item) => [item.data.id, []]));
  adrs.forEach((item) => {
    item.data.technologies.forEach((id) => adrsByTechnology.get(id).push(item.data.id));
  });

  return {
    technologies: technologies.map(({data}) => ({...data, replacedBy: replacedBy.get(data.id), adrs: adrsByTechnology.get(data.id)})),
    adrs: adrs.map(({data}) => ({...data, supersededBy: supersededBy.get(data.id)})),
  };
}

async function main() {
  const radarPath = join(dataRoot, 'radar.yaml');
  const radarSource = 'radar-data/radar.yaml';
  const radarResult = radar.safeParse(await readYaml(radarPath, radarSource));
  if (!radarResult.success) {
    throw new Error(`Content validation failed:\n${radarResult.error.issues.map((issue) => formatIssue(radarSource, issue)).join('\n')}`);
  }

  const ids = radarResult.data.areas.map((area) => area.id);
  if (new Set(ids).size !== 4 || !areas.every((area) => ids.includes(area))) {
    throw new Error(`${radarSource}:areas must contain exactly development, platform, data and security.`);
  }

  const technologies = await readEntityDirectory('technologies', technology);
  const adrs = await readEntityDirectory('adrs', adr);
  const allIds = new Map();
  for (const group of [technologies, adrs]) {
    for (const item of group) {
      if (allIds.has(item.data.id)) {
        throw new Error(`${item.source}:id duplicates ${allIds.get(item.data.id)}.`);
      }

      allIds.set(item.data.id, item.source);
    }
  }
  const derived = derive(technologies, adrs);
  const content = {schemaVersion: 1, radar: radarResult.data, ...derived};
  await mkdir(join(root, 'public', 'content'), {recursive: true});
  await writeFile(outputPath, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
  console.log(`Generated ${relative(root, outputPath).replaceAll('\\', '/')} (${technologies.length} technologies, ${adrs.length} ADRs)`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : 'Content build failed because an unknown error was thrown.';
  console.error(message);
  process.exitCode = 1;
});

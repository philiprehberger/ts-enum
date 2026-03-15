import type { ParseResult } from './types';

type SimpleDefinition<V> = Record<string, V>;

type RichDefinition<V> = Record<string, { value: V; label?: string; [key: string]: unknown }>;

type ExtractValues<D> = {
  [K in keyof D]: D[K] extends { value: infer V } ? V : D[K];
}[keyof D];

interface EnumMethods<D, V> {
  values(): V[];
  keys(): (keyof D)[];
  entries(): [keyof D, V][];
  parse(input: unknown): ParseResult<V>;
  label(value: V): string;
  is(value: unknown): value is V;
  options(): { value: V; label: string }[];
  meta(value: V): Record<string, unknown> | undefined;
}

type EnumResult<D> = {
  readonly [K in keyof D]: D[K] extends { value: infer V } ? V : D[K];
} & EnumMethods<D, ExtractValues<D>>;

function isRichEntry(entry: unknown): entry is { value: unknown; label?: string } {
  return typeof entry === 'object' && entry !== null && 'value' in entry;
}

export function defineEnum<const D extends SimpleDefinition<string | number> | RichDefinition<string | number>>(
  definition: D,
): EnumResult<D> {
  const valueMap = new Map<unknown, { key: string; label: string; meta: Record<string, unknown> }>();
  const result: Record<string, unknown> = {};

  for (const [key, entry] of Object.entries(definition)) {
    if (isRichEntry(entry)) {
      const { value, label, ...rest } = entry;
      result[key] = value;
      valueMap.set(value, { key, label: label ?? key, meta: rest });
    } else {
      result[key] = entry;
      valueMap.set(entry, { key, label: key, meta: {} });
    }
  }

  const methods: EnumMethods<D, ExtractValues<D>> = {
    values() {
      return [...valueMap.keys()] as ExtractValues<D>[];
    },
    keys() {
      return Object.keys(definition) as (keyof D)[];
    },
    entries() {
      return Object.keys(definition).map((k) => [k, result[k]]) as [keyof D, ExtractValues<D>][];
    },
    parse(input: unknown) {
      if (valueMap.has(input)) {
        return { ok: true, value: input } as ParseResult<ExtractValues<D>>;
      }
      return { ok: false, error: `Invalid enum value: ${String(input)}` };
    },
    label(value: ExtractValues<D>) {
      return valueMap.get(value)?.label ?? String(value);
    },
    is(value: unknown): value is ExtractValues<D> {
      return valueMap.has(value);
    },
    options() {
      return [...valueMap.entries()].map(([value, info]) => ({
        value: value as ExtractValues<D>,
        label: info.label,
      }));
    },
    meta(value: ExtractValues<D>) {
      return valueMap.get(value)?.meta;
    },
  };

  Object.assign(result, methods);
  return Object.freeze(result) as EnumResult<D>;
}

export type EnumValue<E> = E extends { values(): (infer V)[] } ? V : never;

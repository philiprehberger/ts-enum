export type EnumDefinition<V = unknown> = Record<string, V | { value: V; label?: string; [key: string]: unknown }>;

export type ParseResult<V> = { ok: true; value: V } | { ok: false; error: string };

export interface EnumInstance<D extends EnumDefinition> {
  values(): EnumValueType<D>[];
  keys(): (keyof D)[];
  entries(): [keyof D, EnumValueType<D>][];
  parse(input: unknown): ParseResult<EnumValueType<D>>;
  label(value: EnumValueType<D>): string;
  is(value: unknown): value is EnumValueType<D>;
  options(): { value: EnumValueType<D>; label: string }[];
  meta(value: EnumValueType<D>): Record<string, unknown> | undefined;
}

type EnumValueType<D extends EnumDefinition> = {
  [K in keyof D]: D[K] extends { value: infer V } ? V : D[K];
}[keyof D];

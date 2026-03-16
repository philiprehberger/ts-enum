# @philiprehberger/ts-enum

[![CI](https://github.com/philiprehberger/ts-enum/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/ts-enum/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/ts-enum.svg)](https://www.npmjs.com/package/@philiprehberger/ts-enum)
[![License](https://img.shields.io/github/license/philiprehberger/ts-enum)](LICENSE)

Rich enums with methods, labels, and serialization.

## Installation

```bash
npm install @philiprehberger/ts-enum
```

## Usage

```ts
import { defineEnum, type EnumValue } from '@philiprehberger/ts-enum';

const Status = defineEnum({
  ACTIVE:   { value: 'active',   label: 'Active' },
  INACTIVE: { value: 'inactive', label: 'Inactive' },
});

type Status = EnumValue<typeof Status>; // 'active' | 'inactive'

Status.ACTIVE;          // 'active' (literal type)
Status.label('active'); // 'Active'
Status.options();       // [{ value: 'active', label: 'Active' }, ...]
Status.parse('active'); // { ok: true, value: 'active' }
Status.is('active');    // true (type guard)
```

### Simple Enums

```ts
const Color = defineEnum({
  RED: 'red',
  GREEN: 'green',
  BLUE: 'blue',
});

Color.RED;       // 'red'
Color.values();  // ['red', 'green', 'blue']
```

## API

| Method | Description |
|--------|-------------|
| `defineEnum(definition)` | Create a frozen enum with methods |
| `.values()` | All enum values |
| `.keys()` | All enum keys |
| `.entries()` | Key-value pairs |
| `.parse(input)` | Safe parse with result type |
| `.label(value)` | Get display label |
| `.is(value)` | Type guard |
| `.options()` | `{ value, label }[]` for UI selects |
| `.meta(value)` | Get metadata for a value |

## License

MIT

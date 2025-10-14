# Basic Usage

## Introduction

`DataFaker` is extremely easy to use. You only need to:

1. Define a data model
2. Generate data

## Define a Model - defineModel

The `defineModel` method is used to define a data model, and it accepts two parameters:

- Model name
- Data template

The data template is an object where the keys are field names. For details, refer to [Template Syntax](/en/Template-Syntax.md) (Note: The original Chinese path "/zh/模板语法.md" is adjusted to follow English documentation path conventions; retain the original path if the English version uses the same Chinese path).

```ts
// Define the model
const userModel = defineModel('user', {
  id: 'string.uuid',
  name: 'person.fullName',
  age: ['number.int', { min: 18, max: 30 }],
});
```

## Generate Data - fakeData

You can generate data matching the model template by using the `fakeData` function and passing in the data model, as shown below:

```ts
// Generate data
const data = fakeData(userModel);
console.log(data);
```

The generated data will look like this:

```json
{
  "id": "5bdfc8e5-3b33-4560-b4ca-8b32b0150661",
  "name": "Malcolm Simonis",
  "age": 18
}
```

::: tip The Second Parameter
In fact, the `fakeData` function can also accept a second parameter `options` for runtime configuration, as shown below:

::: code-group

```ts [options]
/**
 * Use model configuration
 */
type DataFakeOptions = {
  /**
   * Number of data entries to generate
   */
  count?: number;
  /**
   * Rules for reference types
   */
  refRules?: RefModelRule;
  /**
   * Hook functions
   */
  hooks?: DataFakeHook;
  /**
   * Language locale
   */
  locale?: LocaleType;
};
```

```ts [Reference Module Configuration Rules]
/**
 * Fake data rules
 */
type RefModelRule = {
  /**
   * Number of data entries to generate
   */
  [COUNT]?: number;
  /**
   * Recursion depth when referencing the model itself
   */
  [DEEP]?: number;
  /**
   * Structural recursion
   */
  [key: string | symbol]: number | RefModelRule | [number, number];
};
```

```ts [Hook Function Rules]
/**
 * Schema type
 */
type SchemaType = 'function' | 'object' | 'array' | 'string';

/**
 * Context object for beforeEachCbs
 */
type BeforeEachContext = {
  /**
   * Key for each iteration
   */
  key: string | symbol;
  /**
   * Schema
   */
  schema: DataFieldType;
  /**
   * Type of the template schema
   */
  type: SchemaType;
  /**
   * Associated parent object/module
   */
  belongTo: string | symbol;
};

/**
 * Context object for afterEachCbs
 */
type AfterEachContext = {
  /**
   * Key for each iteration
   */
  key: string | symbol;
  /**
   * Value after each iteration
   */
  value: any;
  /**
   * Generated data result
   */
  result: any;
  /**
   * Type of the template schema
   */
  type: SchemaType;
  /**
   * Associated parent object/module
   */
  belongTo: string | symbol;
};

/**
 * Data generation hooks
 */
type DataFakeHook = {
  /**
   * Hook before data generation starts
   */
  beforeAllCbs?: DataFakeCb<ModelSchema>;
  /**
   * Hook after data generation completes
   */
  afterAllCbs?: DataFakeCb;
  /**
   * Hook before each iteration
   */
  beforeEachCbs?: DataFakeCb<BeforeEachContext>;
  /**
   * Hook after each iteration of data generation
   */
  afterEachCbs?: DataFakeCb<AfterEachContext>;
};

/**
 * Callback function type for data generation
 */
type DataFakeCb<T = any> = ((data: T) => T) | Array<(data: T) => T>;
```

```ts [Language Locale Configuration Rules]
/**
 * Language locale type
 */
type LocaleType = AllFakers | Array<LocaleDefinition | AllFakers> | Faker;
```

Specifically, this means you can specify the following when generating data:

1. The number of primary data entries to generate
2. The number of referenced data entries to generate
3. The number of self-referential data entries and the recursion depth
4. Hook functions
5. Language locale

:::

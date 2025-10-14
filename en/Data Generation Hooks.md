# Data Generation Hooks

## Introduction

Hook functions are executed before, during, or after data generation. They allow you to manipulate data items and templates during the generation process, modifying how data is produced. `DataFaker` provides four types of hook functions:

- `beforeAllCbs`: Manipulate the template before data generation starts
- `afterAllCbs`: Manipulate generated data after generation completes
- `beforeEachCbs`: Configure templates before individual data items are generated
- `afterEachCbs`: Manipulate data after individual data items are generated

## Manipulate Templates Before Generation - `beforeAllCbs`

### Basic Concept

This hook executes **before data generation begins**. It receives a `schema` parameter (the data generation template) and allows you to modify the schema—for example, adding/removing fields or changing how fields are generated.

### Global Definition

Use the `setHooks` function to define global hooks, which apply to all generated data:

```ts {2-7}
// Define a global beforeAllCbs callback
DataFaker.setHooks({
  beforeAllCbs: schema => {
    console.log(schema); // Log the original schema
    return schema;
  },
});

// User model
const userModel = defineModel('user', {
  firstName: 'person.firstName',
  secondName: 'person.lastName',
  age: ['number.int', { min: 18, max: 65 }],
  email: ctx => {
    return faker.internet.email({ firstName: ctx.firstName, lastName: ctx.secondeName });
  },
  address: { refModel: 'address', count: 1 },
});

const userDatas = fakeData(userModel);
console.dir(userDatas, { depth: Infinity });
```

In this example, the global `beforeAllCbs` logs the `userModel` schema, which looks like this:

```ts
{
  firstName: 'person.firstName',
  secondName: 'person.lastName',
  age: ['number.int', { min: 18, max: 65 }],
  email: (ctx) => {
    return faker.internet.email({ firstName: ctx.firstName, lastName: ctx.secondeName });
  },
  address: { refModel: 'address', count: 1 },
}
```

You can modify the schema in `beforeAllCbs`. For example, to fix the `age` field to 18:

```ts {3-5}
DataFaker.setHooks({
  beforeAllCbs: schema => {
    schema.age = () => {
      return 18; // Override age to always return 18
    };
    return schema;
  },
});
```

Data generation will now use the modified template:

```json {5}
{
  "firstName": "Brooke",
  "secondName": "Brekke",
  "address": null,
  "age": 18,
  "email": "Brooke0@hotmail.com"
}
```

::: tip Callback Queues
`beforeAllCbs` accepts not just a single function, but an **array of functions**. These functions execute in order, with each function’s return value passed as the input to the next:

```ts {3,10}
DataFaker.setHooks({
  beforeAllCbs: [
    schema => {
      // Fix age to 18 (overriding { min: 18, max: 65 })
      schema.age = () => {
        return 18;
      };
      return schema;
    },
    schema => {
      // Add a "hobby" field
      schema.hobby = ['helpers.arrayElements', ['Basketball', 'Table Tennis']];
      return schema;
    },
  ],
});
```

With this configuration, generated data will always have `age: 18` and a randomly generated `hobby` field (either "Basketball" or "Table Tennis").
:::

::: warning Note
Functions in `beforeAllCbs` **must return the modified schema**. Failing to return the schema will result in an empty schema, leading to `null` data.
:::

### Runtime Definition

You can define model-specific hooks when generating data via the second parameter of `fakeData`. The syntax matches global hooks:

```ts {2-9}
const userDatas = fakeData(userModel, {
  hooks: {
    beforeAllCbs: schema => {
      schema.age = () => {
        return 18; // Override age for this generation only
      };
      return schema;
    },
    // Or an array of functions
  },
});
```

### Merging Hooks

Global hooks and runtime hooks are merged, with **runtime hooks executing before global hooks**.

::: code-group

```ts {1-6,26-31} [Code]
// Global hook
DataFaker.setHooks({
  beforeAllCbs: schema => {
    schema.hobby = ['helpers.arrayElements', ['Basketball', 'Table Tennis']];
    return schema;
  },
});

const addressModel = defineModel('address', {
  country: 'location.country',
  city: 'location.city',
  children: {
    refModel: 'address',
  },
});

// User model
const userModel = defineModel('user', {
  firstName: 'person.firstName',
  secondName: 'person.lastName',
  age: ['number.int', { min: 18, max: 65 }],
  email: ctx => {
    return faker.internet.email({ firstName: ctx.firstName, lastName: ctx.secondeName });
  },
  address: { refModel: 'address', count: 1 },
});

// Runtime hook
const userDatas = fakeData(userModel, {
  hooks: {
    beforeAllCbs: schema => {
      schema.age = ctx => {
        return 18;
      };
      return schema;
    },
  },
});

console.dir(userDatas, { depth: Infinity });
```

```ts [Merged Configuration] {3}
{
  // Global and runtime hooks are merged into a queue
  beforeAllCbs: [ [Function: beforeAllCbs], [Function: beforeAllCbs] ],
  afterAllCbs: [],
  beforeEachCbs: [],
  afterEachCbs: []
}
```

```json [Generated Data] {9-10}
{
  "firstName": "Oliver",
  "secondName": "Ankunding-Paucek",
  "address": {
    "country": "Sudan",
    "city": "Kiarahaven",
    "children": { "country": "Jamaica", "city": "Fort Suzannemouth", "children": null }
  },
  "hobby": ["Table Tennis", "Basketball"], // Added by global hook
  "age": 18, // Set by runtime hook
  "email": "Oliver_Daniel97@gmail.com"
}
```

:::

::: tip Context Object
As mentioned in "Template Syntax", functions defined in schemas can accept a context object containing previously generated data. This also applies to new template fields added in hooks—if defined as functions, they can access the context `ctx`.
:::

## Manipulate Data After Generation - `afterAllCbs`

`afterAllCbs` is defined identically to `beforeAllCbs` but receives **generated data** instead of a schema. In summary:

> **`beforeAllCbs` modifies the template to change the final data form, while `afterAllCbs` directly modifies the generated data.**

Example: Add an `email` field to the generated data.

::: code-group

```ts {10-16} [Code]
// User model
const userModel = defineModel('user', {
  firstName: 'person.firstName',
  secondName: 'person.lastName',
  age: ['number.int', { min: 18, max: 65 }],
  address: { refModel: 'address', count: 1 },
});

const userDatas = fakeData(userModel, {
  hooks: {
    afterAllCbs(data) {
      console.log(data); // Log the generated data before modification
      return {
        email: faker.internet.email(), // Add email
        ...data,
      };
    },
  },
});

console.dir(userDatas, { depth: Infinity });
```

```ts [data Parameter]
{
  firstName: 'Darlene',
  secondName: 'Quigley',
  age: 35,
  address: {
    country: 'Macao',
    city: 'Corkeryville',
    children: { country: 'Papua New Guinea', city: 'Eudorafort', children: null }
  }
}
```

```ts [Final Result] {2}
{
  email: 'Reta71@yahoo.com', // Added by afterAllCbs
  firstName: 'Darlene',
  secondName: 'Quigley',
  age: 35,
  address: {
    country: 'Macao',
    city: 'Corkeryville',
    children: { country: 'Papua New Guinea', city: 'Eudorafort', children: null }
  }
}
```

:::

## Configure Templates Before Individual Items - `beforeEachCbs`

### Basic Concept

Unlike `beforeAllCbs` (which runs once before generation), `beforeEachCbs` executes **before each individual data item is generated** (once per field). It receives a `ctx` context object with the following properties:

```ts
/**
 * Schema type classification
 */
type SchemaType = 'function' | 'object' | 'array' | 'string';

/**
 * Context object for beforeEachCbs
 */
type BeforeEachContext = {
  /**
   * Key of the current field being processed
   */
  key: string | symbol;
  /**
   * Schema of the current item
   */
  schema: DataFieldType;
  /**
   * Type of the template schema
   */
  type: SchemaType;
  /**
   * Parent object (for use in recursive structures)
   */
  belongTo: string | symbol;
};
```

### Basic Usage

Example: Remove address data by modifying its schema.

::: code-group

```ts [Code] {17-22}
const addressModel = defineModel('address', {
  country: 'location.country',
  city: 'location.city',
  children: {
    refModel: 'address',
  },
});

// User model
const userModel = defineModel('user', {
  firstName: 'person.firstName',
  secondName: 'person.lastName',
  age: ['number.int', { min: 18, max: 65 }],
  address: { refModel: 'address', count: 1 },
});

const userDatas = fakeData(userModel, {
  hooks: {
    beforeEachCbs: ctx => {
      // Target the "address" field (an object)
      if (ctx.type === 'object' && ctx.key === 'address') {
        ctx.schema = () => null; // Override schema to return null
      }
      return ctx;
    },
  },
});

console.dir(userDatas, { depth: Infinity });
```

```ts [Result] {5}
{
  firstName: 'Gunnar',
  secondName: 'McCullough',
  age: 59,
  address: null // Modified by beforeEachCbs
}
```

:::

::: tip Tip
Use the `type` and `belongTo` properties to identify specific data items for targeted modifications.
:::

## Manipulate Data After Individual Items - `afterEachCbs`

### Basic Concept

`afterEachCbs` is similar to `beforeEachCbs` but executes **after each individual data item is generated**. It receives a `ctx` context object with these properties:

```ts
/**
 * Context object for afterEachCbs
 */
type AfterEachContext = {
  /**
   * Key of the current field being processed
   */
  key: string | symbol;
  /**
   * Value of the current item after generation
   */
  value: any;
  /**
   * Cumulative result of generated data so far
   */
  result: any;
  /**
   * Type of the template schema
   */
  type: SchemaType;
  /**
   * Parent object
   */
  belongTo: string | symbol;
};
```

### Excellent Support for Recursive Items

Hooks like `beforeAllCbs` and `afterAllCbs` cannot modify nested or recursive data because they run once. `beforeEachCbs` can modify templates but not recursively generated data. However, `afterEachCbs` works seamlessly with recursive data, as it runs after every individual item is generated.

Example: Add an `id` field to all referenced/recursive data items.

::: code-group

```ts [Code] {17-23}
const addressModel = defineModel('address', {
  country: 'location.country',
  city: 'location.city',
  children: {
    refModel: 'address', // Self-reference for recursion
  },
});

// User model
const userModel = defineModel('user', {
  firstName: 'person.firstName',
  secondName: 'person.lastName',
  age: ['number.int', { min: 18, max: 65 }],
  address: { refModel: 'address', count: 1 },
});

const userDatas = fakeData(userModel, {
  hooks: {
    afterEachCbs: ctx => {
      // Add an "id" to all object-type values
      if (ctx.type === 'object' && ctx.value) {
        ctx.value['id'] = faker.string.uuid();
      }
      return ctx;
    },
  },
});

console.dir(userDatas, { depth: Infinity });
```

```ts [Result] {12,14}
{
  firstName: 'Ernest',
  secondName: 'Ritchie',
  age: 42,
  address: {
    country: 'Sint Maarten',
    city: 'Joeborough',
    children: {
      country: 'Sudan',
      city: 'Watsicashire',
      children: null,
      id: '6b9dd2aa-26a2-4072-95af-6c63eddd6dc0' // Added by afterEachCbs
    },
    id: '945e2165-2119-45ee-bd52-b0c0df8a73b1' // Added by afterEachCbs
  }
}
```

:::

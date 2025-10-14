# Template Syntax

`DataFaker` defines data structures through templates, similar to defining a database table—each data structure is a `schema`.

## Using Predefined Data Types

`DataFaker` provides **26 categories** covering over **200 common data items** that you can use directly. The basic syntax is as follows:

1. `Field: Type string`
2. `Field: [Type string, Method parameters]`

Examples are shown below:

::: code-group

```ts [Path String Format]
const userSchema: ModelSchema = {
  id: 'string.uuid',
  name: 'person.fullName',
  // Array format: first element is the method path, second is the method parameters
  age: ['number.int', { min: 18, max: 30 }],
};
```

```js [Native faker.js Definition Format]
const user = {
  id: faker.string.ulid(),
  name: faker.person.fullName(),
  age: faker.number.int({ min: 18, max: 30 }),
};
```

:::

<GlassCard>
<template #title>Automatic Type Hints</template>
<template #description>DataFaker implements data type hints using TypeScript. Therefore, you must annotate the `ModelSchema` type when defining a schema. This allows you to easily use various type hints without the hassle of tedious method calls.</template>
<template #content>
 <img src="https://image-bucket-1307756649.cos.ap-chengdu.myqcloud.com/image/20251004101219447.png" alt="Automatic Type Hints Screenshot" />
</template>
</GlassCard>

## Custom Data Types

### Getter Functions

If you need to customize data, you can use a `getter` function to return the desired data. The basic syntax is:

```js
{
  Field: () => {
    return CustomData;
  };
}
```

Example:

```ts {4-7}
const userModel = defineModel('user', {
  id: 'string.uuid',
  age: ['number.int', { min: 18, max: 30 }],
  name: () => {
    return `__${faker.person.fullName()}`;
  },
  sex: () => 'Male',
});
```

::: tip defineModel
`defineModel` is a function provided by `DataFaker` for defining data models. It returns a `DModel` object and accepts two parameters:

- Model name: `string`
- Model template: `ModelSchema`

When you define a model this way, it is registered with `DataFaker`, and you can use the `fakeData` function elsewhere to generate data from it.
:::

### Context Information

To maintain the correlation between generated data points, `DataFaker` uses a **context mechanism**. Specifically, the `getter` function can accept a context object that contains data from fields generated earlier. This allows you to leverage pre-generated data in the `getter` function to ensure consistency.

For example, you might want to generate an email address that uses the user’s name, making the email more realistic:

```ts {4-9}
const userModel = defineModel('user', {
  id: 'string.uuid',
  age: ['number.int', { min: 18, max: 30 }],
  fName: 'person.firstName',
  lName: 'person.lastName',
  email: ctx => {
    // Use the pre-generated fName and lName from the context
    return faker.internet.email({ firstName: ctx.fName, lastName: ctx.lName });
  },
});
const users = fakeData(userModel);
```

The generated email will now be associated with the `fName` and `lName` fields:

```bash {4-6}
{
  id: '1cdef7cf-76f7-459f-a250-3823cad6ead1',
  age: 24,
  fName: 'Brycen',
  lName: 'Johnson',
  email: 'Brycen.Johnson@gmail.com'
}
```

## Referenced Data Types

### Basic Syntax

`DataFaker` supports **referenced data types**, allowing you to reference one data structure within another. This makes data structures more flexible. The basic syntax is:

```ts
{
  Field: {
    refModel: 'Model Name' | Model Object;
    // Number of entries to generate
    count?: number;
    // Recursion depth (for self-references)
    deep?: number;
  },
  // Alternative shorthand: count and deep default to 1
  Field: 'Model Name' | Model Object
}
```

### Referencing Other Models

In the example below, the "user model" references the "address model", so generating data for the user model will also generate associated address data:

```ts {2-5,16-22}
// Address model
const addressModel = defineModel('address', {
  country: 'location.country',
  city: 'location.city',
});

// User model
const userModel = defineModel('user', {
  id: 'number.int',
  firstName: 'person.firstName',
  secondeName: 'person.lastName', // Note: "secondeName" is used as per the original; standard term is "lastName"
  age: ['number.int', { min: 18, max: 65 }],
  hobby: ['helpers.arrayElements', ['Basketball', 'Football', 'Table Tennis', 'Badminton']],
  email: ctx => {
    return faker.internet.email({ firstName: ctx.firstName, lastName: ctx.secondeName });
  },
  // Reference the address model (shorthand)
  address: addressModel,
  // Reference with custom rules
  address2: {
    refModel: 'address', // Use the registered model name
    count: 3, // Generate 3 address entries
  },
});

const userDatas = fakeData(userModel, {
  count: 2, // Generate 2 user entries
});
console.log(userDatas);
```

The generated data will look like this:

```bash {7-12}
{
  id: 2769029318500197,
  firstName: 'Alvah',
  secondeName: 'Luettgen',
  age: 62,
  hobby: [ 'Basketball', 'Badminton', 'Table Tennis' ],
  address: { country: 'Malta', city: 'Konopelskistead' },
  address2: [
    { country: 'Bahamas', city: 'Glen Burnie' },
    { country: 'Gambia', city: 'Port Alden' },
    { country: 'Rwanda', city: 'New Rosannaville' }
  ],
  email: 'Alvah_Luettgen@hotmail.com'
}
```

### Self-Reference

`DataFaker` also supports **self-references**, which is useful for generating tree-structured data. Note that self-references **must use the model’s registered name** (not the model object itself), otherwise a circular reference error will occur.

The example below generates tree-structured data:

```ts {15-20}
const addressModel = defineModel('address', {
  country: 'location.country',
  city: 'location.city',
});

const userModel = defineModel('user', {
  // Registered name: "user"
  id: 'number.int',
  firstName: 'person.firstName',
  secondeName: 'person.lastName',
  age: ['number.int', { min: 18, max: 65 }],
  hobby: ['helpers.arrayElements', ['Basketball', 'Football', 'Table Tennis', 'Badminton']],
  email: ctx => {
    return faker.internet.email({ firstName: ctx.firstName, lastName: ctx.secondeName });
  },
  address: addressModel,
  children: {
    // Self-reference: use the registered model name "user" (not userModel)
    refModel: 'user',
    // Control recursion depth for the tree
    deep: 3,
  },
});

const userDatas = fakeData(userModel);
console.dir(userDatas, { depth: Infinity });
```

The generated tree-structured data will look like this:

```json{8,15,22,29}
{
  "id": 3104367534645508,
  "firstName": "Emmie",
  "secondeName": "Goyette-Sporer",
  "age": 48,
  "hobby": ["Badminton", "Basketball", "Table Tennis"],
  "address": { "country": "Chile", "city": "Samirbury" },
  "children": {
    "id": 6711551880453162,
    "firstName": "Evelyn",
    "secondeName": "Rau",
    "age": 25,
    "hobby": ["Table Tennis", "Basketball", "Football"],
    "address": { "country": "Sweden", "city": "South Rod" },
    "children": {
      "id": 7905722737546825,
      "firstName": "Haley",
      "secondeName": "Glover",
      "age": 63,
      "hobby": ["Basketball", "Badminton", "Table Tennis", "Football"],
      "address": { "country": "Ukraine", "city": "Port Terrell" },
      "children": {
        "id": 3203661997548607,
        "firstName": "Cleta",
        "secondeName": "Bahringer",
        "age": 41,
        "hobby": ["Badminton", "Table Tennis"],
        "address": { "country": "Fiji", "city": "Maggiotown" },
        "children": null, // Recursion stops at depth 3
        "email": "Cleta_Bahringer@gmail.com"
      },
      "email": "Haley_Glover@gmail.com"
    },
    "email": "Evelyn_Rau95@yahoo.com"
  },
  "email": "Emmie.Goyette-Sporer@gmail.com"
}
```

::: tip About Recursion Depth
When using self-references, the default recursion depth is `1`. You can control the depth via the `deep` property—setting it to `0` disables recursion entirely. For more information on configuration options, refer to [Data References](/en/Data-References.md)
:::

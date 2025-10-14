# Data Models

## Introduction

To facilitate template reuse, `DataFaker` encapsulates data templates into **models**. Based on models, we can better reuse the data templates we define, allowing us to adapt to changing requirements at the lowest cost.

## Defining a Model

You can define a model using the `defineModel` function, which requires two parameters:

- **Parameter 1**: Model alias (unique identifier for the model)
- **Parameter 2**: Model template (the data structure definition)

```ts
const userModel = defineModel('user', {});
```

After defining a model with the `defineModel` function, the model is injected into the model factory. You can then:

- Generate data based on this model
- Perform operations like cloning the model, adding fields, or deleting fields

## Cloning a Model

Use the `cloneModel` function to clone an existing model. It requires two parameters:

- **Parameter 1**: Alias for the new cloned model
- **Parameter 2**: The original model object to clone

For example, we can clone the `userModel` to create a "student model" and name its alias `student`:

```ts {2,17-19}
// User model
const userModel = defineModel('user', {
  id: 'number.int',
  firstName: 'person.firstName',
  secondName: 'person.lastName',
  age: ['number.int', { min: 18, max: 65 }],
  email: ctx => {
    return faker.internet.email({ firstName: ctx.firstName, lastName: ctx.secondName });
  },
  children: {
    refModel: 'user',
    // Control recursion depth for self-reference
    deep: 1,
  },
});

// Clone to create a student model
const studentModel = cloneModel('student', userModel);
const studentDatas = fakeData(studentModel);
console.dir(studentDatas, { depth: Infinity });
```

The generated data will look like this:

```json
{
  "id": 6584695714108738,
  "firstName": "Jane",
  "secondName": "Wisoky",
  "age": 21,
  "children": {
    "id": 390307445727788,
    "firstName": "Addie",
    "secondName": "Koch",
    "age": 62,
    "children": {
      "id": 6872368248204444,
      "firstName": "Alexandra",
      "secondName": "Powlowski",
      "age": 29,
      "children": null,
      "email": "Alexandra.Powlowski16@hotmail.com"
    },
    "email": "Addie_Koch@hotmail.com"
  },
  "email": "Jane_Wisoky27@gmail.com"
}
```

::: tip Deep Cloning
Model cloning uses **deep cloning**—reference types are not just cloned by reference (i.e., nested objects/arrays are fully duplicated, not linked to the original model).
:::

## Adding/Overwriting Fields

You can dynamically add or overwrite fields for an existing model.

### Adding a Single Field

Use the `withProperty` function to add or overwrite one field. It accepts two parameters:

- **Parameter 1**: Field name
- **Parameter 2**: Field value (supports predefined types, getter functions, or references)

For example, we can add a "hobby" field to the cloned `studentModel`:

```ts {19}
// User model
const userModel = defineModel('user', {
  id: 'number.int',
  firstName: 'person.firstName',
  secondName: 'person.lastName',
  age: ['number.int', { min: 18, max: 65 }],
  email: ctx => {
    return faker.internet.email({ firstName: ctx.firstName, lastName: ctx.secondName });
  },
  children: {
    refModel: 'user',
    // Control recursion depth for self-reference
    deep: 1,
  },
});

// Clone to create a student model
const studentModel = cloneModel('student', userModel);
// Add a "hobby" field
studentModel.withProperty('hobby', ['helpers.arrayElements', ['Basketball', 'Football', 'Table Tennis', 'Badminton']]);
const studentDatas = fakeData(studentModel);
console.dir(studentDatas, { depth: Infinity });
```

The generated student data will now include the "hobby" field:

```json {21}
{
  "id": 4686280253521772,
  "firstName": "Kelton",
  "secondName": "Veum",
  "age": 50,
  "children": {
    "id": 5161302098209435,
    "firstName": "Jewell",
    "secondName": "Quigley",
    "age": 33,
    "children": {
      "id": 1378172277935689,
      "firstName": "Eula",
      "secondName": "Stehr",
      "age": 31,
      "children": null,
      "email": "Eula.Stehr1@hotmail.com"
    },
    "email": "Jewell.Quigley45@gmail.com"
  },
  "hobby": ["Badminton", "Basketball"],
  "email": "Kelton.Veum@yahoo.com"
}
```

### Adding Multiple Fields

Use the `withProperties` function to add or overwrite multiple fields at once. It accepts an **object** as a parameter, where each key-value pair represents a field.

```ts {24-30}
const addressModel = defineModel('address', {
  country: 'location.country',
  city: 'location.city',
});

// User model
const userModel = defineModel('user', {
  id: 'number.int',
  firstName: 'person.firstName',
  secondName: 'person.lastName',
  age: ['number.int', { min: 18, max: 65 }],
  email: ctx => {
    return faker.internet.email({ firstName: ctx.firstName, lastName: ctx.secondName });
  },
  children: {
    refModel: 'user',
    // Control recursion depth for self-reference
    deep: 1,
  },
});

// Clone to create a student model
const studentModel = cloneModel('student', userModel);
// Add a "hobby" field
studentModel.withProperty('hobby', ['helpers.arrayElements', ['Basketball', 'Football', 'Table Tennis', 'Badminton']]);
// Add multiple fields
studentModel.withProperties({
  firstName: () => {
    return `__${faker.person.firstName()}`; // Prefix first name with "__"
  },
  address: addressModel, // Reference the address model
});

const studentDatas = fakeData(studentModel);
console.dir(studentDatas, { depth: Infinity });
```

The generated data will include the newly added fields:

```json {20-23}
{
  "id": 1024531893968573,
  "secondName": "Hamill",
  "age": 30,
  "children": {
    "id": 4928359344459900,
    "firstName": "Myrtle",
    "secondName": "Schmidt",
    "age": 23,
    "children": {
      "id": 3849344663190874,
      "firstName": "Syble",
      "secondName": "Gerlach",
      "age": 23,
      "children": null,
      "email": "Syble.Gerlach81@gmail.com"
    },
    "email": "Myrtle.Schmidt@hotmail.com"
  },
  "hobby": ["Football"],
  "address": { "country": "San Marino", "city": "West Haven" },
  "firstName": "__Dell",
  "email": "__Dell.Hamill43@yahoo.com"
}
```

::: tip Field Overwriting
Notice that the original `firstName` field is overwritten to `__firstName` (with a "\_\_" prefix). However:

- The `children` field (a reference type) is **not overwritten**—it still references the original `userModel` (not the cloned `studentModel`).
- To overwrite reference-type fields like `children`, use `withProperty` to redefine the field with the new model.
  :::

## Deleting Fields

### Deleting a Single Field

Use the `excludeProperty` function to delete one field. It accepts only one parameter: the **name of the field to delete**.

```ts {18-19}
// User model
const userModel = defineModel('user', {
  id: 'number.int',
  firstName: 'person.firstName',
  secondName: 'person.lastName',
  age: ['number.int', { min: 18, max: 65 }],
  email: ctx => {
    return faker.internet.email({ firstName: ctx.firstName, lastName: ctx.secondName });
  },
  children: {
    refModel: 'user',
    // Control recursion depth for self-reference
    deep: 1,
  },
});

// Clone to create a student model
const studentModel = cloneModel('student', userModel);
// Delete the "children" field
studentModel.excludeProperty('children');
const studentDatas = fakeData(studentModel);
console.dir(studentDatas, { depth: Infinity });
```

The generated data will no longer include the `children` field:

```json
{
  "id": 4505418375002445,
  "firstName": "Linwood",
  "secondName": "Jones",
  "age": 34,
  "email": "Linwood.Jones@gmail.com"
}
```

### Deleting Multiple Fields

Use the `excludeProperties` function to delete multiple fields. It accepts an **array** as a parameter, where each element is the name of a field to delete.

```ts {21-22}
// User model
const userModel = defineModel('user', {
  id: 'number.int',
  firstName: 'person.firstName',
  secondName: 'person.lastName',
  age: ['number.int', { min: 18, max: 65 }],
  email: ctx => {
    return faker.internet.email({ firstName: ctx.firstName, lastName: ctx.secondName });
  },
  children: {
    refModel: 'user',
    // Control recursion depth for self-reference
    deep: 1,
  },
});

// Clone to create a student model
const studentModel = cloneModel('student', userModel);
studentModel.excludeProperty('children');
// Delete multiple fields
studentModel.excludeProperties(['secondName', 'age']);
const studentDatas = fakeData(studentModel);
console.dir(studentDatas, { depth: Infinity });
```

The generated data will no longer include the `secondName` and `age` fields:

```json
{
  "id": 2867275153560177,
  "firstName": "Kirstin",
  "email": "Kirstin.Spinka@yahoo.com"
}
```

## Best Practices

### Clone First, Then Add/Overwrite Fields

When adding or overwriting fields, first define a "prototype model" (e.g., `userModel`), then clone it to create a new model (e.g., `studentModel`), and finally modify the cloned model. This avoids affecting other models or scenarios that depend on the original prototype model.

### Chained Programming

Model objects support **chained programming**, so you can write concise code like this:

```ts
const studentModel = cloneModel('student', userModel)
  .excludeProperty('children')
  .excludeProperties(['secondName', 'age']);
```

This is equivalent to:

```ts
const studentModel = cloneModel('student', userModel);
studentModel.excludeProperty('children');
studentModel.excludeProperties(['secondName', 'age']);
```

# Decorator Syntax

## Basic Concepts

To better support TypeScript, `DataFaker` introduces decorator syntax, which is essentially syntactic sugar for `defineModel`. Its original design intention is to maintain compatibility between existing classes and models.

## Basic Usage

For example, suppose a project already has two classes `User` and `Address` serving as TypeScript types:

```ts
class Address {
  declare city: string;
  declare children: Address[];
}
// User class
class User {
  declare id: string;
  declare firstName: string;
  declare secondName: string;
  declare age: number;
  declare email: string;
  declare address: Address;
  declare children: User[];
}
```

To utilize these two classes instead of redefining data models with `defineModel`, you can use decorator syntax to define the existing type classes as `User` and `Address` data models.

- Use the `@DataModel` decorator to define a data model, which accepts a model alias as a parameter.
- Use the `@DataField` decorator to define fields, consistent with field definitions in [Template Syntax](/en/template-syntax).

As shown below:

::: code-group

```ts [Code]
@DataModel('address')
class Address {
  @DataField('location.city')
  declare city: string;
  @DataField({ refModel: 'address', count: 1, deep: 1 })
  declare children: Address[];
}
@DataModel('user')
class User {
  @DataField('string.uuid')
  declare id: string;
  @DataField('person.firstName')
  declare firstName: string;
  @DataField('person.lastName')
  declare secondName: string;
  @DataField(['number.int', { min: 18, max: 65 }])
  declare age: number;
  @DataField(ctx => {
    return faker.internet.email({ firstName: ctx.firstName, lastName: ctx.secondName });
  })
  declare email: string;
  @DataField({ refModel: 'address', count: 1 })
  declare address: Address;
  @DataField({ refModel: 'user', deep: 1, count: 1 })
  declare children: User[];
}
const userDatas = fakeData('user', 2);
console.dir(userDatas, { depth: Infinity });
```

```ts [Result]
[
  {
    id: 'b8e8ade6-5f37-43d9-b512-4ba0395e5975',
    firstName: 'Cecile',
    secondName: 'MacGyver',
    age: 24,
    address: { city: 'Leviland', children: { city: 'North Georgianna' } },
    children: {
      id: 'f29ea63b-ac69-4832-9586-b82b17f2d40b',
      firstName: 'Floyd',
      secondName: 'Flatley',
      age: 57,
      address: { city: 'Lake Anissa', children: { city: 'North Beverlyshire' } },
      email: 'Floyd.Flatley@hotmail.com',
    },
    email: 'Cecile_MacGyver34@yahoo.com',
  },
  {
    id: '3647b033-470d-40f3-adf9-836df66f7eef',
    firstName: 'Evangeline',
    secondName: 'Kerluke',
    age: 23,
    address: { city: 'Raynorland', children: { city: 'West Rosetta' } },
    children: {
      id: '350c4642-761f-4b36-a6cf-5b1bcf35edcb',
      firstName: 'Aurelio',
      secondName: 'Kuvalis',
      age: 64,
      address: { city: 'Florence-Graham', children: { city: 'New Brock' } },
      email: 'Aurelio_Kuvalis61@yahoo.com',
    },
    email: 'Evangeline.Kerluke@yahoo.com',
  },
];
```

:::

::: tip The Nature of Decorators
Decorators are essentially syntactic sugar for `defineModel`. They only encapsulate class definitions without altering the original class structure or behavior.
:::

## Model Inheritance Based on Class Inheritance

`DataFaker` offers even more power. As introduced earlier, to reuse models, you can clone a model and then add or remove its fields. For example:

```ts
const userModel = defineModel('user', {});
cloneModel('cloneUser', userModel).withProperty('age', { type: 'number.int', min: 18, max: 65 });
```

Now, decorator syntax enables more convenient model inheritance—simply use native class inheritance without any modifications. As shown below, the `User` class inherits the `email` and `children` fields from the `Person` class data model:

::: code-group

```ts [Code] {2,11}
@DataModel('person')
class Person {
  @DataField(ctx => {
    return faker.internet.email({ firstName: ctx.firstName, lastName: ctx.secondName });
  })
  declare email: string;
  @DataField({ refModel: 'user', deep: 1, count: 1 })
  declare children: User[];
}
@DataModel('user')
class User extends Person {
  @DataField('string.uuid')
  declare id: string;
  @DataField('person.firstName')
  declare firstName: string;
  @DataField('person.lastName')
  declare secondName: string;
  @DataField(['number.int', { min: 18, max: 65 }])
  declare age: number;
}
const userDatas = fakeData('user', 2);
console.dir(userDatas, { depth: Infinity });
```

```ts [Result] {3-9,14,17-23,28}
[
  {
    children: {
      id: '01beb5dd-d2f8-4602-a4f6-4304d49b1532',
      firstName: 'Anjali',
      secondName: 'Murphy',
      age: 51,
      email: 'Anjali.Murphy@hotmail.com',
    },
    id: '041980c6-164a-4fad-81a2-65a3f9c64359',
    firstName: 'Kristy',
    secondName: 'Ledner',
    age: 62,
    email: 'Kristy_Ledner30@yahoo.com',
  },
  {
    children: {
      id: '2df47ecb-186e-4d9b-a417-4b62dd4906d0',
      firstName: 'Jody',
      secondName: 'Schmeler',
      age: 18,
      email: 'Jody_Schmeler@hotmail.com',
    },
    id: '26450cf7-f190-44dc-ab1b-6ff0faf8e74b',
    firstName: 'Nathanial',
    secondName: 'Schaden',
    age: 19,
    email: 'Nathanial.Schaden96@gmail.com',
  },
];
```

:::

## Manipulating Models

Sometimes you may prefer to manipulate data models directly rather than using class-based model inheritance. `DataFaker` provides the `useModel` method to retrieve native models, as shown below:

```ts
@DataModel('person')
class Person {
  @DataField(ctx => {
    return faker.internet.email({ firstName: ctx.firstName, lastName: ctx.secondName });
  })
  declare email: string;
  @DataField({ refModel: 'person', deep: 1, count: 1 })
  declare children: User[];
}
@DataModel('user')
class User {
  @DataField('string.uuid')
  declare id: string;
  @DataField('person.firstName')
  declare firstName: string;
  @DataField('person.lastName')
  declare secondName: string;
  @DataField(['number.int', { min: 18, max: 65 }])
  declare age: number;
}
// Retrieve user and person models
const userModel = useModel(User);
const personModel = useModel('person');
// Add a 'sex' field to the user model
userModel?.withProperties({
  sex: 'person.sex',
});
const userDatas = fakeData(userModel, 2);
const personDatas = fakeData(personModel, 2);
// Generate data
console.dir(userDatas, { depth: Infinity });
console.dir(personDatas, { depth: Infinity });
```

The results are as follows:

::: tip Prototype-Based Inheritance
You might wonder if directly manipulating `userModel` would affect `personModel`. `DataFaker` addresses this by using prototype-based inheritance for data models, with property shadowing. Properties added to `userModel` will not affect `personModel`, so no need to worry.
:::

```ts {8,15}
// userDatas
[
  {
    id: 'de3a6b97-a5e4-4486-9a24-4a37d4e73f40',
    firstName: 'Roel',
    secondName: 'Marks',
    age: 49,
    sex: 'female',
  },
  {
    id: '007224af-3495-4a3b-9eba-6456fca749d5',
    firstName: 'Yvette',
    secondName: 'Walker',
    age: 47,
    sex: 'male',
  },
][
  // personDatas
  ({
    children: { email: 'Zachery12@gmail.com' },
    email: 'Alessandra.Kohler@hotmail.com',
  },
  {
    children: { email: 'Eladio_Doyle@yahoo.com' },
    email: 'Shanny.Towne@yahoo.com',
  })
];
```

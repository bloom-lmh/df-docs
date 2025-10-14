# Data References

## Basic Concepts

In the previous "Template Syntax" section, we learned how to use referenced data in templates:

```ts
{
  Field: {
    refModel: 'Model Name' | Model Object;
    // Number of entries to generate
    count?: number;
    // Recursion depth (for self-references)
    deep?: number;
  },
  // Shorthand: count and deep default to 1 if not specified
  Field: 'Model Name' | Model Object
}
```

This section will cover advanced usage of referenced data.

## Default Configuration

When referencing data in a template, you can specify the **number of entries** and **recursion depth** for the referenced data. The generated data will follow these settings.

### Number of Entries

```ts {10}
const addressModel = defineModel('address', {
  country: 'location.country',
  city: 'location.city',
});

// User model
const userModel = defineModel('user', {
  firstName: 'person.firstName',
  secondName: 'person.lastName',
  age: ['number.int', { min: 18, max: 65 }],
  address: { refModel: 'address', count: 2 }, // Generate 2 address entries
});

const userDatas = fakeData(userModel);
console.dir(userDatas, { depth: Infinity });
```

In the example above, we set the `count` property of the `address` field to `2`. As a result, the `address` field in `userDatas` will contain 2 address entries. The generated data looks like this:

```ts {6-7}
{
  firstName: 'Anibal',
  secondName: 'Douglas-Crooks',
  age: 62,
  address: [
    { country: 'Hungary', city: 'Emoryton' },
    { country: 'Venezuela', city: 'New Marcelfurt' }
  ]
}
```

### Recursion Depth

For self-referential scenarios (e.g., generating tree-structured data), you must specify a recursion depth. Without this limit, infinite recursion could cause a stack overflow.

```ts {4-8,16-19}
const addressModel = defineModel('address', {
  country: 'location.country',
  city: 'location.city',
  children: {
    refModel: 'address', // Self-reference the address model
    count: 2, // Generate 2 child entries per level
    deep: 1, // Recurse 1 level deep
  },
});

// User model
const userModel = defineModel('user', {
  firstName: 'person.firstName',
  secondName: 'person.lastName',
  age: ['number.int', { min: 18, max: 65 }],
  address: { refModel: 'address', count: 2 }, // Generate 2 address entries
  children: {
    refModel: 'user', // Self-reference the user model
    deep: 2, // Recurse 2 levels deep
  },
});

const userDatas = fakeData(userModel);
console.dir(userDatas, { depth: Infinity });
```

In this example, both `address` and `user` models use self-references:

- The `address` model is configured with `deep: 1`
- The `user` model is configured with `deep: 2`

We also specified the number of entries to generate. The resulting data is structured as follows:

```json
{
  "firstName": "Lydia",
  "secondName": "Adams",
  "age": 41,
  "address": [
    // First address entry
    {
      "country": "Democratic Republic of the Congo",
      "city": "Elisefurt",
      // 1 level of recursion for children
      "children": [
        {
          "country": "Nauru",
          "city": "Randalltown"
        },
        {
          "country": "Afghanistan",
          "city": "Commerce City"
        }
      ]
    },
    // Second address entry
    {
      "country": "Ecuador",
      "city": "Hamillworth",
      "children": [
        {
          "country": "Reunion",
          "city": "West Greysonland"
        },
        {
          "country": "Italy",
          "city": "Hempstead"
        }
      ]
    }
  ],
  // 1st level of user children
  "children": {
    "firstName": "Lisette",
    "secondName": "Gutmann",
    "age": 29,
    "address": [
      {
        "country": "Syrian Arab Republic",
        "city": "Leuschkefield",
        "children": [
          {
            "country": "Austria",
            "city": "Hammesstad"
          },
          {
            "country": "Barbados",
            "city": "West Elodyfort"
          }
        ]
      },
      {
        "country": "Colombia",
        "city": "Fort Anastasia",
        "children": [
          {
            "country": "Czechia",
            "city": "Hyattfort"
          },
          {
            "country": "Zambia",
            "city": "West Stefanieborough"
          }
        ]
      }
    ],
    // 2nd level of user children (max depth reached)
    "children": {
      "firstName": "Rex",
      "secondName": "Farrell",
      "age": 22,
      "address": [
        {
          "country": "El Salvador",
          "city": "Montyshire",
          "children": [
            {
              "country": "Bangladesh",
              "city": "Port Prince"
            },
            {
              "country": "Svalbard & Jan Mayen Islands",
              "city": "South Siennacester"
            }
          ]
        },
        {
          "country": "Panama",
          "city": "Monterey Park",
          "children": [
            {
              "country": "Vietnam",
              "city": "South Scotworth"
            },
            {
              "country": "Mozambique",
              "city": "Matildeside"
            }
          ]
        }
      ]
    }
  }
}
```

## Runtime Configuration

In some cases, you may want to override the default template configuration for referenced data. You can directly configure reference rules in the **second parameter of the `fakeData` function**. This runtime configuration takes precedence over the default template settings.

The type definition for runtime reference rules is as follows:

```ts
type RefModelRule = {
  /**
   * Number of entries to generate
   */
  [COUNT]?: number;
  /**
   * Recursion depth for self-references
   */
  [DEEP]?: number;

  /**
   * Structural recursion configuration (for nested references)
   */
  [key: string | symbol]: number | RefModelRule | [number, number];
};
```

::: tip `[COUNT]` and `[DEEP]`
To avoid property name conflicts, `DataFaker` provides two `symbol` properties: `COUNT` and `DEEP`. They represent the configuration for "number of entries" and "recursion depth", respectively. Other properties in `RefModelRule` are used for configuring nested structural recursion.
:::

```ts {3-8,16-20,23-36}
const addressModel = defineModel('address', {
  country: 'location.country',
  city: 'location.city',
  children: {
    refModel: 'address',
    count: 2, // Default: generate 2 child entries
    deep: 1, // Default: 1 level of recursion
  },
});

// User model
const userModel = defineModel('user', {
  firstName: 'person.firstName',
  secondName: 'person.lastName',
  age: ['number.int', { min: 18, max: 65 }],
  address: { refModel: 'address', count: 2 }, // Default: generate 2 addresses
  children: {
    refModel: 'user',
    deep: 2, // Default: 2 levels of recursion
    count: 2, // Default: generate 2 child entries
  },
});

// Override default config with runtime settings
const userDatas = fakeData(userModel, {
  refRules: {
    // Runtime config for the "address" reference:
    // 1. Generate 1 address entry
    // 2. Generate 1 child entry for address.children
    address: {
      [COUNT]: 1,
      children: {
        [COUNT]: 1,
      },
    },
    // Runtime config for the "children" self-reference:
    // 1. Recurse 1 level deep (override default 2)
    // 2. Generate 1 child entry (override default 2)
    // 3. Inherit the address config above for nested address references
    children: {
      [DEEP]: 1,
      [COUNT]: 1,
    },
  },
});

console.dir(userDatas, { depth: Infinity });
```

In the example above, the runtime configuration enforces:

1. The `address` reference generates **1 entry**, and its nested `address.children` (self-reference) generates **1 entry**.
2. The `user.children` self-reference uses **1 level of recursion** and generates **1 entry**, and inherits the runtime `address` config for its nested `address` field.

The generated data will look like this:

```json
{
  "firstName": "Jeremy",
  "secondName": "Hettinger",
  "age": 50,
  // Runtime config: 1 address entry
  "address": {
    "country": "Cayman Islands",
    "city": "Orlandoview",
    // Runtime config: 1 child entry (address.children)
    "children": { "country": "Dominica", "city": "Boynton Beach" }
  },
  // Runtime config: 1 level of recursion, 1 child entry
  "children": {
    "firstName": "Sigrid",
    "secondName": "Kassulke",
    "age": 62,
    // Inherits runtime address config: 1 address entry, 1 child entry
    "address": {
      "country": "Turkmenistan",
      "city": "Anthonyborough",
      "children": { "country": "French Guiana", "city": "Schaumburg" }
    }
  }
}
```

## Configuration Priority

As demonstrated in the examples above, the priority of configurations follows this order:  
**Runtime Configuration > Template Default Configuration**

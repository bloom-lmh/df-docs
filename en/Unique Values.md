# Unique Values

Generally speaking, `DataFaker` methods do not return unique values. However, some methods and locales use significantly smaller datasets than others. For instance, `faker.animal.type` has only 44 possible animal types to choose from. In contrast, `faker.person.fullName()` draws from lists of hundreds of first names, last names, and prefixes/suffixes, allowing it to generate hundreds of thousands of unique names. Even so, the **birthday paradox** means that duplicate values will be generated before long.

Therefore, there are times when you may want to generate unique values. For example, you might want unique values in a database email column. There are several possible strategies to achieve this:

1. If you want to generate all values at once, use `faker.helpers.uniqueArray()`. For example:

```ts
faker.helpers.uniqueArray(faker.internet.email, 1000); // will generate 1000 unique email addresses
```

2. If the available values are insufficient for your needs, consider using your own sequential values as a prefix or suffix. For example, you can sequentially add `1.`, `2.`, etc., to the prefix of each generated email.
3. Build your own logic to keep track of a set of previously generated values, and regenerate values as needed when duplicates are produced.
4. Use third-party packages to enforce uniqueness, such as `enforce-unique` or `@dpaskhin/unique`.

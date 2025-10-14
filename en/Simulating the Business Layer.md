# Simulating the Business Layer

> This feature is a vision for the future and may be implemented in the next version.

Its primary goal is to address the lack of logic in simulated data. Most data mocking tools on the market do not incorporate the concept of logic. In future development, we will introduce the function of simulating the business layer, similar to how `MyBatis-Plus` works:

```ts
// Note: The following functions are only conceptual
const userTable = defineTable({}, 10);
userTable.insert({ name: 'Zhang San', age: 20 });
userTable.updateById(1, { name: 'Li Si' });
```

Stay tuned!

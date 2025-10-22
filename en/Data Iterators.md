# Data Iterator

## What is a Data Iterator

The data iterator is designed to help you sequentially use data from a collection when generating data, simplifying your code. For example, consider the following scenario:

> Need to generate 3 user data entries, each with different hobbies.

Using the traditional `faker.js` approach, the code would look like this:

```javascript{2,6}
let hobbyArr = ['basketball', 'soccer', 'table tennis'];
let index = 0;
const userModel = defineModel('user', {
  id: 'string.uuid',
  hobby: () => {
    return hobbyArr[index++];
  },
});
console.log(fakeData(userModel, 4));
```

The generated data would be:

```json
[
  { "id": "d16e7a49-5e7a-40a0-97e7-68693ffa7268", "hobby": "basketball" },
  { "id": "268a6a63-5eee-4668-a166-d1b9f8bcf510", "hobby": "soccer" },
  { "id": "2ed907c6-0cdf-40bd-95cf-6aaf3ebe5d1c", "hobby": "table tennis" },
  { "id": "7d9b0df7-7fd3-401d-a7a9-59759a0948b4", "hobby": undefined }
]
```

As you can see, you need to manually maintain the `index` variable, which is inconvenient and prone to confusion with other `index` variables. To address this, `DataFaker` provides an iterator that allows you to sequentially use data from a collection. Here's how it works:

```javascript {2,6}
let hobbyArr = ['basketball', 'soccer', 'table tennis'];
const iterator = IteratorFactory.getIterator(hobbyArr);
const userModel = defineModel('user', {
  id: 'string.uuid',
  hobby: () => {
    return iterator.next().value;
  },
});
console.log(fakeData(userModel, 4));
```

## Four Types of Data Iterators

`DataFaker` provides four types of data iterators, which can be obtained from the iterator factory `IteratorFactory`:

- Forward Iterator: `IteratorFactory.getIterator()`
- Reverse Iterator: `IteratorFactory.getReverseIterator()`
- Loop Forward Iterator: `IteratorFactory.getLoopIterator()`
- Loop Reverse Iterator: `IteratorFactory.getLoopReverseIterator()`

These iterators can accept two parameters:

1. Collection: Can be an array, object, or Set.
2. Consumer Function: Specifies how to process the data during each iteration.

::: warning Note
For objects and Sets, the iterator converts them into tuples for iteration. For example:

```javascript
const obj = {a: 1, b: 2, c: 3};
=> Converts to: [["a", 1], ["b", 2], ["c", 3]]
```

:::

Below are demonstrations of the forward iterator and loop reverse iterator:

### Forward Iterator

```javascript
// Pass an array to get a forward iterator
let hobbyArr = ['basketball', 'soccer', 'table tennis'];
const iterator = IteratorFactory.getIterator(hobbyArr);
const userModel = defineModel('user', {
  id: 'string.uuid',
  hobby: () => {
    return iterator.next().value;
  },
});
console.log(fakeData(userModel, 4));
```

The forward iterator does not loop by default. For example, since `hobbyArr` only has 3 items and does not loop, the 4th data entry will be `undefined`.

```json {5}
[
  { "id": "d16e7a49-5e7a-40a0-97e7-68693ffa7268", "hobby": "basketball" },
  { "id": "268a6a63-5eee-4668-a166-d1b9f8bcf510", "hobby": "soccer" },
  { "id": "2ed907c6-0cdf-40bd-95cf-6aaf3ebe5d1c", "hobby": "table tennis" },
  { "id": "7d9b0df7-7fd3-401d-a7a9-59759a0948b4", "hobby": undefined }
]
```

### Loop Reverse Iterator

The loop reverse iterator:

```javascript {1-4,8-9}
// Pass a Map collection
let hobbyMap = new Map().set('h1', 'basketball').set('h2', 'soccer').set('h3', 'table tennis');
// Get a loop reverse iterator
const loopReverseIterator = IteratorFactory.getLoopReverseIterator(hobbyMap);
const userModel = defineModel('user', {
  id: 'string.uuid',
  reverseloopHobby: () => {
    // Each value is an array, where the first element is the key and the second is the value
    return loopReverseIterator.next().value[1];
  },
});
console.log(fakeData(userModel, 6));
```

The result is a loop that iterates through each `value` in the `Map` collection, generating 6 data entries.

```json {4,16}
[
  {
    "id": "418b79fc-acc5-4f94-8a2b-c23c9888d58c",
    "reverseloopHobby": "table tennis"
  },
  {
    "id": "5e58c037-8bff-4bed-84e1-959bdcbf8836",
    "reverseloopHobby": "soccer"
  },
  {
    "id": "9241aa2f-48f0-4a5b-9a06-c86213b8850c",
    "reverseloopHobby": "basketball"
  },
  {
    "id": "3f044540-7f82-465a-a9d4-61df2c065979",
    "reverseloopHobby": "table tennis"
  },
  {
    "id": "ef564926-9446-4bd2-b3eb-ac320cace7e4",
    "reverseloopHobby": "soccer"
  },
  {
    "id": "21f88c20-ebbc-4fd7-bcc2-3b6e63d1935f",
    "reverseloopHobby": "basketball"
  }
]
```

## Consumer Pattern

`DataFaker` uses the consumer pattern in iterators. You can pass a function in advance to process the data during each iteration or pass a function during each iteration to process the data.

### Unified Processing Function

You can pass a unified processing function when obtaining the iterator. This function will be called during each iteration to process the data.

```javascript {1-4,8-9}
let hobbyMap = new Map().set('h1', 'basketball').set('h2', 'soccer').set('h3', 'table tennis');
// Pass a unified processing function that directly returns the value
const loopReverseIterator = IteratorFactory.getLoopReverseIterator(hobbyMap, item => {
  return item[1];
});
const userModel = defineModel('user', {
  id: 'string.uuid',
  reverseloopHobby: () => {
    // No need to use value[1] anymore, as the unified processing function has handled it
    return loopReverseIterator.next().value;
  },
});
console.log(fakeData(userModel, 6));
```

The generated result is:

```json
[
  {
    "id": "df991693-6303-4116-9bf5-171f67d20aa2",
    "reverseloopHobby": "table tennis"
  },
  {
    "id": "27db5a7d-10fb-4beb-bd5c-650a99470bd9",
    "reverseloopHobby": "soccer"
  },
  {
    "id": "93aacfe6-af38-4fda-aac1-b3e76e8bd269",
    "reverseloopHobby": "basketball"
  },
  {
    "id": "644dddf9-b1c1-43ed-97b8-d81eed32bc7f",
    "reverseloopHobby": "table tennis"
  },
  {
    "id": "b08fb3a8-aba5-4a48-b694-211fea09a9b1",
    "reverseloopHobby": "soccer"
  },
  {
    "id": "8bb61d87-3925-4420-9376-3e9ede2bdf31",
    "reverseloopHobby": "basketball"
  }
]
```

### Iteration-Time Processing Function

Alternatively, you can pass a processing function during each iteration. This function will be called to process the data during each iteration. This has higher priority than the unified processing function but only takes effect from the second iteration onward.

```javascript {1-5,10-12}
let hobbyMap = new Map().set('h1', 'basketball').set('h2', 'soccer').set('h3', 'table tennis');
// Pass a unified processing function
const loopReverseIterator = IteratorFactory.getLoopReverseIterator(hobbyMap, item => {
  return item[1];
});
const userModel = defineModel('user', {
  id: 'string.uuid',
  reverseloopHobby: () => {
    // This function will be called during each iteration to process the data (higher priority than the unified processing function, but takes effect from the second iteration)
    return loopReverseIterator.next((item, i) => {
      return item[1] + `${i}`;
    }).value;
  },
});
console.log(fakeData(userModel, 6));
```

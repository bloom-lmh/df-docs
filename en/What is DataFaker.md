# What is DataFaker?

## Introduction

`DataFaker` is a mock data generator that is built on top of `faker.js` (as its underlying dependency). It extends `faker.js` with template syntax and decorator syntax, enabling you to quickly define various types of data models and generate scenario-specific data—including referenced data and recursive data. This meets your data generation needs across different scenarios. It is particularly suitable for the following use cases:

- Mock data for front-end development
- Unit testing and integration testing
- API interface prototyping
- Database sample data generation
- Demonstration and teaching use cases

[A Tribute to faker.js](https://faker.nodejs.cn/guide/)

## Features

- **Non-intrusive**: `DataFaker` only enhances `faker.js` without making modifications to it. You can still use `faker.js` the way you did before.
- **Template syntax**: `DataFaker` defines data structures in the form of templates, similar to defining database table structures. Each data template is a `schema`.
- **Model-oriented**: `DataFaker` encapsulates templates into models, using models as the basic unit. It provides a model reuse mechanism, allowing your data templates to be reused at minimum cost.
- **Context mechanism**: `DataFaker` adopts a context mechanism to maintain the correlation between different data points.
- **Multi-language support**: Leveraging the underlying capabilities of `faker.js`, `DataFaker` supports more than 70 language environments and multiple configuration methods.
- **Multi-data source**: With the help of `faker.js`'s underlying database, `DataFaker` has 26 preset categories covering over 300 types of data.
- **Hook functions**: `DataFaker` provides four types of hook functions, allowing you to modify the way data is generated during the data generation process.
- **Configurable**: `DataFaker` supports multiple personalized configuration methods.

## Database

By leveraging `faker.js`'s underlying database, `DataFaker` can generate data across 26 categories, including animals, books, and more. The following example shows flight information data:

```json
 // Airline Module
'airline.aircraftType'
'airline.airline'
'airline.airplane'
'airline.airport'
'airline.flightNumber'
'airline.recordLocator'
'airline.seat'
```

For more preset data, please refer to the [API](/en/Preset-Data.md) (Note: The original Chinese path "/zh/预设数据.md" is adjusted to the English path convention here; retain the original path if the English version uses the same Chinese path)

## Language Environments

Benefiting from `faker.js`'s robust language environment support, `DataFaker` currently supports more than 70 language environments. For details, please refer to the [Multi-language Section](/en/Multi-language.md) (Note: Similarly, the path is adjusted to the English path convention; keep the original if the English documentation uses the Chinese path)

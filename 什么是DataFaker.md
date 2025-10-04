# 什么是 DataFaker？

## 简介

`DataFaker` 是一个数据生成器，底层依赖 `faker.js`，并在之上扩展了模板语法，能够帮助你快速生成各类的数据，包括引用数据和递归数据，满足你不同场景下各类数据的生成需求。它特别适用于以下场景：

- 前端开发中的模拟数据
- 单元测试和集成测试
- API 接口原型设计
- 数据库样本数据生成
- 演示和教学用例

[致敬 faker.js](https://faker.nodejs.cn/guide/)

## 特性

- 无侵入：`DataFaker` 对`faker.js`只做增强不做修改，你仍然可以像以前那样使用 `faker.js`
- 模板化：`DataFaker`以模板的方式来定义数据结构，就像定义数据库表结构那样
- 面向模型：`DataFaker`将模板封装为了模型，以模型为基本单元，提供了模型复用机制，让你的数据模板可在多处复用
- 上下文机制：`DataFaker`采用上下文机制保持数据之间的关联性
- 多语言：`DataFaker`底层依托`faker.js`，其同样也支持 `70` 多种语言环境
- 多数据源：`DataFaker` 借助了 `faker.js` 的底层数据库，能够生成涵盖动物、书本等 `26` 类数据
- 可配置：`DataFaker` 支持个性化配置方式

## 数据库

`DataFaker` 借助了 `faker.js` 的底层数据库，能够生成涵盖动物、书本等 26 类数据，如下所示：

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

## 语言环境

得益于 `faker.js` 的强大的语言环境支持，`DataFaker` 目前支持以下语言环境有 70 多种：

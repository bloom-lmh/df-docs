# Multi-language Support

## Introduction

`DataFaker` leverages `faker.js` to provide localized data in over 70 languages. When using a specific language environment, the generated data will be in the corresponding language.

## Supported Languages

| Language Code | Language Name                    | Faker Object Name |
| ------------- | -------------------------------- | ----------------- |
| af_ZA         | Afrikaans (South Africa)         | fakerAF_ZA        |
| ar            | Arabic                           | fakerAR           |
| az            | Azerbaijani                      | fakerAZ           |
| base          | Base                             | fakerBASE         |
| bn_BD         | Bengali (Bangladesh)             | fakerBN_BD        |
| cs_CZ         | Czech (Czech Republic)           | fakerCS_CZ        |
| cy            | Welsh                            | fakerCY           |
| da            | Danish                           | fakerDA           |
| de            | German                           | fakerDE           |
| de_AT         | German (Austria)                 | fakerDE_AT        |
| de_CH         | German (Switzerland)             | fakerDE_CH        |
| dv            | Dhivehi                          | fakerDV           |
| el            | Greek                            | fakerEL           |
| en            | English                          | fakerEN           |
| en_AU         | English (Australia)              | fakerEN_AU        |
| en_AU_ocker   | English (Australian Ocker)       | fakerEN_AU_ocker  |
| en_BORK       | English (Bork)                   | fakerEN_BORK      |
| en_CA         | English (Canada)                 | fakerEN_CA        |
| en_GB         | English (United Kingdom)         | fakerEN_GB        |
| en_GH         | English (Ghana)                  | fakerEN_GH        |
| en_HK         | English (Hong Kong)              | fakerEN_HK        |
| en_IE         | English (Ireland)                | fakerEN_IE        |
| en_IN         | English (India)                  | fakerEN_IN        |
| en_NG         | English (Nigeria)                | fakerEN_NG        |
| en_US         | English (United States)          | fakerEN_US        |
| en_ZA         | English (South Africa)           | fakerEN_ZA        |
| eo            | Esperanto                        | fakerEO           |
| es            | Spanish                          | fakerES           |
| es_MX         | Spanish (Mexico)                 | fakerES_MX        |
| fa            | Persian                          | fakerFA           |
| fi            | Finnish                          | fakerFI           |
| fr            | French                           | fakerFR           |
| fr_BE         | French (Belgium)                 | fakerFR_BE        |
| fr_CA         | French (Canada)                  | fakerFR_CA        |
| fr_CH         | French (Switzerland)             | fakerFR_CH        |
| fr_LU         | French (Luxembourg)              | fakerFR_LU        |
| fr_SN         | French (Senegal)                 | fakerFR_SN        |
| he            | Hebrew                           | fakerHE           |
| hr            | Croatian                         | fakerHR           |
| hu            | Hungarian                        | fakerHU           |
| hy            | Armenian                         | fakerHY           |
| id_ID         | Indonesian (Indonesia)           | fakerID_ID        |
| it            | Italian                          | fakerIT           |
| ja            | Japanese                         | fakerJA           |
| ka_GE         | Georgian (Georgia)               | fakerKA_GE        |
| ko            | Korean                           | fakerKO           |
| lv            | Latvian                          | fakerLV           |
| mk            | Macedonian                       | fakerMK           |
| nb_NO         | Norwegian (Norway)               | fakerNB_NO        |
| ne            | Nepali                           | fakerNE           |
| nl            | Dutch                            | fakerNL           |
| nl_BE         | Dutch (Belgium)                  | fakerNL_BE        |
| pl            | Polish                           | fakerPL           |
| pt_BR         | Portuguese (Brazil)              | fakerPT_BR        |
| pt_PT         | Portuguese (Portugal)            | fakerPT_PT        |
| ro            | Romanian                         | fakerRO           |
| ro_MD         | Romanian (Moldova)               | fakerRO_MD        |
| ru            | Russian                          | fakerRU           |
| sk            | Slovak                           | fakerSK           |
| sr_RS_latin   | Serbian (Serbia, Latin script)   | fakerSR_RS_latin  |
| sv            | Swedish                          | fakerSV           |
| ta_IN         | Tamil (India)                    | fakerTA_IN        |
| th            | Thai                             | fakerTH           |
| tr            | Turkish                          | fakerTR           |
| uk            | Ukrainian                        | fakerUK           |
| ur            | Urdu                             | fakerUR           |
| uz_UZ_latin   | Uzbek (Uzbekistan, Latin script) | fakerUZ_UZ_latin  |
| vi            | Vietnamese                       | fakerVI           |
| yo_NG         | Yoruba (Nigeria)                 | fakerYO_NG        |
| zh_CN         | Chinese (China)                  | fakerZH_CN        |
| zh_TW         | Chinese (Taiwan)                 | fakerZH_TW        |
| zu_ZA         | Zulu (South Africa)              | fakerZU_ZA        |

## Global Locale Setting

### Basic Syntax

You can set the default global locale using the `DataFaker.setLocale()` method. This method accepts a parameter with the following types:

::: code-group

```ts [Single Locale]
// Set locale to Chinese using string
DataFaker.setLocale('zh_CN');
// Or set using the Chinese faker object directly, allFakers is a collection of all faker objects
DataFaker.setLocale(allFakers['zh_CN']);
```

```ts [Multiple Locales]
// Prioritize Chinese, then English if Chinese data doesn't exist, finally German
DataFaker.setLocale(['zh_CN', 'en_US', de_CH]);
```

```ts [Custom Faker Object]
// Or you can customize the faker object
const customLocale: LocaleDefinition = {
  internet: {
    domainSuffix: ['test'],
  },
};
const customFaker = new Faker({
  locale: [customLocale, de_CH, de, en, base],
});
DataFaker.setLocale(customFaker);
```

:::

::: tip Locale Caching
In fact, `DataFaker.setLocale(['zh_CN', 'en_US', de_CH])` is equivalent to:

```ts
const customFaker = new Faker({
  locale: [zh_CN, en_US, de_CH],
});
DataFaker.setLocale(customFaker);
```

It creates a new `Faker` object and caches it. The next time `DataFaker.setLocale(['zh_CN', 'en_US', de_CH])` is called, the cached object will be used directly.
:::

### Usage Example

> Example: For the user model and company model below, we can set the Chinese locale as the default, resulting in Chinese data:

::: code-group

```ts {11-12} [Code]
// User model
const userModel = defineModel('user', {
  id: 'number.int',
  firstName: 'person.firstName',
  secondName: 'person.lastName',
  age: ['number.int', { min: 18, max: 65 }],
  email: ctx => {
    return faker.internet.email({ firstName: ctx.firstName, lastName: ctx.secondeName });
  },
});
// Set global locale to Chinese
DataFaker.setLocale('zh_CN');
const userDatas = fakeData(userModel);
console.dir(userDatas, { depth: Infinity });
// Company model
const companyModel = defineModel('company', {
  name: 'company.name',
  address: 'location.streetAddress',
});
const companyDatas = fakeData(companyModel);
console.dir(companyDatas, { depth: Infinity });
```

```json {4-5,11-12} [Result]
// User data
{
  "id": 1040719705843601,
  "firstName": "鹭洋",
  "secondName": "薛",
  "age": 58,
  "email": "valljf_Larkin29@hotmail.com"
}
// Company data
{
  "name": "辽宁省榕融传媒无限公司",
  "address": "英巷28404号"
}
```

:::

## Runtime Locale Setting

### Basic Syntax

Setting the locale at runtime means passing locale configuration when generating data with `fakeData`:

```ts
const userDatas = fakeData(userModel, {
  // Specify locale
  locale: 'zh_CN',
});
```

The way to specify the locale above is consistent with the global locale setting:

::: code-group

```ts [Single Locale]
const userDatas = fakeData(userModel, {
  // Set locale to Chinese using string
  locale: 'zh_CN',
  // Or set using the Chinese faker object directly, allFakers is a collection of all faker objects
  locale: allFakers['zh_CN'],
});
```

```ts [Multiple Locales]
const userDatas = fakeData(userModel, {
  // Prioritize Chinese, then English if Chinese data doesn't exist, finally German
  locale: ['zh_CN', 'en_US', de_CH],
});
```

```ts [Custom Faker Object]
// Or you can customize the faker object
const customLocale: LocaleDefinition = {
  internet: {
    domainSuffix: ['test'],
  },
};
const customFaker = new Faker({
  locale: [customLocale, de_CH, de, en, base],
});
const userDatas = fakeData(userModel, {
  // Prioritize Chinese, then English if Chinese data doesn't exist, finally German
  locale: customFaker,
});
```

:::

### Usage Example

> Example: For the user model below, we can set the Chinese locale at runtime, resulting in Chinese data:

::: code-group

```ts [Code] {19-22}
const addressModel = defineModel('address', {
  country: 'location.country',
  city: 'location.city',
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
  children: {
    refModel: 'user',
    deep: 3,
  },
});
const userDatas = fakeData(userModel, {
  // Specify locale
  locale: [zh_CN, 'en_AU'],
});
console.dir(userDatas, { depth: Infinity });
```

```ts [Result]
{
  firstName: '黎昕',
  secondName: '止',
  age: 61,
  address: { country: '乍得', city: '安南市' },
  children: {
    firstName: '懿轩',
    secondName: '公冶',
    age: 53,
    address: { country: '缅甸', city: '衡口市' },
    children: {
      firstName: '立轩',
      secondName: '方',
      age: 64,
      address: { country: '沙特阿拉伯', city: '北门市' },
      children: {
        firstName: '嘉熙',
        secondName: '介',
        age: 29,
        address: { country: '尼日利亚', city: '吉阳市' },
        children: null,
        email: 'gztmft_Cummings@hotmail.com'
      },
      email: 'o97sbt_Abbott@yahoo.com'
    },
    email: 'jcvsbt88@yahoo.com'
  },
  email: 'vdak5x72@gmail.com'
}
```

:::

### Priority

Runtime locale configuration takes precedence over global configuration. For example, if you set both global and runtime locales, the runtime setting will override the global one. For instance, even if the global setting is English, the Chinese runtime setting will be used:

::: code-group

```ts [Code] {1-2,21-25}
// Set global locale
DataFaker.setLocale(faker);
const addressModel = defineModel('address', {
  country: 'location.country',
  city: 'location.city',
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
  children: {
    refModel: 'user',
    deep: 3,
  },
});
// Specify locale at runtime
const userDatas = fakeData(userModel, {
  // Specify locale
  locale: [zh_CN, 'en_AU'],
});
console.dir(userDatas, { depth: Infinity });
```

```ts [Result]
{
  firstName: '子欣',
  secondName: '申屠',
  age: 20,
  address: { country: '日本', city: '衡乡县' },
  children: {
    firstName: '晋鹏',
    secondName: '郝',
    age: 60,
    address: { country: '日本', city: '吉沙市' },
    children: {
      firstName: '智宸',
      secondName: '殳',
      age: 57,
      address: { country: '吉布提', city: '太口市' },
      children: {
        firstName: '修洁',
        secondName: '涂',
        age: 61,
        address: { country: '澳大利亚', city: '长京市' },
        children: null,
        email: 'fselj59@yahoo.com'
      },
      email: 'k8qi48.Rodriguez@yahoo.com'
    },
    email: 'k7fv9r_Nienow@yahoo.com'
  },
  email: 'i1cl5v_Kris@gmail.com'
}
```

:::

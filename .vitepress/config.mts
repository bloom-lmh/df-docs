import { defineConfig } from 'vitepress';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'DataFaker',
  description: 'A powerful data mock tool, relying on faker.js, to implement various data mock scenarios',
  vite: {
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: '*.txt',
            dest: '',
          },
        ],
      }),
    ],
    resolve: {
      alias: {
        // 配置路径别名
        '@': path.resolve(__dirname, './'),
      },
    },
  },
  markdown: {
    lineNumbers: true,
    breaks: true,
    math: true,
  },
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/en/What is DataFaker.md' },
      {
        text: '国际化',
        items: [
          {
            text: '中文',
            link: '/zh/什么是DataFaker.md',
          },
          {
            text: 'English',
            link: '/en/What is DataFaker.md',
          },
        ],
      },
      { text: 'API', link: '/zh/预设数据.md' },
    ],
    search: { provider: 'local' },
    outline: {
      level: 'deep',
      label: '目录',
    },
    sidebar: {
      '/zh/': [
        {
          text: '简介',
          items: [
            { text: '什么是DataFaker？', link: '/zh/什么是DataFaker' },
            { text: '快速开始', link: '/zh/快速开始' },
            { text: '基本使用', link: '/zh/基本使用' },
          ],
        },
        {
          text: '核心概念',
          items: [
            { text: '模板语法', link: '/zh/模板语法' },
            { text: '唯一值', link: '/zh/唯一值' },
            { text: '数据引用', link: '/zh/数据引用' },
            { text: '数据模型', link: '/zh/数据模型' },
            { text: '多语言', link: '/zh/多语言' },
            { text: 'Hooks', link: '/zh/数据生成钩子' },
            { text: '数据迭代器', link: '/zh/数据迭代器' },
          ],
        },
        {
          text: '实验性功能',
          items: [
            { text: '装饰器语法', link: '/zh/装饰器语法' },
            { text: '模拟业务层', link: '/zh/模拟业务层' },
          ],
        },
        {
          text: '相关链接',
          items: [
            { text: 'faker.js', link: 'https://faker.nodejs.cn/guide/unique.html' },
            { text: 'axios-plus', link: 'https://github.com/bloom-lmh/AxiosPlus' },
          ],
        },
      ],
      '/en/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is DataFaker?', link: '/en/What is DataFaker.md' },
            { text: 'Quick Start', link: '/en/Quick Start.md' },
            { text: 'Basic Usage', link: '/en/Basic Usage' },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Template Syntax', link: '/en/Template Syntax' },
            { text: 'Unique Values', link: '/en/Unique Values' },
            { text: 'Data References', link: '/en/Data References' },
            { text: 'Data Models', link: '/en/Data Models' },
            { text: 'Multi-Language', link: '/en/Multi-Language Support.md' },
            { text: 'Hooks', link: '/en/Data Generation Hooks.md' },
            { text: 'Data Iterators', link: '/en/Data Iterators' },
          ],
        },
        {
          text: 'Experimental Features',
          items: [
            { text: 'Decorator Syntax', link: '/en/Decorator Syntax' },
            { text: 'Simulating the Business Layer', link: '/en/Simulating the Business Layer' },
          ],
        },
        {
          text: 'Related Links',
          items: [
            { text: 'faker.js', link: 'https://faker.nodejs.cn/guide/unique.html' },
            { text: 'axios-plus', link: 'https://github.com/bloom-lmh/AxiosPlus' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/bloom-lmh/data-faker.git' }],
  },
});

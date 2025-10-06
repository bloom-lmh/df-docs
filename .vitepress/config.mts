import { defineConfig } from 'vitepress';
import path from 'path';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'DataFaker',
  description: '强大的数据mock工具，依托faker.js，实现各种数据mock场景',
  base: './',
  vite: {
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
      { text: '指南', link: '/什么是DataFaker' },
      { text: 'API', link: '/预设数据.md' },
    ],
    search: { provider: 'local' },
    outline: {
      level: 'deep',
      label: '目录',
    },
    sidebar: [
      {
        text: '简介',
        items: [
          { text: '什么是DataFaker？', link: '/什么是DataFaker.md' },
          { text: '快速开始', link: '/快速开始.md' },
          { text: '基本使用', link: '/基本使用' },
        ],
      },
      {
        text: '核心概念',
        items: [
          { text: '模板语法', link: '/模板语法' },
          { text: '唯一值', link: '/唯一值' },
          { text: '数据引用', link: '/数据引用' },
          { text: '数据模型', link: '/数据模型' },
          { text: '多语言', link: '/多语言' },
          { text: 'Hooks', link: '/数据生成钩子' },
        ],
      },
      {
        text: '实验性功能',
        items: [
          { text: '装饰器语法', link: '/装饰器语法' },
          { text: '模拟业务层', link: '/模拟业务层' },
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

    socialLinks: [{ icon: 'github', link: 'https://github.com/bloom-lmh/data-faker.git' }],
  },
});

import DefaultTheme from 'vitepress/theme';
import './style/custom.scss';
import GlassCard from './components/card/GlassCard.vue';
import { EnhanceAppContext } from 'vitepress';
// 导出主题对象Theme ，VitePress 总会使用自定义主题对象
export default {
  ...DefaultTheme,
  NotFound: () => '404',
  enhanceApp(ctx: EnhanceAppContext) {
    const { app } = ctx;
    app.component('GlassCard', GlassCard);
  },
};

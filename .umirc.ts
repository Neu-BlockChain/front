import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '交易记录',
      path: '/record',
      component: './Record',
    },
    {
        name: ' CRUD 示例',
        path: '/table',
        component: './Table',
    },
    {
      name: ' 买方挂单',
      path: '/buy',
      component: './Buy',
    },
    {
      name: ' 卖方挂单',
      path: '/sell',
      component: './Sell',
    },
  ],
  proxy: {
    "/api": {
      target: "https://ic0.app",
      changeOrigin: true,
    },
  },
  npmClient: 'npm',
});


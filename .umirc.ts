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
      name: ' 个人买方挂单',
      path: '/onesBuy',
      component: './OnesBuy',
    },
    {
      name: ' 个人卖方挂单',
      path: '/onesSell',
      component: './OnesSell',
    },
    {
      name: ' 链上买方挂单',
      path: '/buy',
      component: './Buy',
    },
    {
      name: ' 链上卖方挂单',
      path: '/sell',
      component: './Sell',
    },
    {
      name: ' 交易图表',
      path: '/chart',
      component: './Chart',
    },
    {
      name: ' 政府分发与排放',
      path: '/govern',
      component: './Govern',
    },
    {
      name: ' 代币授权',
      path: '/approve',
      component: './Approve',
    },
    {
      name: ' 消耗饼图',
      path: '/piechart',
      component: './PieChart',
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


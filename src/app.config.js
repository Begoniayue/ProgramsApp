export default {
  pages: [
    'pages/Index/index',
    'pages/Home/index',
    'pages/Synthesis/index',
    'pages/webview/index',
    'pages/UserSetting/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    list: [{
      pagePath: 'pages/Index/index',
      text: '首页',
      iconPath:"pages/images/shouye.png",
      selectedIconPath:"pages/images/shouyes.png",
    },
      {
      pagePath: 'pages/Synthesis/index',
      text: '合成',
      iconPath:"pages/images/hecheng.png",
      selectedIconPath:"pages/images/hechengs.png",
    },
      {
      pagePath: 'pages/UserSetting/index',
      text: '我的',
      iconPath:"pages/images/my.png",
      selectedIconPath:"pages/images/mys.png",
    }],
    'color': '#333333',
    'selectedColor': '#6C6BFC',
    'backgroundColor': '#fff',
    'borderStyle': 'black',
  },
}

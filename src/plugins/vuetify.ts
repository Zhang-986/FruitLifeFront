import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#4CAF50',      // 水果绿
          'on-primary': '#FFFFFF', // 主色上的文字颜色（白色）
          secondary: '#8BC34A',    // 浅绿色
          'on-secondary': '#FFFFFF', // 次色上的文字颜色（白色）
          accent: '#FF9800',       // 橙色
          'on-accent': '#FFFFFF',  // 强调色上的文字颜色（白色）
          error: '#F44336',        // 红色
          'on-error': '#FFFFFF',   // 错误色上的文字颜色（白色）
          warning: '#FFC107',      // 黄色
          'on-warning': '#000000', // 警告色上的文字颜色（黑色）
          info: '#2196F3',         // 蓝色
          'on-info': '#FFFFFF',    // 信息色上的文字颜色（白色）
          success: '#4CAF50',      // 成功绿
          'on-success': '#FFFFFF', // 成功色上的文字颜色（白色）
          surface: '#FAFAFA',      // 表面色
          'on-surface': '#212121', // 表面上的文字颜色（深灰）
          background: '#FFFFFF',   // 背景色
          'on-background': '#212121', // 背景上的文字颜色（深灰）
          // 导航相关颜色
          'surface-variant': '#F5F5F5',
          'on-surface-variant': '#424242',
          outline: '#E0E0E0',
          'outline-variant': '#EEEEEE',
        }
      },
      dark: {
        colors: {
          primary: '#66BB6A',      // 深色模式下的绿色
          'on-primary': '#000000', // 深色模式主色上的文字（黑色）
          secondary: '#9CCC65',    // 深色模式下的浅绿
          'on-secondary': '#000000', // 深色模式次色上的文字（黑色）
          accent: '#FFB74D',       // 深色模式下的橙色
          'on-accent': '#000000',  // 深色模式强调色上的文字（黑色）
          error: '#EF5350',        // 深色模式下的红色
          'on-error': '#FFFFFF',   // 深色模式错误色上的文字（白色）
          warning: '#FFCA28',      // 深色模式下的黄色
          'on-warning': '#000000', // 深色模式警告色上的文字（黑色）
          info: '#42A5F5',         // 深色模式下的蓝色
          'on-info': '#FFFFFF',    // 深色模式信息色上的文字（白色）
          success: '#66BB6A',      // 深色模式下的成功绿
          'on-success': '#000000', // 深色模式成功色上的文字（黑色）
          surface: '#424242',      // 深色模式表面色
          'on-surface': '#FFFFFF', // 深色模式表面上的文字（白色）
          background: '#303030',   // 深色模式背景色
          'on-background': '#FFFFFF', // 深色模式背景上的文字（白色）
          // 深色模式导航相关颜色
          'surface-variant': '#616161',
          'on-surface-variant': '#E0E0E0',
          outline: '#757575',
          'outline-variant': '#616161',
        }
      }
    }
  }
})

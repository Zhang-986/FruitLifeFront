import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          // 清新水果主题色彩
          primary: '#4CAF50',      // 清新绿色（苹果绿）
          secondary: '#FF9800',    // 橙色（橙子色）
          accent: '#E91E63',       // 粉红色（草莓色）
          error: '#F44336',        // 红色
          info: '#2196F3',         // 蓝色（天空色）
          success: '#8BC34A',      // 浅绿色（青苹果）
          warning: '#FFC107',      // 黄色（柠檬色）
          background: '#FAFAFA',   // 淡灰背景
          surface: '#FFFFFF',      // 白色表面
          'surface-variant': '#F5F5F5',
          'on-surface-variant': '#424242',
          // 自定义水果色彩
          banana: '#FFE082',       // 香蕉黄
          grape: '#9C27B0',        // 葡萄紫
          peach: '#FFAB91',        // 桃子色
          mint: '#A5D6A7',         // 薄荷绿
          cherry: '#E57373',       // 樱桃红
        }
      },
      dark: {
        colors: {
          primary: '#66BB6A',
          secondary: '#FFB74D',
          accent: '#F06292',
          background: '#121212',
          surface: '#1E1E1E',
        }
      }
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  defaults: {
    VBtn: {
      style: {
        textTransform: 'none',
        borderRadius: '16px',
        fontSize: '16px',
        fontWeight: '500',
        minHeight: '48px',
        padding: '0 24px'
      }
    },
    VCard: {
      elevation: 3,
      style: {
        borderRadius: '20px',
        fontSize: '16px'
      }
    },
    VSheet: {
      style: {
        borderRadius: '16px'
      }
    },
    VAppBar: {
      style: {
        fontSize: '18px'
      }
    },
    VNavigationDrawer: {
      style: {
        fontSize: '16px'
      }
    },
    VListItem: {
      style: {
        minHeight: '52px',
        fontSize: '16px'
      }
    },
    VTextField: {
      style: {
        fontSize: '16px'
      }
    }
  },
  display: {
    mobileBreakpoint: 'sm',
    thresholds: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  }
})

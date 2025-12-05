import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  isDark: boolean
  toggleTheme: () => void
  setTheme: (isDark: boolean) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      
      toggleTheme: () => {
        set((state) => {
          const newIsDark = !state.isDark
          // 更新 DOM
          if (newIsDark) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { isDark: newIsDark }
        })
      },
      
      setTheme: (isDark: boolean) => {
        if (isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        set({ isDark })
      },
    }),
    {
      name: 'devbox-theme',
      onRehydrateStorage: () => (state) => {
        // 初始化时应用主题
        if (state?.isDark) {
          document.documentElement.classList.add('dark')
        }
      },
    }
  )
)


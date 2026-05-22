/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

export const SECTIONS = ['home', 'journey', 'skills', 'contact']
export const NAV_PAGES = [
  { id: 'home',    label: 'HOME',    num: '01', path: '/'        },
  { id: 'journey', label: 'JOURNEY', num: '02', path: '/journey' },
  { id: 'skills',  label: 'SKILLS',  num: '03', path: '/skills'  },
  { id: 'contact', label: 'CONTACT', num: '04', path: '/contact' },
]

interface NavigationContextType {
  activeIndex: number
  setActiveIndex: (i: number) => void
  sections: string[]
}

const NavigationContext = createContext<NavigationContextType>({
  activeIndex: 0,
  setActiveIndex: () => {},
  sections: SECTIONS,
})

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [activeIndex, setActiveIndex] = useState(0)
  return (
    <NavigationContext.Provider value={{ activeIndex, setActiveIndex, sections: SECTIONS }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  return useContext(NavigationContext)
}

// src/core/ui/ThemeProvider.tsx
import {createContext, useContext, useEffect, useMemo, useState} from "react";
type Theme = "light"|"dark"; 
const Ctx = createContext<{theme:Theme; setTheme:(t:Theme)=>void}>({theme:"dark", setTheme:()=>{}});
export function ThemeProvider({children}:{children:React.ReactNode}){
  const [theme,setTheme] = useState<Theme>(() => (localStorage.getItem("theme") as Theme) || "dark");
  useEffect(()=>{ document.documentElement.setAttribute("data-theme", theme); localStorage.setItem("theme", theme); },[theme]);
  const value = useMemo(()=>({theme,setTheme}),[theme]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export const useTheme = ()=> useContext(Ctx);

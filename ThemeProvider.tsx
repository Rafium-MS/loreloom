// ThemeProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react';
type Theme = 'dark' | 'focus';
const ThemeCtx = createContext<{theme:Theme; setTheme:(t:Theme)=>void}>(null!);
export const ThemeProvider = ({children}:{children:React.ReactNode})=>{
  const [theme,setTheme]=useState<Theme>(()=> (localStorage.getItem('theme') as Theme) || 'dark');
  useEffect(()=>{ document.documentElement.classList.toggle('theme-focus', theme==='focus');
                  localStorage.setItem('theme', theme); },[theme]);
  return <ThemeCtx.Provider value={{theme,setTheme}}>{children}</ThemeCtx.Provider>;
}
export const useTheme=()=>useContext(ThemeCtx);

// ThemeToggle.tsx
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
export default function ThemeToggle(){
  const {theme,setTheme}=useTheme();
  const isFocus = theme==='focus';
  return (
    <button onClick={()=>setTheme(isFocus?'dark':'focus')}
      className="rounded-xl px-3 py-2 border hover:opacity-90"
      title={isFocus?'Ir para Dark Studio':'Ir para Focus Pergaminho'}>
      {isFocus? <Moon className="inline mr-2" size={16}/> : <Sun className="inline mr-2" size={16}/>}
      {isFocus? 'Dark' : 'Focus'}
    </button>
  );
}

const KEY = "loreloom:minimal:v1";

export function loadState(){
  try{
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {
      editor: "",
      worldNotes: "",
      timeNotes: ""
    };
  }catch(e){
    console.warn("Falha ao carregar estado:", e);
    return { editor:"", worldNotes:"", timeNotes:"" };
  }
}

export function saveState(state){
  try{
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  }catch(e){
    console.warn("Falha ao salvar estado:", e);
    return false;
  }
}

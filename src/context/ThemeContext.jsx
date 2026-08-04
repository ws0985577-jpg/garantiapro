import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();


export function ThemeProvider({ children }) {

  const [tema, setTema] = useState(() => {

    return localStorage.getItem("tema") || "claro";

  });


  useEffect(() => {

    document.body.className = tema;

    localStorage.setItem("tema", tema);

  }, [tema]);



  function alternarTema() {

    setTema((valor) =>
      valor === "claro" ? "escuro" : "claro"
    );

  }



  return (

    <ThemeContext.Provider
      value={{
        tema,
        alternarTema
      }}
    >

      {children}

    </ThemeContext.Provider>

  );

}



export function useTema(){

  return useContext(ThemeContext);

}
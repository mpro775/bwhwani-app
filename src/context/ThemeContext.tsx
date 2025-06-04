import React, { createContext, useContext } from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext<{ theme: "light" | "dark" }>({ theme: "light" });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const scheme = useColorScheme(); // يقرأ من إعدادات النظام
  const theme = scheme === "dark" ? "dark" : "light";

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

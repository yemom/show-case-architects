import { useContext } from "react";
import { AppContext, type AppContextType } from "./AppContext";

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
}

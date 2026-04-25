import { createContext, useState } from "react";

export const UIContext = createContext();

function UIProvider({ children }) {
  const [loading, setLoading] = useState(false);

  // 🔹 Global Month Filter
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  // 🔹 Category Filter
  const [categoryFilter, setCategoryFilter] = useState("");

  return (
    <UIContext.Provider
      value={{
        loading,
        setLoading,
        month,
        setMonth,
        categoryFilter,
        setCategoryFilter,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export default UIProvider;
import { createContext, ReactNode, useContext, useMemo } from "react";
import {
  GenericStringInMemoryStorage,
  GenericStringStorage,
} from "@/fhevm/GenericStringStorage";

interface UseInMemoryStorageState {
  storage: GenericStringStorage;
}

interface InMemoryStorageProviderProps {
  children: ReactNode;
}

const InMemoryStorageContext = createContext<
  UseInMemoryStorageState | undefined
>(undefined);

export const useInMemoryStorage = () => {
  const context = useContext(InMemoryStorageContext);
  if (!context) {
    throw new Error(
      "useInMemoryStorage must be used within a InMemoryStorageProvider"
    );
  }
  return context;
};

export const InMemoryStorageProvider: React.FC<
  InMemoryStorageProviderProps
> = ({ children }) => {
  const storage = useMemo(() => new GenericStringInMemoryStorage(), []);
  const contextValue = useMemo(() => ({ storage }), [storage]);

  return (
    <InMemoryStorageContext.Provider value={contextValue}>
      {children}
    </InMemoryStorageContext.Provider>
  );
};

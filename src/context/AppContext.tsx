import React, { createContext, useContext, useState } from 'react';

export interface AppState {
  role: 'beneficiary' | 'field_worker' | 'authority';
  language: string;
  isLoggedIn: boolean;
  currentBeneficiaryId: string;
  isOnline: boolean;
  currentPage: string;
  viewMode: 'desktop' | 'mobile';
}

export const defaultState: AppState = {
  role: 'beneficiary',
  language: 'mr',
  isLoggedIn: false,
  currentBeneficiaryId: 'ben-001',
  isOnline: true,
  currentPage: 'language',
  viewMode: 'desktop',
};

export const AppContext = createContext<{
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}>({ state: defaultState, setState: () => {} });

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AppState>(defaultState);
  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

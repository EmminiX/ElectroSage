"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PodcastContextType {
  isPlayerVisible: boolean;
  isPlayerMinimized: boolean;
  showPlayer: () => void;
  hidePlayer: () => void;
  toggleMinimize: () => void;
}

const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

export function usePodcast() {
  const context = useContext(PodcastContext);
  if (context === undefined) {
    throw new Error("usePodcast must be used within a PodcastProvider");
  }
  return context;
}

interface PodcastProviderProps {
  children: ReactNode;
}

export function PodcastProvider({ children }: PodcastProviderProps) {
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);

  const showPlayer = () => {
    setIsPlayerVisible(true);
    setIsPlayerMinimized(false);
  };

  const hidePlayer = () => {
    setIsPlayerVisible(false);
    setIsPlayerMinimized(false);
  };

  const toggleMinimize = () => {
    setIsPlayerMinimized(!isPlayerMinimized);
  };

  return (
    <PodcastContext.Provider
      value={{
        isPlayerVisible,
        isPlayerMinimized,
        showPlayer,
        hidePlayer,
        toggleMinimize,
      }}
    >
      {children}
    </PodcastContext.Provider>
  );
}
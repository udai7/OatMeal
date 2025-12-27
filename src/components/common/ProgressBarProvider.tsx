"use client";

import { ReactNode } from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

interface ProvidersProps {
  children: ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <ProgressBar
        height="2px"
        color="#ffffff"
        options={{ showSpinner: false, trickleSpeed: 150 }}
        shallowRouting
      />
      {children}
    </>
  );
};

export default Providers;

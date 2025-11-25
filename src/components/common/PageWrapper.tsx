import React, { ReactNode } from "react";

const PageWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="absolute inset-0 h-full w-full bg-black print:bg-transparent print:bg-none">
      {children}
    </div>
  );
};

export default PageWrapper;

import React, { ReactNode } from "react";

const PageWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full bg-black print:bg-transparent print:bg-none overflow-hidden">
      {children}
    </div>
  );
};

export default PageWrapper;

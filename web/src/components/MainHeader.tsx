import React from "react";
import { Separator } from "../shadcn/ui/separator";

const MainHeader = () => {
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        DuckDNS-UI
      </h1>
      <Separator className="mt-4" />
    </>
  );
};

export default MainHeader;

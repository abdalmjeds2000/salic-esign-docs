import { Button, Tooltip } from "@chakra-ui/react";
import React from "react";
import { SignaturePad } from "./signature-pad/SignaturePad";


const ToolsHeader = ({ actions }) => {

  return (
    <div className="fixed top-14 md:top-16 shadow-2xl dark:drop-shadow-xl z-[9] w-full">
      <div className="h-8 md:h-10 px-3 py-1 md:px-6 bg-[#f0f2f4] dark:bg-secondary-dark-bg dark:text-white text-text-color">
        <div className="h-full flex justify-between items-center overflow-auto">
          <div><SignaturePad /></div>
          <div className='flex gap-2 items-center'>
            {actions?.map((item, i) => (
              <Tooltip key={i} label={`#${item.page}`}>
                <Button
                  size="xs"
                  colorScheme={item.isSigned ? "green" : "red"}
                  variant="solid"
                  onClick={() => {
                    const element = document.getElementById(`page_${item.page}`);
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                ><a href={`#thumb_${item.page}`}>{i+1}</a></Button>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToolsHeader
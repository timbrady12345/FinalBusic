// import { useState } from "react";

export default function Recipes() {
  // const [recipesVisible] = useState(false);
  return (
    <div className="flex flex-col  w-full min-h-screen">
      {/* //Middle */}
      {/* Make a grid of 4 images */}
      {/* Collaps Section */}
      <div className="inline-flex flex-row">
        {/* {recipesVisible && ( */}
        <div className="w-1/4 bg-gray-900">
          <div className="border-gray-700 border-b"> Recipes:</div>
          <div className="pb-1">Chocolate Chip Cookies</div>
          <div className="pb-1">Chocolate Chip Cookies II</div>
          <div className="pb-1">Chocolate Chip Cookies III</div>
        </div>
        {/* )} */}
        {/* MAIN SCREEN */}
        <div className="h-screen w-full bg-gray-800">
          {/* Horizontal Boxes */}
          {/* ----------------------------------- */}
        </div>
      </div>
    </div>
  );
}

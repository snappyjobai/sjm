import { useState } from "react";
import CodeHighlight from "./CodeHighlight";

export default function SDKTabs({ examples }) {
  const [activeSDK, setActiveSDK] = useState(Object.keys(examples)[0]);

  return (
    <div className="border border-accent/20 rounded-lg overflow-hidden">
      <div className="flex border-b border-accent/20">
        {Object.keys(examples).map((sdk) => (
          <button
            key={sdk}
            onClick={() => setActiveSDK(sdk)}
            className={`px-4 py-2 text-sm ${
              sdk === activeSDK
                ? "bg-accent text-white"
                : "text-gray-400 hover:text-white hover:bg-accent/10"
            }`}
          >
            {sdk}
          </button>
        ))}
      </div>

      <div className="p-4 bg-black/30">
        <CodeHighlight
          code={examples[activeSDK]}
          language={activeSDK.toLowerCase()}
        />
      </div>
    </div>
  );
}

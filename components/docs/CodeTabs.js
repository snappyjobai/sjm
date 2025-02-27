import { useState } from "react";
import CodeHighlight from "./CodeHighlight";

const CodeTabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(Object.keys(tabs)[0]);

  if (!tabs || typeof tabs !== "object") {
    return <div>Error: tabs prop must be an object</div>;
  }

  return (
    <div className="border border-accent/20 rounded-lg overflow-hidden">
      <div className="flex border-b border-accent/20">
        {Object.keys(tabs).map((tabName) => (
          <button
            key={tabName}
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm transition-colors ${
              activeTab === tabName
                ? "bg-accent text-white"
                : "text-gray-400 hover:text-white hover:bg-accent/10"
            }`}
          >
            {tabName}
          </button>
        ))}
      </div>
      <div className="bg-black/30 p-4">
        <CodeHighlight
          code={tabs[activeTab]}
          language={activeTab.toLowerCase()}
        />
      </div>
    </div>
  );
};

CodeTabs.displayName = "CodeTabs";

export default CodeTabs;

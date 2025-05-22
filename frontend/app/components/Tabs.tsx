"use client";
import React, { JSX, useState } from "react";

interface Tab {
  label: string | JSX.Element; // Now can be a string or JSX (e.g., icon)
  content: JSX.Element | any;
}

interface TabComponentProps {
  tabs: Tab[];
  initialTab?: number; // Optional initial tab index
  className?: string; // Optional className prop
}

const TabComponent: React.FC<TabComponentProps> = ({
  tabs,
  initialTab = 0,
  className = "", // Default to an empty string if no className is provided
}) => {
  const [activeTab, setActiveTab] = useState<number>(initialTab);

  return (
    <>
      <div className="w-full min-h-screen flex-col justify-center  p-8">
        {/* Tab Navigation */}
        <div className="w-full shadow-sm p-2  rounded-lg">
          <div className="flex flex-row space-x-2">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`tab font-mono transition duration-300 ease-in-out ${
                  activeTab === index
                    ? "bg-[rgb(90,191,249)] text-gray-600 rounded-md font-semibold"
                    : "bg-gray-200 hover:bg-gray-300"
                } w-full`}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className={`mt-4 p-4  w-full rounded-md flex-wrap ${className ? className : ""}`}>
            {tabs[activeTab].content}
          </div>
        </div>
      </div>
    </>
  );
};

export default TabComponent;

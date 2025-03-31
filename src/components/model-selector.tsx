"use client"

import { ChevronDown, Check } from "lucide-react";
import { MODEL_OPTIONS, getModelProvider } from "@/utils/models";
import { useState, useEffect, useRef } from "react";

interface ModelSelectorProps {
  options?: string[];
  onChange: (model: string) => void;
  initialModel?: string;
}

const ModelSelector = ({ 
  options = MODEL_OPTIONS, 
  onChange, 
  initialModel 
}: ModelSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(() => {
    if (initialModel) return initialModel;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedModel");
      return stored && options.includes(stored) ? stored : options[0];
    }
    return options[0];
  });
  const [dropdownPosition, setDropdownPosition] = useState("right");
  const dropdownRef = useRef(null);

  // Group models by provider
  const groupedOptions = options.reduce((acc, model) => {
    const provider = getModelProvider?.(model) || "groq";
    if (!acc[provider]) acc[provider] = [];
    acc[provider].push(model);
    return acc;
  }, {} as Record<string, string[]>);

  // Sync with localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedModel = localStorage.getItem("selectedModel");
      if (storedModel && options.includes(storedModel)) {
        setSelectedModel(storedModel);
        if (onChange) onChange(storedModel);
      }
    }
  }, [onChange, options]);

  // Update selectedModel when initialModel changes
  useEffect(() => {
    if (initialModel && initialModel !== selectedModel) {
      setSelectedModel(initialModel);
    }
  }, [initialModel, selectedModel]);

  const handleSelect = (model: string) => {
    setSelectedModel(model);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedModel", model);
    }
    if (onChange) onChange(model);
    setIsOpen(false);
  };

  // Calculate position before opening the dropdown
  const toggleDropdown = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      if (rect.right + 300 > viewportWidth) {
        setDropdownPosition("left");
      } else {
        setDropdownPosition("right");
      }
    }
    setIsOpen(!isOpen);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full md:w-auto">
      <div
        onClick={toggleDropdown}
        className="flex items-center justify-between px-3 py-2 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <span className="text-sm">{selectedModel}</span>
        <ChevronDown className="w-4 h-4 ml-2" />
      </div>

      {isOpen && (
        <div className={`absolute z-50 ${dropdownPosition === "left" ? "right-0" : "left-0"} mt-1 w-72 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-96 overflow-y-auto`}>
          {Object.keys(groupedOptions).length > 1 ? (
            // Show grouped providers if we have multiple
            Object.entries(groupedOptions).map(([provider, providerModels]) => (
              <div key={provider}>
                <div className="px-3 py-2 text-xs font-semibold bg-gray-100 dark:bg-gray-700">
                  {provider.toUpperCase()}
                </div>
                {providerModels.map((model) => (
                  <div
                    key={model}
                    className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSelect(model)}
                  >
                    <span className="text-sm">{model}</span>
                    {selectedModel === model && <Check className="w-4 h-4" />}
                  </div>
                ))}
              </div>
            ))
          ) : (
            // Simple list if just one provider
            options.map((model) => (
              <div
                key={model}
                className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSelect(model)}
              >
                <span className="text-sm">{model}</span>
                {selectedModel === model && <Check className="w-4 h-4" />}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
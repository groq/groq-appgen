import { ChevronDown, Check } from "lucide-react";
import { MODEL_OPTIONS } from "@/data/models";
import { useState, useEffect, useRef } from "react";

const ModelSelector = ({ options = MODEL_OPTIONS, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("selectedModel") || options[0] : options[0]
  );
  const dropdownRef = useRef(null);

  // Sync with localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedModel = localStorage.getItem("selectedModel");
      if (storedModel) {
        setSelectedModel(storedModel);
        if (onChange) onChange(storedModel);
      }
    }
  }, [onChange]);

  const handleSelect = (model) => {
    setSelectedModel(model);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedModel", model);
    }
    if (onChange) onChange(model);
    setIsOpen(false);
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
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full md:w-[300px] px-6 py-3 bg-black text-white rounded-full border border-gray-700 hover:bg-gray-900 focus:ring-2 focus:ring-gray-600 transition-all min-w-[150px]"
      >
        <span className="truncate">{selectedModel}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-2 w-full md:w-[300px] bg-black border border-gray-700 rounded-lg shadow-lg">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={`flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-gray-800 transition-colors gap-4 ${
                selectedModel === option ? "bg-gray-800 text-blue-400" : "text-white"
              }`}
            >
              <span>{option}</span>
              {selectedModel === option && <Check className="w-4 h-4 text-blue-400" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ModelSelector;

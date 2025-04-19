import { ChevronDown, Check } from "lucide-react";
import { MODEL_OPTIONS } from "@/utils/models";
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
      const storedModel = localStorage.getItem("selectedModel");
      if (storedModel && options.includes(storedModel)) {
        return storedModel;
      }
    }
    return options[0];
  });
  const [dropdownPosition, setDropdownPosition] = useState("right");
  const dropdownRef = useRef(null);

  // Update selectedModel when initialModel changes externally
  useEffect(() => {
    if (initialModel && initialModel !== selectedModel && options.includes(initialModel)) {
      setSelectedModel(initialModel);
    } else if (initialModel && !options.includes(initialModel)) {
      const defaultModel = options[0];
      setSelectedModel(defaultModel);
      if (onChange) onChange(defaultModel);
    }
  }, [initialModel, selectedModel, options, onChange]);

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
        className="flex items-center justify-end gap-1 cursor-pointer bg-black/10 hover:bg-black/20 text-gray-400 hover:text-gray-300 rounded-full p-1.5 transition-colors border border-gray-800 hover:border-orange-500/30"
        style={{ backdropFilter: 'blur(3px)' }}
      >
        <span className="text-gray-400 text-right text-xs">{selectedModel}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""} text-gray-400`}
        />
      </div>

      {isOpen && (
        <ul
          className={`absolute z-50 mt-2 ${dropdownPosition === "left" ? "right-0" : "left-0"} w-full md:w-[300px] bg-black/90 border border-gray-700 rounded-lg shadow-lg max-h-[50vh] overflow-y-auto`}
          style={{ backdropFilter: 'blur(10px)' }}
        >
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={`flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-black/50 hover:border-l-2 hover:border-orange-500
 transition-colors gap-4 ${
                selectedModel === option ? "bg-black/40 border-l-2 border-orange-500 text-orange-300" : "text-white border-l-2 border-transparent"
              }`}
            >
              <span className="text-sm">{option}</span>
              {selectedModel === option && <Check className="w-4 h-4 text-orange-400" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ModelSelector;

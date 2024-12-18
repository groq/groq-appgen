import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

interface VersionSwitcherProps {
  currentVersion: number;
  totalVersions: number;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}

export function VersionSwitcher({ 
  currentVersion, 
  totalVersions, 
  onPrevious, 
  onNext,
  className = ""
}: VersionSwitcherProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={onPrevious}
        disabled={currentVersion <= 1}
        className={`p-2 rounded ${currentVersion <= 1 ? 'text-gray-400' : 'hover:bg-gray-100'}`}
        aria-label="Previous version"
      >
        <IoChevronBackOutline size={20} />
      </button>
      <span className="text-sm dark:text-gray-400 text-gray-600 min-w-[80px] text-center">
        Version {currentVersion} of {totalVersions}
      </span>
      <button
        onClick={onNext}
        disabled={currentVersion >= totalVersions}
        className={`p-2 rounded ${currentVersion >= totalVersions ? 'text-gray-400' : 'hover:bg-gray-100'}`}
        aria-label="Next version"
      >
        <IoChevronForwardOutline size={20} />
      </button>
    </div>
  );
}

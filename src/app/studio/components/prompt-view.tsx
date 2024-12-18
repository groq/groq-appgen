import { MicrophoneButton } from "@/components/MicrophoneButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStudio } from "@/providers/studio-provider";

const APP_SUGGESTIONS = [
  "Calculator",
  "Todo List",
  "Weather App",
  "Quiz App",
  "Note Taker",
  "Recipe Finder",
  "Chatbot",
  "Image Gallery",
  "Music Player",
  "Video Player",
  "Calendar",
  "Task Manager",
  "Expense Tracker",
  "Budget Planner",
];

export default function PromptView() {
  const { setStudioMode, query, setQuery, setTriggerGeneration } = useStudio();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStudioMode(true);
    setTriggerGeneration(true);
  };

  const handleSuggestionClick = (suggestion: string) => () => {
    setQuery(suggestion);
    setStudioMode(true);
    setTriggerGeneration(true);
  };

  const handleTranscription = (transcription: string) => {
    setQuery(transcription);
    setStudioMode(true);
    setTriggerGeneration(true);
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-center h-screen">
      <div className="flex flex-col gap-3 items-center justify-center min-w-[30%]">
        <h1 className="text-[3em] font-montserrat mb-2 text-center">Build a micro-app</h1>
        <h2 className="text-[2em] font-montserrat mb-8 text-center italic text-muted-foreground">in seconds</h2>
        <form
          className="flex row gap-3 items-center justify-center w-full border-border border-solid border-2 rounded-full p-2 focus-within:border-primary"
          onSubmit={handleSubmit}
        >
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full max-w-md border-0 md:text-lg p-3 focus:outline-none focus:border-0 focus:ring-0 focus-visible:ring-0 focus-visible:border-0"
            placeholder="Describe your app..."
          />
          <MicrophoneButton onTranscription={handleTranscription} />
          <Button className="rounded-full" type="submit">
            Create
          </Button>
        </form>
      </div>
      <div className="flex row flex-wrap gap-3 items-center justify-center w-[90%] md:w-[60%] lg:w-[30%]">
        {APP_SUGGESTIONS.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            className="rounded-full text-xs"
            onClick={handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}

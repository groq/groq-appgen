import AppLogo from "@/components/app-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStudio } from "@/providers/studio-provider";

const suggestions = [
	"Calculator",
	"Todo List",
	"Weather App",
	"Quiz App",
	"Snake Game",
	"Note Taker",
	"Recipe Finder",
	"Chatbot",
	"Image Gallery",
	"Music Player",
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

	return (
		<div className="flex flex-col gap-6 items-center justify-center h-screen relative">
			<AppLogo className="top-10 absolute" />
			<div className="flex flex-col gap-3 items-center justify-center  md:w-[30%]">
				<h1 className="text-[1.5em] md:text-[3em] font-montserrat mb-10">
					Start a mini-app
				</h1>
				<form
					className="flex row gap-3 items-center justify-center md:w-[400px] border-border border-solid border-2 rounded-full p-2 focus-within:border-groq"
					onSubmit={handleSubmit}
				>
					<Input
						autoFocus
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="w-full max-w-md border-0 md:text-lg p-3 focus:outline-none focus:border-0 focus:ring-0 focus-visible:ring-0 focus-visible:border-0"
						placeholder="Describe your app..."
					/>
					<Button className="rounded-full">Create</Button>
				</form>
			</div>
			<div className="flex row flex-wrap gap-3 items-center justify-center max-w-[90%] md:w-[30%] ">
				{suggestions.map((suggestion) => (
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

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PromptView from "./prompt-view";
import NexusFuturisticView from "./nexus-futuristic-view";
import { useStudio } from "@/providers/studio-provider";

export default function MainView() {
	const { studioMode, setStudioMode } = useStudio();
	const router = useRouter();

	useEffect(() => {
		if (location.search.startsWith("?source=")) {
			setStudioMode(true);
		}

		// Verificar se devemos usar a nova interface full stack
		if (typeof window !== 'undefined') {
			const useFullStack = localStorage.getItem('useFullStack');
			if (useFullStack === 'true') {
				router.push('/main');
				return;
			}

			// Por padrão, usar a interface futurística
			localStorage.setItem('interfaceVersion', 'futuristic');
		}
	}, [setStudioMode, router]);

	// Função para ativar a interface full stack
	const activateFullStack = () => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('useFullStack', 'true');
			router.push('/main');
		}
	};

	if (studioMode) {
		// Sempre usar a interface futurística com botão para a nova interface
		return (
			<div className="relative">
				<NexusFuturisticView />
				<div className="absolute bottom-4 right-4 z-50">
					<button
						className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 rounded-md px-4 py-2 text-sm font-medium transition-colors"
						onClick={activateFullStack}
					>
						Experimentar Nexus Full Stack
					</button>
				</div>
			</div>
		);
	}

	return <PromptView />;
}

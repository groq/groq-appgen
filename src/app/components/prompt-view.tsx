import AppLogo from "@/components/AppLogo";
import { MicrophoneButton } from "@/components/MicrophoneButton";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/providers/studio-provider";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { useState, useEffect } from "react";
import { APP_EXAMPLES } from "@/data/app-examples";
import { Info, Pencil, Zap, Sparkles, Eye, Image, Monitor, Crop, MousePointer, MessageSquare, Upload, ChevronLeft, ChevronRight, Check, Cpu, ArrowRight } from "lucide-react";
import html2canvas from "html2canvas";
import { analyzeUX } from "@/utils/ux-agent";
import { analyzeCurrentInterface } from "@/utils/analyze-interface";
import AnalysisReport from "@/components/AnalysisReport";
import { saveAnalysisLog } from "@/utils/log-storage";
import Link from "next/link";
import toast from "react-hot-toast";
import { MAINTENANCE_GENERATION } from "@/lib/settings";
import ElementSelector from "@/components/ElementSelector";
import FeedbackForm from "@/components/FeedbackForm";
import ImageUploader from "@/components/ImageUploader";
import ModelSelector from "@/components/model-selector";
import { MODEL_OPTIONS } from "@/utils/models";
// Removido import do TechnologyCarousel

const APP_SUGGESTIONS = APP_EXAMPLES.map((example) => example.label);

export default function PromptView() {
	const {
		setStudioMode,
		query,
		setQuery,
		setTriggerGeneration,
		drawingData,
		setDrawingData,
		resetStreamingState,
		model,
		setModel,
	} = useStudio();
	const [showDrawing, setShowDrawing] = useState(false);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [showUXMenu, setShowUXMenu] = useState(false);
	const [showAreaSelector, setShowAreaSelector] = useState(false);
	const [showElementSelector, setShowElementSelector] = useState(false);
	const [showFeedbackForm, setShowFeedbackForm] = useState(false);
	const [showImageUploader, setShowImageUploader] = useState(false);
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const [analysisReport, setAnalysisReport] = useState<any>(null);
	const [showAnalysisReport, setShowAnalysisReport] = useState(false);
	const [userFeedback, setUserFeedback] = useState<string | null>(null);
	const [referenceImages, setReferenceImages] = useState<string[]>([]);
	const [showModelMenu, setShowModelMenu] = useState(false);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Verificar se é o comando mágico /analiseux
		if (query.trim().toLowerCase() === '/analiseux') {
			// Processar o comando mágico
			toast.info('Executando análise automática...');
			setTimeout(() => handleAnalyzeInterface(), 1000);
			// Limpar o campo de consulta
			setQuery('');
			return;
		}

		// Removida a verificação de query vazia para permitir envio mesmo sem texto
		resetStreamingState();

		// Definir estado de carregamento
		setIsLoading(true);

		// Salvar a preferência para usar a interface futurística
		if (typeof window !== 'undefined') {
			localStorage.setItem('interfaceVersion', 'futuristic');
		}

		// Ir para a página principal e iniciar a geração
		setStudioMode(true);
		setTriggerGeneration(true);

		// Simular o fim do carregamento após a geração começar
		setTimeout(() => {
			setIsLoading(false);
		}, 2000);
	};

	const handleDrawingComplete = async (imageData: string) => {
		setDrawingData(imageData);
		setShowDrawing(false);
	};

	const handleSuggestionClick = (suggestion: string) => () => {
		const example = APP_EXAMPLES.find((ex) => ex.label === suggestion);
		setQuery(example?.prompt || suggestion);

		resetStreamingState();

		// Salvar a preferência para usar a interface futurística
		if (typeof window !== 'undefined') {
			localStorage.setItem('interfaceVersion', 'futuristic');
		}

		setStudioMode(true);
		setTriggerGeneration(true);
	};

	const handleTranscription = (transcription: string) => {
		setQuery(transcription);

		resetStreamingState();

		// Salvar a preferência para usar a interface futurística
		if (typeof window !== 'undefined') {
			localStorage.setItem('interfaceVersion', 'futuristic');
		}

		setStudioMode(true);
		setTriggerGeneration(true);
	};

	// Função para analisar a interface atual
	const handleAnalyzeInterface = () => {
		analyzeCurrentInterface({
			setIsAnalyzing,
			setAnalysisReport,
			setCapturedImage,
			setShowAnalysisReport
		});
	};

	// Função para enviar o relatório ao codificador
	const handleSendToCodeEditor = (report: any) => {
		console.log('Enviando relatório ao codificador:', report);
		toast.success('Relatório enviado ao codificador!');
		setShowAnalysisReport(false);
	};

	// Função para lidar com a captura de elementos
	const handleElementCapture = (imageData: string, comment: string, element: Element) => {
		setCapturedImage(imageData);
		setUserFeedback(comment);
		setShowElementSelector(false);

		// Analisar o elemento capturado
		const imageBase64 = imageData.split(',')[1];
		toast.loading('Analisando elemento...', { id: 'analyze-element' });

		analyzeUX(imageBase64, comment || 'Análise do elemento selecionado')
			.then(result => {
				setAnalysisReport(result);
				toast.success('Análise concluída!', { id: 'analyze-element' });
				setShowAnalysisReport(true);
			})
			.catch(error => {
				console.error('Erro na análise:', error);
				toast.error('Erro ao analisar elemento', { id: 'analyze-element' });
			});
	};

	// Função para lidar com o feedback do usuário
	const handleFeedbackSubmit = (feedback: string, captureScreen?: boolean) => {
		setUserFeedback(feedback);
		setShowFeedbackForm(false);

		if (captureScreen) {
			// Já temos a captura de tela
			const imageBase64 = capturedImage!.split(',')[1];
			toast.loading('Analisando feedback...', { id: 'analyze-feedback' });

			analyzeUX(imageBase64, feedback)
				.then(result => {
					setAnalysisReport(result);
					toast.success('Análise concluída!', { id: 'analyze-feedback' });
					setShowAnalysisReport(true);
				})
				.catch(error => {
					console.error('Erro na análise:', error);
					toast.error('Erro ao analisar feedback', { id: 'analyze-feedback' });
				});
		} else {
			// Capturar a tela primeiro
			toast.loading('Capturando tela...', { id: 'analyze-feedback' });

			setTimeout(() => {
				html2canvas(document.body).then(canvas => {
					const imageData = canvas.toDataURL('image/png');
					setCapturedImage(imageData);
					const imageBase64 = imageData.split(',')[1];

					toast.loading('Analisando feedback...', { id: 'analyze-feedback' });

					analyzeUX(imageBase64, feedback)
						.then(result => {
							setAnalysisReport(result);
							toast.success('Análise concluída!', { id: 'analyze-feedback' });
							setShowAnalysisReport(true);
						})
						.catch(error => {
							console.error('Erro na análise:', error);
							toast.error('Erro ao analisar feedback', { id: 'analyze-feedback' });
						});
				});
			}, 500);
		}
	};

	// Função para lidar com o upload de imagens
	const handleImageUpload = (images: string[], comment: string) => {
		setReferenceImages(images);
		setUserFeedback(comment);
		setShowImageUploader(false);

		// Capturar a tela atual
		toast.loading('Capturando tela...', { id: 'analyze-images' });

		setTimeout(() => {
			html2canvas(document.body).then(canvas => {
				const imageData = canvas.toDataURL('image/png');
				setCapturedImage(imageData);
				const imageBase64 = imageData.split(',')[1];

				toast.loading('Analisando com imagens de referência...', { id: 'analyze-images' });

				// Construir um prompt que inclui as imagens de referência
				const prompt = `Análise com imagens de referência: ${comment}\n\nO usuário forneceu ${images.length} imagens de referência para comparação.`;

				analyzeUX(imageBase64, prompt)
					.then(result => {
						setAnalysisReport(result);
						toast.success('Análise concluída!', { id: 'analyze-images' });
						setShowAnalysisReport(true);
					})
					.catch(error => {
						console.error('Erro na análise:', error);
						toast.error('Erro ao analisar com imagens de referência', { id: 'analyze-images' });
					});
			});
		}, 500);
	};

	// Função para otimizar o prompt mantendo o idioma original
	const optimizePrompt = () => {
		if (!query.trim()) {
			toast.error("Por favor, digite algo primeiro");
			return;
		}

		toast.loading("Otimizando seu prompt...", { id: "optimize-prompt" });

		// Simulação de otimização de prompt
		setTimeout(() => {
			const isPortuguese = /[\u00C0-\u00FF]/.test(query) ||
							 /\b(e|o|a|os|as|um|uma|uns|umas|de|da|do|em|no|na|para)\b/.test(query.toLowerCase());

			let optimizedText = "";

			if (isPortuguese) {
				// Versão otimizada em português
				if (query.toLowerCase().includes("todo") || query.toLowerCase().includes("lista")) {
					optimizedText = `Crie uma aplicação de lista de tarefas (Todo List) com as seguintes características:
- Interface limpa e minimalista com fundo escuro
- Campo para adicionar novas tarefas
- Botão para adicionar tarefa
- Lista de tarefas com checkbox para marcar como concluídas
- Botão para excluir tarefas
- Contador de tarefas pendentes
- Filtros para mostrar todas as tarefas, apenas pendentes ou apenas concluídas
- Armazenamento local para persistir as tarefas mesmo após recarregar a página
- Design responsivo que funcione bem em dispositivos móveis e desktop`;
				} else {
					optimizedText = query + "\n\nPor favor, crie uma interface com design moderno, responsivo e intuitivo. Utilize cores contrastantes, tipografia legível e espaçamento adequado entre os elementos. Garanta que a experiência do usuário seja fluida e agradável.";
				}
			} else {
				// Versão otimizada em inglês
				if (query.toLowerCase().includes("todo") || query.toLowerCase().includes("list")) {
					optimizedText = `Create a Todo List application with the following features:
- Clean, minimalist interface with dark background
- Input field to add new tasks
- Add task button
- Task list with checkboxes to mark as completed
- Delete task button
- Pending tasks counter
- Filters to show all tasks, only pending, or only completed
- Local storage to persist tasks even after page reload
- Responsive design that works well on mobile and desktop devices`;
				} else {
					optimizedText = query + "\n\nPlease create an interface with modern, responsive, and intuitive design. Use contrasting colors, readable typography, and adequate spacing between elements. Ensure that the user experience is smooth and pleasant.";
				}
			}

			setQuery(optimizedText);
			toast.success("Prompt otimizado!", { id: "optimize-prompt" });
		}, 1500);
	};

	// Bloquear rolagem e ajustar tamanho quando o componente montar
	useEffect(() => {
		// Salvar o overflow original
		const originalOverflow = document.body.style.overflow;
		// Bloquear rolagem
		document.body.style.overflow = 'hidden';

		// Função para ajustar altura com base na viewport
		const adjustHeight = () => {
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		};

		// Ajustar altura inicialmente
		adjustHeight();

		// Ajustar altura quando a janela for redimensionada
		window.addEventListener('resize', adjustHeight);

		// Restaurar quando o componente desmontar
		return () => {
			document.body.style.overflow = originalOverflow;
			window.removeEventListener('resize', adjustHeight);
		};
	}, []);

	// Fechar menu de modelos quando clicar fora dele
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (showModelMenu && !(event.target as Element).closest('.model-menu-container') && !(event.target as Element).closest('.model-menu-button')) {
				setShowModelMenu(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showModelMenu]);

	return (
		<div className="flex flex-col items-center justify-start bg-gradient-to-b from-black to-gray-950 min-h-screen py-2 px-4 overflow-hidden" style={{ backgroundColor: '#050505', height: 'calc(var(--vh, 1vh) * 100)', maxHeight: 'calc(var(--vh, 1vh) * 100)', paddingBottom: '2rem' }}>
			<div className="flex flex-col items-center justify-between w-full max-w-3xl mx-auto h-full py-4" style={{ gap: '1rem' }}>

			{/* Botão de análise UX no canto superior direito */}
			<div className="absolute top-4 right-4 z-10">
				<div className="relative">
					<Button
						variant="ghost"
						size="icon"
						className="w-[1.65rem] h-[1.65rem] rounded-full bg-black/10 text-gray-500 hover:text-white opacity-40 hover:opacity-80 transition-all"
						onClick={isAnalyzing ? undefined : () => setShowUXMenu(!showUXMenu)}
						disabled={isAnalyzing}
					>
						{isAnalyzing ? (
							<div className="h-3 w-3 animate-spin rounded-full border-b-2 border-white" />
						) : (
							<Eye className="h-[0.825rem] w-[0.825rem]" />
						)}
					</Button>

					{/* Menu de opções de análise UX */}
					{showUXMenu && (
						<div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-black/80 backdrop-blur-sm border border-gray-700 overflow-hidden z-50">
							<div className="py-1">
								<button
									className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-orange-500/20 hover:text-white transition-colors"
									onClick={() => {
										setShowUXMenu(false);
										handleAnalyzeInterface();
									}}
								>
									<Monitor className="h-4 w-4 mr-2" />
									Capturar tela inteira
								</button>
								<button
									className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-orange-500/20 hover:text-white transition-colors"
									onClick={() => {
										setShowUXMenu(false);
										setShowElementSelector(true);
									}}
								>
									<MousePointer className="h-4 w-4 mr-2" />
									Selecionar elementos
								</button>
								<button
									className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-orange-500/20 hover:text-white transition-colors"
									onClick={() => {
										setShowUXMenu(false);
										setShowAreaSelector(true);
									}}
								>
									<Crop className="h-4 w-4 mr-2" />
									Capturar por região
								</button>
								<button
									className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-orange-500/20 hover:text-white transition-colors"
									onClick={() => {
										setShowUXMenu(false);
										setShowFeedbackForm(true);
									}}
								>
									<MessageSquare className="h-4 w-4 mr-2" />
									Enviar mensagem ao agente
								</button>
								<button
									className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-orange-500/20 hover:text-white transition-colors"
									onClick={() => {
										setShowUXMenu(false);
										setShowImageUploader(true);
									}}
								>
									<Upload className="h-4 w-4 mr-2" />
									Enviar imagens de referência
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Logo e título no canto superior esquerdo */}
			<div className="flex justify-start items-center w-full px-4 mt-2 absolute top-0 left-0">
				<div className="flex items-center gap-2">
					<div className="flex flex-col">
						<h1 className="font-montserrat text-[1.43em] md:text-[1.65em] font-bold">
							<span className="text-white">Nexus</span>{" "}<span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-gray-300 text-[0.85em]">Gen</span>
						</h1>
						<p className="text-xs text-gray-400">Powered by Groq</p>
					</div>
				</div>
			</div>

			{/* Conteúdo central com logo e título - movido mais para cima */}
			<div className="flex flex-col gap-1 items-center justify-center min-w-[50%] max-w-[800px] px-4 md:px-0 mt-0 flex-1" style={{ marginTop: '-1rem' }}>
				<div className="flex flex-col items-center mb-2 relative mt-0">
					{/* Animação binária ao redor do logo - completamente estática */}
					<div className="absolute inset-0 opacity-30 z-0 overflow-hidden w-[350px] h-[350px]" style={{ position: 'absolute', top: '-80px', left: '-80px', right: '-80px', bottom: '-80px' }}>
						<div className="binary-animation"></div>
					</div>
					{/* Apenas o logo tem animação de saltos e efeito de escurecer/acender */}
					<div className="relative z-10" style={{ position: 'relative' }}>
						<div className="animate-bounce-slow">
							<div className="animate-pulse-opacity">
								<AppLogo size={100} />
							</div>
						</div>
					</div>

					<div className="relative mt-2">
						<h1 className="text-[2.2em] md:text-[3em] font-montserrat text-center font-bold">
							Build <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-300">intelligent apps</span>
						</h1>
						<p className="text-center text-gray-300 mt-1 flex items-center justify-center text-sm font-medium">
							with AI-powered development <span className="ml-1 text-orange-400 animate-pulse"><Zap className="h-[1.17rem] w-[1.17rem]" /></span>
						</p>
						<div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>
						<div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>
					</div>
				</div>
				{MAINTENANCE_GENERATION && (
					<div className="text-center text-gray-500 flex items-center gap-2 border border-groq rounded-full p-4 mb-3">
						<Info className="h-5 w-5" />
						{"We're currently undergoing maintenance. We'll be back soon!"}
					</div>
				)}

				{/* Espaçador */}
				<div className="h-10"></div>

				{/* Campo de entrada de texto com efeito de neon */}
				<form
					className="flex flex-col relative border border-orange-500/30 border-solid rounded-lg p-4 w-full max-w-7xl focus-within:border-orange-500/60 shadow-lg transition-all duration-300 ease-in-out hover:shadow-orange-500/50 focus-within:shadow-orange-500/70 mb-2 mx-auto"
					style={{
						boxShadow: '0 0 15px rgba(255, 165, 0, 0.3), inset 0 0 10px rgba(255, 165, 0, 0.1)',
						position: 'relative',
						background: 'rgba(0, 0, 0, 0.3)',
					}}
					onSubmit={handleSubmit}
				>
					{/* Efeito de neon ao redor do input */}
					<div
						className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-orange-500/70 via-orange-300/40 to-orange-500/70 blur-sm z-[-1] opacity-80"
						style={{ backgroundSize: '200% 100%', boxShadow: '0 0 15px rgba(255, 165, 0, 0.5)' }}
					/>
					{/* Linha de energia percorrendo a borda */}
					<div
						className="absolute -inset-[1px] rounded-lg overflow-hidden z-[-1]"
					>
						{/* Linhas horizontais */}
						<div className="absolute top-0 left-0 w-full h-[2px] overflow-hidden">
							<div className="absolute top-0 left-0 w-[30%] h-full bg-orange-500 animate-energy-flow" style={{ boxShadow: '0 0 10px 2px rgba(255, 165, 0, 0.7)' }}></div>
						</div>
						<div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
							<div className="absolute top-0 left-0 w-[30%] h-full bg-orange-500 animate-energy-flow" style={{ animationDelay: '1s', boxShadow: '0 0 10px 2px rgba(255, 165, 0, 0.7)' }}></div>
						</div>
						{/* Linhas verticais */}
						<div className="absolute top-0 left-0 h-full w-[2px] overflow-hidden">
							<div className="absolute top-0 left-0 h-[30%] w-full bg-orange-500 animate-energy-flow" style={{ animationDelay: '0.5s', boxShadow: '0 0 10px 2px rgba(255, 165, 0, 0.7)' }}></div>
						</div>
						<div className="absolute top-0 right-0 h-full w-[2px] overflow-hidden">
							<div className="absolute top-0 left-0 h-[30%] w-full bg-orange-500 animate-energy-flow" style={{ animationDelay: '1.5s', boxShadow: '0 0 10px 2px rgba(255, 165, 0, 0.7)' }}></div>
						</div>
					</div>
					<textarea
						disabled={MAINTENANCE_GENERATION}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="w-full h-[3rem] p-3 text-sm bg-transparent focus:outline-none resize-none rounded transition-all duration-300 ease-in-out placeholder-gray-500 focus:placeholder-orange-300 border-none"
						placeholder="Describe your app..."
						style={{
							backdropFilter: 'blur(5px)',
						}}
					/>
						<div className="flex justify-between items-center w-full mt-4">
						<div className="flex items-center gap-2">
						<Button
							disabled={MAINTENANCE_GENERATION}
							type="button"
							variant="ghost"
							size="icon"
							className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center p-0"
							onClick={() => setShowDrawing(true)}
						>
							{drawingData ? (
								<Pencil className="h-3.5 w-3.5" />
							) : (
								<Pencil className="h-3.5 w-3.5" />
							)}
						</Button>
						{/* Botão para inserir imagem */}
						<Button
							disabled={MAINTENANCE_GENERATION}
							type="button"
							variant="ghost"
							size="icon"
							className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center p-0"
							onClick={() => {}}
						>
							<Image className="h-3.5 w-3.5" />
						</Button>
						<MicrophoneButton
							onTranscription={handleTranscription}
							disabled={MAINTENANCE_GENERATION}
							small={true}
						/>
						</div>
						<div className="flex items-center gap-2">
							{/* Botão de otimização de prompt */}
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center p-0 text-gray-400 hover:text-orange-300"
								onClick={() => optimizePrompt()}
								disabled={MAINTENANCE_GENERATION}
							>
								<Sparkles className="h-3.5 w-3.5" />
							</Button>

							{/* Botão de seleção de modelo */}
							<div className="relative">
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center p-0 model-menu-button ${showModelMenu ? 'bg-orange-500/20 text-orange-300' : 'text-gray-400 hover:text-orange-300'}`}
									onClick={() => setShowModelMenu(!showModelMenu)}
								>
									<Cpu className="h-3.5 w-3.5" />
								</Button>

								{/* Menu de modelos - versão mais bonita que abre para cima */}
								{showModelMenu && (
									<div
										className="absolute right-0 bottom-full mb-2 w-[300px] rounded-lg shadow-lg overflow-hidden z-50 model-menu-container animate-fade-in"
										style={{
											backdropFilter: 'blur(10px)',
											background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.8))',
											borderRadius: '0.5rem',
											border: '1px solid rgba(255,165,0,0.2)',
											boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 10px rgba(255,165,0,0.2)',
										}}
									>
										<div className="p-1.5">
											<div className="text-xs font-medium text-gray-400 mb-1.5 px-2 pb-1.5 border-b border-gray-800/60">Selecione o modelo:</div>
											<div className="max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500/30 scrollbar-track-transparent">
												{MODEL_OPTIONS.slice(0, 6).map((modelOption) => {
													// Usar o nome completo do modelo
													const displayName = modelOption;
													// Determinar o tipo de modelo para exibir um ícone ou cor diferente
													const isVision = modelOption.includes('vision') || modelOption.includes('llama-4');
													const isCoder = modelOption.includes('coder');

													return (
														<div
															key={modelOption}
															className={`flex items-center justify-between px-2.5 py-1.5 cursor-pointer rounded-md mx-1 my-0.5 transition-all duration-200 ${model === modelOption ? 'bg-gradient-to-r from-orange-500/30 to-orange-500/10 text-orange-300' : 'text-gray-300 hover:bg-black/40 hover:text-orange-200'}`}
															style={{
																boxShadow: model === modelOption ? '0 0 8px rgba(255,165,0,0.15)' : 'none'
															}}
															onClick={() => {
																setModel(modelOption);
																setShowModelMenu(false);
																toast.success(`Modelo alterado para ${displayName}`);
															}}
														>
															<div className="flex items-center gap-1.5">
																<div className={`w-2 h-2 rounded-full ${isVision ? 'bg-blue-400' : isCoder ? 'bg-green-400' : 'bg-orange-400'} ${model === modelOption ? 'animate-pulse' : ''}`}
																	style={{ boxShadow: `0 0 5px ${isVision ? 'rgba(59,130,246,0.5)' : isCoder ? 'rgba(74,222,128,0.5)' : 'rgba(251,146,60,0.5)'}` }}
																></div>
																<span className="text-xs font-medium">{displayName}</span>
															</div>
															{model === modelOption && <Check className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />}
														</div>
													);
												})}
											</div>
										</div>
									</div>
								)}
							</div>

							<Button
								className={`rounded-full transition-all duration-300 border text-xs active:scale-95 transform bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30 hover:border-orange-500/50`}
								type="submit"
								disabled={MAINTENANCE_GENERATION || isLoading}
							>
								<span className="flex items-center gap-1">
									{isLoading ? (
										<div className="h-3 w-3 animate-spin rounded-full border-b-2 border-white"></div>
									) : (
										<>Create <Sparkles className="h-[0.825rem] w-[0.825rem]" /></>
									)}
								</span>
							</Button>
						</div>
					</div>
				</form>

				{/* Removido carrossel de tecnologias */}
			</div>

			{/* Componentes de interação */}
			{showDrawing && (
				<DrawingCanvas
					onDrawingComplete={handleDrawingComplete}
					onClose={() => setShowDrawing(false)}
				/>
			)}

			{showElementSelector && (
				<ElementSelector
					onCapture={handleElementCapture}
					onCancel={() => setShowElementSelector(false)}
				/>
			)}

			{showFeedbackForm && (
				<FeedbackForm
					onSubmit={handleFeedbackSubmit}
					onCancel={() => setShowFeedbackForm(false)}
					capturedImage={capturedImage}
				/>
			)}

			{showImageUploader && (
				<ImageUploader
					onSubmit={handleImageUpload}
					onCancel={() => setShowImageUploader(false)}
				/>
			)}

			{showAnalysisReport && analysisReport && capturedImage && (
				<AnalysisReport
					imageData={capturedImage}
					analysis={analysisReport}
					onClose={() => setShowAnalysisReport(false)}
					onSend={handleSendToCodeEditor}
					referenceImages={referenceImages.length > 0 ? referenceImages : undefined}
					userComment={userFeedback || undefined}
				/>
			)}

			{/* Botões de sugestão removidos conforme solicitado */}
			</div>
		</div>
	);
}

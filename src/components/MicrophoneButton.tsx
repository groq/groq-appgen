import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Loader } from "lucide-react";

interface MicrophoneButtonProps {
	onTranscription: (text: string) => void;
	disabled?: boolean;
	small?: boolean;
}

export function MicrophoneButton({
	onTranscription,
	disabled,
	small = false,
}: MicrophoneButtonProps) {
	const [isRecording, setIsRecording] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const mediaRecorder = useRef<MediaRecorder | null>(null);
	const audioChunks = useRef<Blob[]>([]);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorder.current = new MediaRecorder(stream);
			audioChunks.current = [];

			mediaRecorder.current.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunks.current.push(event.data);
				}
			};

			mediaRecorder.current.onstop = async () => {
				setIsProcessing(true);
				setIsRecording(false);

				try {
					// Criar blob de áudio
					const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });

					// Criar FormData para enviar o arquivo
					const formData = new FormData();
					formData.append("file", audioBlob, "recording.wav");

					// Enviar para a API de transcrição
					const response = await fetch("/api/speech-to-text", {
						method: "POST",
						body: formData,
					});

					if (!response.ok) {
						throw new Error('Falha ao transcrever áudio');
					}

					const data = await response.json();

					// Chamar o callback com o texto transcrito
					if (data.text) {
						onTranscription(data.text);
					}
				} catch (error) {
					console.error("Erro ao processar áudio:", error);
				} finally {
					setIsProcessing(false);

					// Limpar o stream de áudio
					for (const track of stream.getTracks()) {
						track.stop();
					}
				}
			};

			mediaRecorder.current.start();
			setIsRecording(true);
		} catch (error) {
			console.error("Erro ao acessar microfone:", error);
		}
	};

	const stopRecording = () => {
		if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
			mediaRecorder.current.stop();
		}
	};

	const toggleRecording = () => {
		if (isRecording) {
			stopRecording();
		} else {
			startRecording();
		}
	};

	return (
		<div className="relative">
			<Button
				disabled={disabled || isProcessing}
				type="button"
				variant="ghost"
				size="icon"
				className={`rounded-full shrink-0 flex items-center justify-center ${small ? 'p-0 w-8 h-8' : 'px-3 min-w-[40px]'} relative z-10 ${
					isProcessing ? "text-gray-500" :
					isRecording ? "text-orange-500 hover:text-orange-600" : ""
				}`}
				onClick={toggleRecording}
			>
				{isProcessing ? (
					<Loader className={small ? "h-3.5 w-3.5 animate-spin" : "h-[1.375rem] w-[1.375rem] animate-spin"} />
				) : (
					<Mic className={small ? "h-3.5 w-3.5" : "h-[1.375rem] w-[1.375rem]"} />
				)}
			</Button>
			{isRecording && (
				<div className="absolute inset-0 z-0">
					<div className="absolute inset-0 animate-ping rounded-full bg-orange-400 opacity-75" />
					<div className="absolute inset-[-4px] animate-pulse rounded-full bg-orange-300 opacity-50" />
					<div className="absolute inset-[-8px] animate-pulse delay-75 rounded-full bg-orange-200 opacity-25" />
				</div>
			)}
		</div>
	);
}

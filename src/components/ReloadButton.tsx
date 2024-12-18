import type { RefObject } from "react";
import { IoReloadOutline } from "react-icons/io5";
import { Tooltip } from "react-tooltip";
import { Button } from "./ui/button";

interface ReloadButtonProps {
	iframeRef: RefObject<HTMLIFrameElement>;
}

export function ReloadButton({ iframeRef }: ReloadButtonProps) {
	const handleReload = () => {
		if (iframeRef.current) {
			const currentSrcDoc = iframeRef.current.srcdoc;
			iframeRef.current.srcdoc = '';
			iframeRef.current.srcdoc = currentSrcDoc;
		}
	};

	return (
		<>
			<Button
				onClick={handleReload}
				variant="outline"
				size="icon"
				data-tooltip-id="reload-tooltip"
				data-tooltip-content="Reload preview"
			>
				<IoReloadOutline size={20} />
			</Button>
			<Tooltip
				id="reload-tooltip"
				place="left"
				className="!bg-gray-800 !px-2 !py-1 !text-sm !z-50"
			/>
		</>
	);
}

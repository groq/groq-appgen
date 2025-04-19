import html2canvas from 'html2canvas';
import { analyzeUX } from './ux-agent';
import { saveAnalysisLog } from './log-storage';
import toast from 'react-hot-toast';
import { UXAnalysisResult } from './ux-agent';

export interface AnalyzeInterfaceCallbacks {
  setIsAnalyzing: (value: boolean) => void;
  setAnalysisReport: (report: UXAnalysisResult) => void;
  setCapturedImage: (image: string) => void;
  setShowAnalysisReport: (show: boolean) => void;
}

export const analyzeCurrentInterface = (callbacks: AnalyzeInterfaceCallbacks) => {
  const { setIsAnalyzing, setAnalysisReport, setCapturedImage, setShowAnalysisReport } = callbacks;

  setIsAnalyzing(true);
  toast.loading('Capturando tela para análise...', { id: 'analyze-interface' });

  setTimeout(() => {
    // Esconder elementos de UI temporariamente
    const elementsToHide = document.querySelectorAll('.element-selector-ui, .area-selector-ui');
    elementsToHide.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.visibility = 'hidden';
      }
    });

    html2canvas(document.body, {
      ignoreElements: (element) => {
        // Ignorar elementos de UI de seleção
        return element.classList.contains('element-selector-ui') ||
               element.classList.contains('area-selector-ui');
      }
    }).then(canvas => {
      // Restaurar a visibilidade dos elementos
      elementsToHide.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.visibility = '';
        }
      });

      const imageData = canvas.toDataURL('image/png');
      const imageBase64 = imageData.split(',')[1];

      toast.loading('Analisando interface com modelo de visão...', { id: 'analyze-interface' });

      analyzeUX(imageBase64, 'Análise completa da interface atual')
        .then(result => {
          // Salvar o log para análise posterior
          const logId = saveAnalysisLog(result, imageData, 'Análise automática da interface');

          // Exibir no console para análise
          console.log('Resultado da análise UX:', result);
          console.log('Log ID para referência:', logId);

          // Mostrar o relatório de análise
          toast.success('Análise concluída!', { id: 'analyze-interface' });
          setIsAnalyzing(false);

          // Armazenar o resultado da análise
          setAnalysisReport(result);
          setCapturedImage(imageData);

          // Mostrar o componente de relatório
          setShowAnalysisReport(true);
        })
        .catch(error => {
          console.error('Erro na análise:', error);
          toast.error('Erro ao analisar interface', { id: 'analyze-interface' });
          setIsAnalyzing(false);
        });
    });
  }, 500);
};

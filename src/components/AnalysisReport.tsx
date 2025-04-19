import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Check, Save, Send } from 'lucide-react';
import { UXAnalysisResult } from '@/utils/ux-agent';
import { saveAnalysisLog } from '@/utils/log-storage';
import toast from 'react-hot-toast';

interface AnalysisReportProps {
  imageData: string;
  analysis: UXAnalysisResult;
  onClose: () => void;
  onSend: (report: any) => void;
  referenceImages?: string[];
  userComment?: string;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({
  imageData,
  analysis,
  onClose,
  onSend,
  referenceImages,
  userComment
}) => {
  // Preparar o texto dos problemas
  const initialIssuesText = analysis.issues.map(issue =>
    `[${issue.severity.toUpperCase()}] ${issue.type}: ${issue.description}\nLocalização: ${issue.location}${issue.impact ? `\nImpacto: ${issue.impact}` : ''}`
  ).join('\n\n');

  // Preparar o texto das recomendações
  const initialRecommendationsText = analysis.recommendations.join('\n\n');

  // Preparar o texto das alterações de código
  const initialCodeChangesText = analysis.codeChanges ?
    analysis.codeChanges.map(change =>
      `Arquivo: ${change.file}\nDescrição: ${change.description}\n\nCódigo:\n${change.code}`
    ).join('\n\n---\n\n') : '';

  const [issuesText, setIssuesText] = useState(initialIssuesText);
  const [recommendationsText, setRecommendationsText] = useState(initialRecommendationsText);
  const [codeChangesText, setCodeChangesText] = useState(initialCodeChangesText);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const handleSave = () => {
    // Salvar as alterações feitas pelo usuário
    const updatedAnalysis = {
      ...analysis,
      userEdited: true,
      userComment,
      editedIssues: issuesText,
      editedRecommendations: recommendationsText,
      editedCodeChanges: codeChangesText
    };

    // Salvar no log
    const logId = saveAnalysisLog(updatedAnalysis, imageData, userComment);

    toast.success('Relatório salvo com sucesso!');

    return updatedAnalysis;
  };

  const handleSend = () => {
    const updatedAnalysis = handleSave();
    onSend(updatedAnalysis);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 border border-gray-700 rounded-lg p-4 max-w-3xl w-full max-h-[80vh] overflow-auto">
        {/* Modal para visualizar a imagem em tamanho maior */}
        {imageModalOpen && (
          <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4" onClick={() => setImageModalOpen(false)}>
            <div className="relative max-w-4xl max-h-[90vh] overflow-auto">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                onClick={() => setImageModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <img
                src={imageData}
                alt="Captura de tela"
                className="max-w-full max-h-[90vh] object-contain"
              />
            </div>
          </div>
        )}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white text-lg font-medium">Relatório de Análise UX</h3>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <h4 className="text-white text-sm font-medium mb-2">Captura de tela</h4>
            <div
              className="border border-gray-700 rounded-md overflow-hidden bg-black/50 cursor-pointer hover:border-orange-500/50 transition-all"
              onClick={() => setImageModalOpen(true)}
            >
              <div className="relative">
                <img
                  src={imageData}
                  alt="Captura de tela"
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-medium px-2 py-1 bg-black/60 rounded">Clique para ampliar</span>
                </div>
              </div>
            </div>
          </div>

          {referenceImages && referenceImages.length > 0 && (
            <div className="md:col-span-2">
              <h4 className="text-white text-sm font-medium mb-2">Imagens de referência</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {referenceImages.map((img, index) => (
                  <div key={index} className="border border-gray-700 rounded-md overflow-hidden bg-black/50 hover:border-orange-500/50 transition-all">
                    <img
                      src={img}
                      alt={`Referência ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {userComment && (
            <div className="md:col-span-3">
              <h4 className="text-white text-sm font-medium mb-2">Comentário do usuário</h4>
              <div className="border border-gray-700 rounded-md p-3 bg-black/50 text-gray-300 text-sm">
                {userComment}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h4 className="text-white text-sm font-medium mb-2">Problemas identificados</h4>
            <Textarea
              value={issuesText}
              onChange={(e) => setIssuesText(e.target.value)}
              className="bg-black/50 border-gray-700 text-white min-h-[150px] font-mono text-sm"
            />
          </div>

          <div>
            <h4 className="text-white text-sm font-medium mb-2">Recomendações</h4>
            <Textarea
              value={recommendationsText}
              onChange={(e) => setRecommendationsText(e.target.value)}
              className="bg-black/50 border-gray-700 text-white min-h-[150px] font-mono text-sm"
            />
          </div>

          <div>
            <h4 className="text-white text-sm font-medium mb-2">Alterações de código sugeridas</h4>
            <Textarea
              value={codeChangesText}
              onChange={(e) => setCodeChangesText(e.target.value)}
              className="bg-black/50 border-gray-700 text-white min-h-[200px] font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="outline"
            className="border-blue-700 text-blue-400 hover:bg-blue-900/30"
            onClick={handleSave}
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleSend}
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar ao codificador
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;

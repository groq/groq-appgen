import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Upload, Image, Plus, Check } from 'lucide-react';

interface ImageUploaderProps {
  onSubmit: (images: string[], comment: string) => void;
  onCancel: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onSubmit, onCancel }) => {
  const [images, setImages] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (images.length > 0) {
      onSubmit(images, comment);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 border border-gray-700 rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white text-lg font-medium">Enviar imagens de referência</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full text-gray-400 hover:text-white"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-md overflow-hidden border border-gray-700 bg-black/50">
                  <img 
                    src={image} 
                    alt={`Imagem ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  className="absolute top-2 right-2 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ))}
            
            <button
              className="aspect-square rounded-md border border-dashed border-gray-600 flex flex-col items-center justify-center bg-black/30 hover:bg-black/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="h-6 w-6 text-gray-400 mb-2" />
              <span className="text-xs text-gray-400">Adicionar imagem</span>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
            </button>
          </div>
          
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Descreva o que você gostaria que o agente analisasse nestas imagens..."
            className="bg-black/50 border-gray-700 text-white min-h-[120px]"
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleSubmit}
            disabled={images.length === 0}
          >
            <Check className="h-4 w-4 mr-2" />
            Enviar para análise
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;

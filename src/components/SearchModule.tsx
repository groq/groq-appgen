import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, ExternalLink, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchResult } from '@/utils/web-search';

interface SearchModuleProps {
  onSearch: (query: string) => Promise<void>;
  isSearching: boolean;
  searchResults: SearchResult[];
  searchSummary: string;
}

export function SearchModule({ onSearch, isSearching, searchResults, searchSummary }: SearchModuleProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="search-module w-full max-w-xl bg-black/60 border border-orange-500/30 rounded-lg overflow-hidden mb-4">
      <div 
        className="search-header flex items-center justify-between p-3 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center">
          <Search className="h-4 w-4 text-orange-400 mr-2" />
          <span className="text-sm text-gray-200 font-medium">
            {isSearching ? 'Pesquisando referências...' : 'Resultados da pesquisa'}
          </span>
        </div>
        <div className="flex items-center">
          {isSearching && <Loader className="h-3 w-3 text-orange-400 animate-spin mr-2" />}
          {showDetails ? 
            <ChevronUp className="h-4 w-4 text-gray-400" /> : 
            <ChevronDown className="h-4 w-4 text-gray-400" />
          }
        </div>
      </div>
      
      {showDetails && (
        <div className="search-details border-t border-orange-500/20">
          {searchSummary && (
            <div className="p-3 border-b border-orange-500/20 bg-black/40">
              <h4 className="text-xs text-orange-300 mb-1">Resumo da pesquisa</h4>
              <p className="text-xs text-gray-300 whitespace-pre-line">{searchSummary}</p>
            </div>
          )}
          
          <div className="p-3">
            <h4 className="text-xs text-orange-300 mb-2">Fontes</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {searchResults.map((result, index) => (
                <div key={index} className="search-result bg-black/40 p-2 rounded border border-gray-800 hover:border-orange-500/30 transition-all">
                  <div className="flex justify-between items-start">
                    <h5 className="text-xs font-medium text-gray-200 mb-1">{result.title}</h5>
                    <a 
                      href={result.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-orange-400 hover:text-orange-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">{result.snippet}</p>
                  <div className="text-[10px] text-gray-500">{result.source}</div>
                </div>
              ))}
              
              {searchResults.length === 0 && !isSearching && (
                <div className="text-xs text-gray-400 text-center py-2">
                  Nenhum resultado encontrado
                </div>
              )}
              
              {isSearching && (
                <div className="flex flex-col items-center justify-center py-4">
                  <Loader className="h-5 w-5 text-orange-400 animate-spin mb-2" />
                  <p className="text-xs text-gray-400">Buscando informações...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

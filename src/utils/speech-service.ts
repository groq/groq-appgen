/**
 * Serviço de Speech-to-Text e Text-to-Speech
 * 
 * Este módulo fornece funções para conversão de fala para texto e texto para fala
 * usando a API da Groq.
 */

import { Groq } from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Configurar cliente Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

/**
 * Converte fala para texto
 * @param audioBuffer Buffer do arquivo de áudio
 * @param language Idioma do áudio (opcional)
 * @returns Texto transcrito
 */
export async function speechToText(
  audioBuffer: Buffer,
  language?: string
): Promise<string> {
  try {
    // Criar arquivo temporário
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `temp-audio-${Date.now()}.wav`);
    
    // Escrever buffer no arquivo temporário
    fs.writeFileSync(tempFilePath, audioBuffer);
    
    // Abrir o arquivo para envio
    const file = fs.createReadStream(tempFilePath);
    
    // Criar transcrição
    const transcription = await groq.audio.transcriptions.create({
      file,
      model: 'whisper-large-v3-turbo',
      language,
    });
    
    // Remover arquivo temporário
    fs.unlinkSync(tempFilePath);
    
    return transcription.text;
  } catch (error) {
    console.error('Erro ao converter fala para texto:', error);
    throw error;
  }
}

/**
 * Converte texto para fala
 * @param text Texto a ser convertido
 * @param voice Voz a ser usada
 * @returns Buffer do arquivo de áudio
 */
export async function textToSpeech(
  text: string,
  voice: string = 'Fritz-PlayAI'
): Promise<Buffer> {
  try {
    // Criar fala
    const speech = await groq.audio.speech.create({
      model: 'playai-tts',
      voice,
      input: text,
      response_format: 'wav',
    });
    
    // Obter buffer do áudio
    const buffer = Buffer.from(await speech.arrayBuffer());
    
    return buffer;
  } catch (error) {
    console.error('Erro ao converter texto para fala:', error);
    throw error;
  }
}

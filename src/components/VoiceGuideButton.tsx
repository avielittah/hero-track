import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface VoiceGuideButtonProps {
  content: string;
  className?: string;
}

export const VoiceGuideButton: React.FC<VoiceGuideButtonProps> = ({ 
  content, 
  className = "" 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handleTextToSpeech = async () => {
    if (isPlaying && audio) {
      // Stop current audio
      audio.pause();
      setIsPlaying(false);
      setAudio(null);
      return;
    }

    try {
      setIsLoading(true);
      
      // Check if we have the API key stored in localStorage
      const apiKey = localStorage.getItem('ELEVENLABS_API_KEY');
      if (!apiKey) {
        const userApiKey = prompt('אנא הכניסו את מפתח ה-API של ElevenLabs:');
        if (!userApiKey) {
          setIsLoading(false);
          return;
        }
        localStorage.setItem('ELEVENLABS_API_KEY', userApiKey);
      }

      const apiKeyToUse = apiKey || localStorage.getItem('ELEVENLABS_API_KEY');
      
      // ElevenLabs API call
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKeyToUse || '',
        },
        body: JSON.stringify({
          text: content,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const newAudio = new Audio(audioUrl);
      
      newAudio.onloadeddata = () => {
        setIsLoading(false);
        setIsPlaying(true);
        newAudio.play();
      };

      newAudio.onended = () => {
        setIsPlaying(false);
        setAudio(null);
        URL.revokeObjectURL(audioUrl);
      };

      newAudio.onerror = () => {
        setIsLoading(false);
        setIsPlaying(false);
        console.error('Audio playback error');
      };

      setAudio(newAudio);
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        onClick={handleTextToSpeech}
        disabled={isLoading}
        className={`
          relative overflow-hidden bg-gradient-to-r from-primary to-secondary
          hover:from-primary-700 hover:to-secondary text-white
          shadow-lg hover:shadow-xl transition-all duration-300
          ${className}
        `}
        size="lg"
      >
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isPlaying ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
          <span className="font-medium">
            {isLoading 
              ? 'מכין הקראה...' 
              : isPlaying 
                ? 'עצור הקראה'
                : 'הדרכה קולית'
            }
          </span>
        </div>

        {/* Animated background pulse when playing */}
        {isPlaying && (
          <motion.div
            className="absolute inset-0 bg-white/10"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </Button>
    </motion.div>
  );
};
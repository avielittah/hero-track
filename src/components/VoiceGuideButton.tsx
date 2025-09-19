import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2, ChevronLeft, ChevronRight, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceGuidePanelProps {
  hebrewContent: string;
  englishContent: string;
}

export const VoiceGuidePanel: React.FC<VoiceGuidePanelProps> = ({ 
  hebrewContent, 
  englishContent 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingHe, setIsPlayingHe] = useState(false);
  const [isPlayingEn, setIsPlayingEn] = useState(false);
  const [isLoadingHe, setIsLoadingHe] = useState(false);
  const [isLoadingEn, setIsLoadingEn] = useState(false);
  const [audioHe, setAudioHe] = useState<HTMLAudioElement | null>(null);
  const [audioEn, setAudioEn] = useState<HTMLAudioElement | null>(null);

  const stopAllSpeech = () => {
    // Stop Web Speech API
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    // Stop any playing audio
    if (audioHe) {
      audioHe.pause();
      setAudioHe(null);
    }
    if (audioEn) {
      audioEn.pause();
      setAudioEn(null);
    }
    
    setIsPlayingHe(false);
    setIsPlayingEn(false);
    setIsLoadingHe(false);
    setIsLoadingEn(false);
  };

  const handleTextToSpeech = async (content: string, lang: 'he' | 'en') => {
    const isPlaying = lang === 'he' ? isPlayingHe : isPlayingEn;
    const setIsPlaying = lang === 'he' ? setIsPlayingHe : setIsPlayingEn;
    const setIsLoading = lang === 'he' ? setIsLoadingHe : setIsLoadingEn;

    // If currently playing this language, stop it
    if (isPlaying) {
      stopAllSpeech();
      return;
    }

    // Stop any other playing speech first
    stopAllSpeech();

    try {
      setIsLoading(true);
      
      // Use Web Speech API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(content);
        utterance.lang = lang === 'he' ? 'he-IL' : 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => {
          setIsLoading(false);
          setIsPlaying(true);
        };
        
        utterance.onend = () => {
          setIsPlaying(false);
        };
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setIsPlaying(false);
          setIsLoading(false);
        };
        
        window.speechSynthesis.speak(utterance);
        return;
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  return (
    <>
      {/* Toggle Button - עיצוב מקצועי חדש */}
      <motion.div
        className="fixed left-4 top-32 z-50"
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="
            group relative overflow-hidden
            bg-white/90 hover:bg-white text-foreground
            border border-border/30 hover:border-primary/40
            shadow-lg hover:shadow-xl
            h-12 w-12 rounded-full
            transition-all duration-300 ease-out
            hover:scale-110
          "
          size="sm"
        >
          {/* Background gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative flex flex-col items-center justify-center">
            <motion.div
              animate={{ 
                scale: isOpen ? 1.1 : 1,
                color: isOpen ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'
              }}
              transition={{ duration: 0.2 }}
            >
              <Volume2 className="h-5 w-5" />
            </motion.div>
          </div>
          
          {/* Active indicator */}
          {isOpen && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </Button>
      </motion.div>

      {/* Compact Voice Guide Panel - slide קטן */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed left-20 top-32 z-40"
            initial={{ x: -20, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -20, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="
              bg-white/95 backdrop-blur-lg border border-border/20 rounded-xl 
              shadow-xl w-72 p-4
              ring-1 ring-white/10
            ">
              <div className="space-y-3">
                {/* Panel Header - compact */}
                <div className="text-center pb-2 border-b border-border/30">
                  <h3 className="font-semibold text-sm text-foreground flex items-center justify-center gap-1">
                    <Volume2 className="h-4 w-4 text-primary" />
                    הדרכה קולית
                  </h3>
                </div>

                {/* Stop All Button - compact */}
                {(isPlayingHe || isPlayingEn || isLoadingHe || isLoadingEn) && (
                  <Button
                    onClick={stopAllSpeech}
                    variant="outline"
                    size="sm"
                    className="w-full h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/5"
                  >
                    <VolumeX className="h-3 w-3 mr-1" />
                    עצור
                  </Button>
                )}

                {/* Hebrew Voice Guide - compact */}
                <div className="space-y-2">
                  <Button
                    onClick={() => handleTextToSpeech(hebrewContent, 'he')}
                    disabled={isLoadingHe}
                    className="
                      w-full h-9 bg-blue-50 hover:bg-blue-100 text-blue-700
                      border border-blue-200 hover:border-blue-300
                      shadow-sm hover:shadow-md transition-all duration-200
                      text-xs font-medium
                    "
                    variant="outline"
                  >
                    <div className="flex items-center gap-1.5">
                      {isLoadingHe ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : isPlayingHe ? (
                        <VolumeX className="h-3 w-3" />
                      ) : (
                        <Volume2 className="h-3 w-3" />
                      )}
                      <span className="flex items-center gap-1">
                        🇮🇱
                        {isLoadingHe 
                          ? 'מכין...' 
                          : isPlayingHe 
                            ? 'עצור'
                            : 'עברית'
                        }
                      </span>
                    </div>
                  </Button>
                </div>

                {/* English Voice Guide */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    🇺🇸 English
                  </h4>
                  <Button
                    onClick={() => handleTextToSpeech(englishContent, 'en')}
                    disabled={isLoadingEn}
                    className="
                      w-full bg-gradient-to-r from-green-500 to-green-600
                      hover:from-green-600 hover:to-green-700 text-white
                      shadow-md hover:shadow-lg transition-all duration-300
                    "
                    variant="default"
                  >
                    <div className="flex items-center gap-2">
                      {isLoadingEn ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isPlayingEn ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                      <span className="text-sm">
                        {isLoadingEn 
                          ? 'Preparing audio...' 
                          : isPlayingEn 
                            ? 'Stop audio'
                            : 'Play in English'
                        }
                      </span>
                    </div>
                  </Button>
                </div>

                {/* Close Button */}
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 text-xs"
                >
                  סגור פאנל
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Light backdrop - לא חוסם את המסך */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/5 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
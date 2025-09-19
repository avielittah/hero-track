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
      {/* Toggle Button - מיקום טוב יותר */}
      <motion.div
        className="fixed left-4 top-32 z-50"
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="
            rounded-xl bg-gradient-to-br from-primary via-primary to-secondary 
            text-white shadow-xl hover:shadow-2xl border-2 border-white/20
            h-14 w-14 flex items-center justify-center
            hover:scale-105 transform transition-all duration-300
            backdrop-blur-sm bg-opacity-90
          "
          size="sm"
        >
          <div className="flex flex-col items-center gap-0.5">
            <Languages className="h-5 w-5" />
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <ChevronLeft className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </motion.div>
          </div>
        </Button>
      </motion.div>

      {/* Voice Guide Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed left-4 top-48 z-40"
            initial={{ x: -400, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -400, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="
              bg-white/98 backdrop-blur-lg border border-border/30 rounded-2xl 
              shadow-2xl w-96 p-6 
              ring-1 ring-white/10
            ">
              <div className="space-y-4">
                {/* Panel Header */}
                <div className="text-center border-b border-border pb-4 mb-4">
                  <h3 className="font-bold text-xl text-foreground mb-2 flex items-center justify-center gap-2">
                    🎧 הדרכה קולית
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    בחרו שפה להקראת ההדרכה
                  </p>
                </div>

                {/* Stop All Button */}
                {(isPlayingHe || isPlayingEn || isLoadingHe || isLoadingEn) && (
                  <div className="mb-4">
                    <Button
                      onClick={stopAllSpeech}
                      variant="destructive"
                      size="sm"
                      className="w-full"
                    >
                      <VolumeX className="h-4 w-4 mr-2" />
                      עצור הכל
                    </Button>
                  </div>
                )}

                {/* Hebrew Voice Guide */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    🇮🇱 עברית
                  </h4>
                  <Button
                    onClick={() => handleTextToSpeech(hebrewContent, 'he')}
                    disabled={isLoadingHe}
                    className="
                      w-full bg-gradient-to-r from-blue-500 to-blue-600
                      hover:from-blue-600 hover:to-blue-700 text-white
                      shadow-md hover:shadow-lg transition-all duration-300
                    "
                    variant="default"
                  >
                    <div className="flex items-center gap-2">
                      {isLoadingHe ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isPlayingHe ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                      <span className="text-sm">
                        {isLoadingHe 
                          ? 'מכין הקראה...' 
                          : isPlayingHe 
                            ? 'עצור הקראה'
                            : 'הקרא בעברית'
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

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
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
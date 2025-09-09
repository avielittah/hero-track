import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  AlertCircle, 
  CheckCircle,
  FileImage,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supportAdapter } from '@/lib/supportAdapter';
import { useLearningStore } from '@/lib/store';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ImagePreview {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  file: File;
}

export const ReportIssueModal = ({ isOpen, onClose }: ReportIssueModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { username } = useLearningStore();
  
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const MAX_IMAGES = 3;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remainingSlots = MAX_IMAGES - images.length;
    const filesToProcess = fileArray.slice(0, remainingSlots);

    for (const file of filesToProcess) {
      try {
        const processedImage = await supportAdapter.processImage(file);
        setImages(prev => [...prev, { ...processedImage, file }]);
      } catch (error) {
      toast({
        variant: "destructive",
        title: t('copy:errorImageUploadFailed'),
        description: error instanceof Error ? error.message : t('copy:errorImageProcessFailed'),
      });
      }
    }

    if (fileArray.length > remainingSlots) {
      toast({
        variant: "destructive",
        title: t('copy:validationTooManyImages'),
        description: t('copy:validationMaxImagesMessage', { remaining: remainingSlots, max: MAX_IMAGES }),
      });
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFileSelect(files);
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!description.trim()) {
      errors.push(t('copy:validationDescriptionRequired'));
    }

    if (description.trim().length < 10) {
      errors.push(t('copy:validationMinimumLength'));
    }

    if (description.trim().length > 500) {
      errors.push(t('copy:validationMaximumLength'));
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleSubmit = async () => {
    const validation = validateForm();
    
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: t('copy:validationFailed'),
        description: validation.errors.join(', '),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Process images for storage
      const processedImages = images.map(img => ({
        id: img.id,
        name: img.name,
        size: img.size,
        type: img.type,
        dataUrl: img.dataUrl,
      }));

      const issue = supportAdapter.submitIssue({
        description: description.trim(),
        images: processedImages,
        reportedBy: username || 'Anonymous User',
      });

      toast({
        title: t('copy:toastIssueReported'),
        description: t('copy:toastIssueReportedDescription', { id: issue.id.slice(0, 8) }),
        duration: 6000,
      });

      // Reset form
      setDescription('');
      setImages([]);
      onClose();

    } catch (error) {
      toast({
        variant: "destructive",
        title: t('copy:errorSubmitReportFailed'),
        description: t('copy:errorTryAgainMessage'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setDescription('');
      setImages([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            <span>{t('ui:reportAnIssue')}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              {t('ui:describeIssue')} <span className="text-destructive">{t('ui:required')}</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('copy:supportDescriptionPlaceholder')}
              className="min-h-[120px] resize-none"
              maxLength={500}
              disabled={isSubmitting}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t('ui:minimumCharacters')}</span>
              <span className={description.length >= 450 ? 'text-yellow-600' : ''}>
                {description.length}/500
              </span>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {t('ui:screenshots')} ({t('ui:optional')}, {t('ui:max')} {MAX_IMAGES})
            </Label>
            
            {/* Upload Area */}
            {images.length < MAX_IMAGES && (
              <motion.div
                className={`
                  border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
                  ${dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => !isSubmitting && document.getElementById('file-input')?.click()}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {t('ui:dropImages')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('ui:imageFormats')} • {MAX_IMAGES - images.length} {t('ui:slotsRemaining')}
                  </p>
                </div>
              </motion.div>
            )}

            <input
              id="file-input"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              multiple
              onChange={handleFileInput}
              className="hidden"
              disabled={isSubmitting}
            />

            {/* Image Previews */}
            <AnimatePresence>
              {images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {images.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden">
                        <div className="relative aspect-video bg-muted">
                          <img
                            src={image.dataUrl}
                            alt={image.name}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-6 w-6 p-0"
                            onClick={() => removeImage(image.id)}
                            disabled={isSubmitting}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="p-3">
                          <div className="flex items-center space-x-2">
                            <FileImage className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{image.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(image.size)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-xs text-muted-foreground">
              {images.length > 0 && (
                <span>📎 {images.length} {t('ui:attached')}</span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                {t('ui:cancel')}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !description.trim()}
                className="bg-primary hover:bg-primary-700"
              >
                <span className="flex items-center space-x-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t('ui:submitting')}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>{t('ui:submitReport')}</span>
                    </>
                  )}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
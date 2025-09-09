import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  question: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain'
];

const ALLOWED_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt'
];

export const FileUpload = ({ 
  question, 
  value, 
  onChange, 
  disabled = false 
}: FileUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `File size must be less than ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB`,
      });
      return false;
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      const fileName = file.name.toLowerCase();
      const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
      
      if (!hasValidExtension) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload: images, PDF, Word docs, Excel files, or text files",
        });
        return false;
      }
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      onChange(file);
      toast({
        title: "File uploaded",
        description: `${file.name} uploaded successfully`,
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    if (disabled) return;
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeFile = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="p-6">
      <Label className="text-base font-semibold text-foreground mb-4 block">
        {question}
      </Label>
      
      {!value ? (
        <motion.div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragOver ? 'border-primary bg-primary/5' : 'border-border'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50'}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && fileInputRef.current?.click()}
          whileHover={!disabled ? { scale: 1.02 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
        >
          <Upload className={`h-12 w-12 mx-auto mb-4 ${disabled ? 'text-muted-foreground' : 'text-primary'}`} />
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {disabled ? 'File upload disabled' : 'Drop your file here or click to browse'}
            </p>
            <p className="text-sm text-muted-foreground">
              Supported: Images, PDF, Word, Excel, Text files (max {(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB)
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="border rounded-lg p-4 bg-muted/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium text-foreground">{value.name}</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(value.size)}</p>
              </div>
            </div>
            {!disabled && (
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </motion.div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept={ALLOWED_EXTENSIONS.join(',')}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex items-center space-x-2 mt-4 text-xs text-muted-foreground">
        <AlertCircle className="h-3 w-3" />
        <span>Only one file can be uploaded. Uploading a new file will replace the current one.</span>
      </div>
    </Card>
  );
};
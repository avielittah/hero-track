import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { useAdminStore, validatePasscode } from '@/lib/admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AdminGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdminGate: React.FC<AdminGateProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { enableAdmin } = useAdminStore();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validatePasscode(passcode)) {
      enableAdmin();
      toast({
        title: t('ui.admin.enabled'),
        duration: 2000,
      });
      onOpenChange(false);
      setPasscode('');
      setError('');
    } else {
      setError(t('ui.admin.error'));
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setPasscode('');
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader>
          <DialogTitle className="text-center">
            {t('ui.admin.title')}
          </DialogTitle>
        </DialogHeader>
        
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-2">
            <Label htmlFor="passcode" className="sr-only">
              {t('ui.admin.title')}
            </Label>
            <Input
              id="passcode"
              type="password"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError('');
              }}
              placeholder="••••"
              className="text-center text-lg tracking-widest"
              autoFocus
              aria-describedby={error ? 'passcode-error' : undefined}
            />
            {error && (
              <p 
                id="passcode-error"
                className="text-sm text-destructive"
                aria-live="polite"
              >
                {error}
              </p>
            )}
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
            >
              {t('ui.admin.cancel')}
            </Button>
            <Button type="submit">
              {t('ui.admin.unlock')}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};
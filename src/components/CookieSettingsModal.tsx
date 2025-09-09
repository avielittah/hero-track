import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
}

interface CookieSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STORAGE_KEY = 'taleai.cookiePrefs';

export const CookieSettingsModal: React.FC<CookieSettingsModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always locked to true
    analytics: false,
    functional: false,
  });

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences({ ...parsed, essential: true }); // Essential always true
      } catch (e) {
        console.warn('Failed to parse cookie preferences');
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    toast({
      title: t('ui.footer.cookieModal.saved'),
      duration: 2000,
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('ui.footer.cookieModal.title')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t('ui.footer.cookieModal.description')}
          </p>
          
          <div className="space-y-3">
            {/* Essential - Always locked ON */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium">
                  {t('ui.footer.cookieModal.essential')}
                </label>
              </div>
              <Switch
                checked={true}
                disabled={true}
                aria-label={t('ui.footer.cookieModal.essential')}
              />
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium">
                  {t('ui.footer.cookieModal.analytics')}
                </label>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, analytics: checked })
                }
                aria-label={t('ui.footer.cookieModal.analytics')}
              />
            </div>

            {/* Functional */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium">
                  {t('ui.footer.cookieModal.functional')}
                </label>
              </div>
              <Switch
                checked={preferences.functional}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, functional: checked })
                }
                aria-label={t('ui.footer.cookieModal.functional')}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={handleCancel}>
              {t('ui.footer.cookieModal.cancel')}
            </Button>
            <Button onClick={handleSave}>
              {t('ui.footer.cookieModal.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
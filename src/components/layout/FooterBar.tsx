import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Cookie } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminStore } from '@/lib/admin';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AdminGate } from '@/features/admin/AdminGate';

const getCurrentYear = () => new Date().getFullYear();

export const FooterBar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const { adminMode, disableAdmin } = useAdminStore();
  const [showAdminGate, setShowAdminGate] = useState(false);
  const [showCookieNotice, setShowCookieNotice] = useState(false);
  
  const isRTL = i18n.language === 'he';

  const handleDisableAdmin = () => {
    disableAdmin();
    toast({
      title: t('ui.admin.disabled'),
      duration: 2000,
    });
  };

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <footer className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
        <div className="safe-area-bottom">
          <div className="px-4 py-3 flex items-center justify-between gap-4 min-h-[40px]">
            {/* Brand - Left side (Right in RTL) */}
            <div className={`flex items-center gap-2 text-xs text-slate-400 ${isRTL ? 'order-3' : 'order-1'}`}>
              <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-primary">T</span>
              </div>
              <span className="hidden sm:inline font-medium">{t('ui.footer.brand')}</span>
            </div>

            {/* Legal Content - Center */}
            <div className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs text-slate-400 ${isRTL ? 'order-2' : 'order-2'}`}>
              <span className="text-center">
                {t('ui.footer.rights', { year: getCurrentYear() })}
              </span>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => handleLinkClick('#')}
                  className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-xs"
                >
                  {t('ui.footer.terms')}
                </button>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <button
                  onClick={() => handleLinkClick('#')}
                  className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-xs"
                >
                  {t('ui.footer.privacy')}
                </button>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <button
                  onClick={() => setShowCookieNotice(true)}
                  className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center gap-1 text-xs"
                >
                  <Cookie className="h-3 w-3" />
                  <span className="hidden sm:inline">{t('ui.footer.cookies')}</span>
                </button>
              </div>
            </div>

            {/* Admin Button - Right side (Left in RTL) */}
            <div className={`flex items-center gap-2 ${isRTL ? 'order-1' : 'order-3'}`}>
              {adminMode && (
                <div className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded-full">
                  <span>{t('ui.admin.on')}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-3 w-3 p-0 hover:bg-amber-200 dark:hover:bg-amber-800"
                    onClick={handleDisableAdmin}
                  >
                    ×
                  </Button>
                </div>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => setShowAdminGate(true)}
                aria-label={t('ui.admin.open')}
              >
                <Shield className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Gate Dialog */}
      <AdminGate open={showAdminGate} onOpenChange={setShowAdminGate} />

      {/* Cookie Notice Modal */}
      <Dialog open={showCookieNotice} onOpenChange={setShowCookieNotice}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5" />
              {t('ui.footer.cookies')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('ui.footer.cookieNotice')}
            </p>
            <div className="flex justify-end">
              <Button onClick={() => setShowCookieNotice(false)}>
                {t('ui.footer.gotIt')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
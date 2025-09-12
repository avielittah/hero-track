import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Trophy, Medal, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminStore } from '@/lib/admin';
import { useLearningStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminGate } from '@/features/admin/AdminGate';
import { CookieSettingsModal } from '@/components/CookieSettingsModal';

const getCurrentYear = () => new Date().getFullYear();
const getAppVersion = () => '1.0.0'; // TODO: Get from package.json
const getLastUpdated = () => '2024-01-15'; // TODO: Get from build timestamp
const getCompanyReg = () => '12345678';
const getCompanyAddress = () => 'Tel Aviv, Israel';
const getContactEmail = () => 'support@taleai.com';

export const FooterBar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const { adminMode, disableAdmin } = useAdminStore();
  const { trophies, mluTrophies, getTotalTrophyCount, checkForMedals } = useLearningStore();
  const [showAdminGate, setShowAdminGate] = useState(false);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  
  const isRTL = i18n.language === 'he';
  const totalTrophies = getTotalTrophyCount();
  const { totalTrophies: medalCheck } = checkForMedals();

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

  const handleContactClick = () => {
    window.open(`mailto:${getContactEmail()}?subject=TaleAI Support`, '_self');
  };

  return (
    <>
      <footer className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
        <div className="safe-area-bottom">
          <div className="px-4 py-2 min-h-[40px]">
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-between gap-4 text-xs text-slate-500">
              {/* Brand & Trophies - Left (Right in RTL) */}
              <div className={`flex items-center gap-4 ${isRTL ? 'order-3' : 'order-1'}`}>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">T</span>
                  </div>
                  <span className="font-medium">{t('ui.footer.brand')}</span>
                </div>
                
                {/* Trophy Collection */}
                {totalTrophies > 0 && (
                  <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md">
                    <Trophy className="h-3 w-3 text-amber-600" />
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                      {totalTrophies}
                    </span>
                    
                    {/* Medal indicators */}
                    {totalTrophies >= 5 && (
                      <Badge variant="secondary" className="h-4 text-xs px-1">
                        <Medal className="h-2 w-2 mr-1" />
                        {totalTrophies >= 100 ? '💎' : totalTrophies >= 50 ? '🏆' : totalTrophies >= 20 ? '🥇' : totalTrophies >= 10 ? '🥈' : '🥉'}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Legal Line - Center */}
              <div className="flex-1 text-center order-2">
                <span>
                  {t('ui.footer.legalLine', {
                    year: getCurrentYear(),
                    reg: getCompanyReg(),
                    address: getCompanyAddress()
                  })}
                </span>
              </div>

              {/* Links + Admin - Right (Left in RTL) */}
              <div className={`flex items-center gap-3 ${isRTL ? 'order-1' : 'order-3'}`}>
                <button
                  onClick={() => handleLinkClick('#')}
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {t('ui.footer.terms')}
                </button>
                <button
                  onClick={() => handleLinkClick('#')}
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {t('ui.footer.privacy')}
                </button>
                <button
                  onClick={() => handleLinkClick('#')}
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {t('ui.footer.dpa')}
                </button>
                <button
                  onClick={() => setShowCookieSettings(true)}
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {t('ui.footer.cookies')}
                </button>
                <button
                  onClick={() => handleLinkClick('#')}
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {t('ui.footer.a11y')}
                </button>
                <button
                  onClick={handleContactClick}
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {t('ui.footer.contact', { email: getContactEmail() })}
                </button>
                
                {/* Admin Section */}
                <div className="flex items-center gap-1 ml-2 border-l border-slate-300 dark:border-slate-600 pl-3">
                  {adminMode && (
                    <div className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded-full mr-1">
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
                    className="w-6 h-6 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    onClick={() => setShowAdminGate(true)}
                    aria-label={t('ui.admin.open')}
                  >
                    <Shield className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden space-y-2 text-xs text-slate-500">
              {/* Brand and Admin */}
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary/10 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">T</span>
                    </div>
                    <span className="font-medium">{t('ui.footer.brand')}</span>
                  </div>
                  
                  {/* Mobile Trophy Collection */}
                  {totalTrophies > 0 && (
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                      <Trophy className="h-3 w-3 text-amber-600" />
                      <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                        {totalTrophies}
                      </span>
                      {totalTrophies >= 5 && (
                        <span className="text-xs">
                          {totalTrophies >= 100 ? '💎' : totalTrophies >= 50 ? '🏆' : totalTrophies >= 20 ? '🥇' : totalTrophies >= 10 ? '🥈' : '🥉'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
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
                    className="w-6 h-6 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    onClick={() => setShowAdminGate(true)}
                    aria-label={t('ui.admin.open')}
                  >
                    <Shield className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Legal Line */}
              <div className="text-center">
                <span>
                  {t('ui.footer.legalLine', {
                    year: getCurrentYear(),
                    reg: getCompanyReg(),
                    address: getCompanyAddress()
                  })}
                </span>
              </div>

              {/* Links */}
              <div className={`flex flex-wrap items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={() => handleLinkClick('#')}
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {t('ui.footer.terms')}
                </button>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <button
                  onClick={() => handleLinkClick('#')}
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {t('ui.footer.privacy')}
                </button>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <button
                  onClick={() => setShowCookieSettings(true)}
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {t('ui.footer.cookies')}
                </button>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <button
                  onClick={handleContactClick}
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {t('ui.footer.contact', { email: getContactEmail() })}
                </button>
              </div>

              {/* Version */}
              <div className="text-center text-slate-400">
                <span>
                  {t('ui.footer.version', {
                    v: getAppVersion(),
                    date: getLastUpdated()
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Gate Dialog */}
      <AdminGate open={showAdminGate} onOpenChange={setShowAdminGate} />

      {/* Cookie Settings Modal */}
      <CookieSettingsModal open={showCookieSettings} onOpenChange={setShowCookieSettings} />
    </>
  );
};
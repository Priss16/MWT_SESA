import LoginLayout from '../../components/LoginLayout';
import { useSettings } from '../../context/SettingsContext';

export default function LoginStaff() {
  const { t } = useSettings();
  return (
    <LoginLayout
      role="staff"
      headline={<>{t('staffHeadlineLine1')}<br />{t('staffHeadlineLine2')}</>}
      tagline={t('portalTagline')}
      subheadline={t('staffSubheadline')}
      fieldLabel={t('staffFieldLabel')}
      fieldPlaceholder="e.g. STF-1042"
    />
  );
}

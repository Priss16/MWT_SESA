import LoginLayout from '../../components/LoginLayout';
import { useSettings } from '../../context/SettingsContext';

export default function LoginAdmin() {
  const { t } = useSettings();
  return (
    <LoginLayout
      role="admin"
      headline={<>{t('adminHeadlineLine1')}<br />{t('adminHeadlineLine2')}</>}
      tagline={t('portalTagline')}
      subheadline={t('adminSubheadline')}
      fieldLabel={t('adminFieldLabel')}
      fieldPlaceholder="e.g. admin@nec.edu.in"
    />
  );
}

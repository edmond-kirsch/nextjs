import Link from 'next/link';
import nookies from 'nookies';
import useTranslation from 'next-translate/useTranslation';
import setLanguage from 'next-translate/setLanguage';
import { useAuth } from '../auth/AuthProvider';
import Layout from '../components/Layout';


export default function Home() {
  const {user} = useAuth();
  const { t } = useTranslation('home');
  const changeLocale = async (locale) => {
    nookies.destroy('locale');
    nookies.set(null, "locale", locale, {});
    await setLanguage(locale);
  }

  return (
    <Layout>
      <div>
        <div>User ID {user ? user.uid : 'No user signed in'}</div>
        <div>{t('greeting')}</div>
        <div>{t('choose')}</div>
        <Link href={'/'} locale='en'><a onClick={() => changeLocale('en')}>English</a></Link>
        <Link href={'/'} locale='ru'><a onClick={() => changeLocale('ru')}>Русский</a></Link>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const cookieLocale = nookies.get(context).locale;
  if (cookieLocale && context.locale !== cookieLocale) {
    return {
      redirect: {
        permanent: false,
        destination: `/${cookieLocale}`,
      },
      props: {},
    };
  }

  return {
    props: {},
  };
}

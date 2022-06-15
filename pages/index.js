import Link from 'next/link';
import nookies from 'nookies';
import useTranslation from 'next-translate/useTranslation';
import setLanguage from 'next-translate/setLanguage';
import Layout from '../components/Layout';
import { useAuth } from '../auth/LoaderProvider';
import verifyToken from '../auth/verifyToken';
import AuthAdapter from '../auth/AuthAdapter';

export async function getServerSideProps(context) {
  console.log(context.req.cookies)
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
  try {
    const token = context.req.cookies ? context.req.cookies.token : null;
    if (token) {
      await verifyToken(token);
    } else {
      throw new Error('no token')
    }
  } catch(error) {
    if (error !== 'no token') {
      AuthAdapter.logout();
      context.res.writeHead(301, {
        Location: '/auth'
      });
      context.res.end();
    }
    console.log('index page error');
  }
  
  return {
    props: {},
  };
}

export default function Home() {
  const { user } = useAuth();
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


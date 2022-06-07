import Link from 'next/link';
import { useAuth } from '../auth/AuthProvider';
import { useRouter } from 'next/router';
import nookies from 'nookies'
import Layout from '../components/Layout';

export default function Home() {
  const {user} = useAuth();
  const router = useRouter();
  const locale = nookies.get().locale || router.locale;
  const greeting = locale === 'en' ? 'hello' : locale === 'ru' ? 'привет' : 'unknown';
  const choose = locale === 'en' ? 'choose language' : locale === 'ru' ? 'выбрать язык' : 'unknown';
  const changeLocale = locale => nookies.set(undefined, "locale", locale, {});
  return (
    <Layout>
      <div>
        <div>User ID {user ? user.uid : 'No user signed in'}</div>
        <div>{greeting}</div>
        <div>{choose}</div>
        <Link href={router.asPath} locale='en'><a onClick={() => changeLocale('en')}>English</a></Link>
        <Link href={router.asPath} locale='ru'><a onClick={() => changeLocale('ru')}>Русский</a></Link>
      </div>
    </Layout>
  )
}

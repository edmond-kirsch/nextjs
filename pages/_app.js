import '../styles/globals.css'
import App from 'next/app'
import { LoaderProvider } from '../auth/LoaderProvider';
import AuthAdapter from '../auth/AuthAdapter';

function MyApp({ Component, pageProps }) {
  return (
      <LoaderProvider>
        <Component {...pageProps} />
      </LoaderProvider>
  )
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  try {
    const token = appContext.ctx.req.cookies.token;
    await AuthAdapter.verifyToken(token);
    if (appContext.ctx.req.url === '/auth') {
      appContext.ctx.res.writeHead(301, {
        Location: '/'
      });
      appContext.ctx.res.end();
    }
  } catch(error) {
    if (appContext.ctx.res && appContext.ctx.req.url !== '/auth') {
      AuthAdapter.logout();
      appContext.ctx.res.writeHead(301, {
        Location: '/auth'
      });
      appContext.ctx.res.end();
    }
  }

  return { ...appProps }
}

export default MyApp;

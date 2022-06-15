import '../styles/globals.css'
import { LoaderProvider } from '../auth/LoaderProvider';

function MyApp({ Component, pageProps }) {
  return (
      <LoaderProvider>
        <Component {...pageProps} />
      </LoaderProvider>
  )
}

export default MyApp;

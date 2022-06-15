import React from "react";
import nookies from "nookies";
import { useRouter } from 'next/router'
import admin from 'firebase-admin'
import AuthAdapter from "../auth/AuthAdapter";

export const getServerSideProps = async (ctx) => {
  const referrer = ctx.req.headers.referer;
  try {
    const cookies = nookies.get(ctx).token;
    console.log(cookies);
    const token = await admin.auth().verifyIdToken(cookies);
    console.log('verified')
    return {
      props: {
        message: 'OK'
      }
    };
  } catch (err) {
      console.log('not verified')
    return {
      redirect: {
        permanent: false,
        destination: "/auth",
      },
      props: {},
    };
  }
};

function AuthenticatedPage(props) {
  const router = useRouter();

  return (
    <div>
      <p>{props.message}</p>
      <button
        onClick={async () => {
            await AuthAdapter.logout();
            router.push("/");
        }}
      >
        Sign out
      </button>
    </div>
  );
}

export default AuthenticatedPage;
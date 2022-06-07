import Link from "next/link";
import { locales } from "../locales";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

export default function Test1() {
    const router = useRouter();
    const locale = router.locale;
    return (
        <Layout>
            <div>test1</div>
            <Link href="/">to home</Link>
        </Layout>
      
    )
}
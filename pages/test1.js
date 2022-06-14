import React from "react";
import Link from "next/link";
import Layout from "../components/Layout";

export default function Test1() {
    return (
        <Layout>
            <div>test1</div>
            <Link href="/">to home</Link>
        </Layout>
      
    )
}
import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "~/styles/Home.module.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });
const domain = process.env.NODE_ENV === "production" ? "/image-generater" : "";

export default function Home() {
  return (
    <>
      <Head>
        <title>画像作成 | BuildersIO</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main} style={{backgroundImage: `url(${domain}/background-image.png)`}}>
        <div className={styles.description}>
          <div>
            <a href="https://yoku.co.jp/" target="_blank" rel="noreferrer">
              {/* eslint-disable @next/next/no-img-element */}
              <img src={`${domain}/producer-image.png`} alt="produced by YOKU" />
            </a>
          </div>
        </div>
        <div className={styles.center}>
          <h1>BuildersIO Image</h1>
          <div>
            <Link href="/generater" className={styles.card}>
              <h2 className={inter.className}>
                生成する <span>-&gt;</span>
              </h2>
            </Link>
          </div>
        </div>
        <div>
          <a
            href="https://github.com/bilbase-inc/image-generater"
            className={styles.card}
            target="_blank"
            rel="noreferrer"
          >
            <h2 className={inter.className}>
              Github <span>-&gt;</span>
            </h2>
          </a>
        </div>
      </main>
    </>
  );
}

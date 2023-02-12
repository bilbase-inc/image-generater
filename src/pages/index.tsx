import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "~/styles/Home.module.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Image Generater</title>
        <meta name="description" content="ImageGenerater by kawano-020" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <div>
            <a href="https://github.com/kawano-020" target="_blank" rel="noreferrer">
              By kawano-020
            </a>
          </div>
        </div>
        <div className={styles.center}>
          <h1>Image Generater</h1>
          <div>
            <Link href="/generater" className={styles.card}>
              <h2 className={inter.className}>
                Get Started <span>-&gt;</span>
              </h2>
            </Link>
          </div>
        </div>
        <div>
          <a
            href="https://github.com/kawano-020/image_generater"
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

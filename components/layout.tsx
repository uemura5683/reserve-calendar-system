import Head from 'next/head'
import Link from 'next/link'

export const siteTitle = 'Nu-Stack | フロントエンドエンジニアポートフォリオサイト';


export default function Layout({ children, home
  }: {
    children: React.ReactNode
    home?: boolean
  }) {
    return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="フロントエンドエンジニアのうえむーのポートフォリオサイトサイトです。実績情報・スキル情報・成果物などを展開して行きます。"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/Nu%20Stack.png?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-white-logo.svg&images=https%3A%2F%2Fuemu-engineer.com%2Fimages%2Flogo.png&widths=undefined&widths=350&heights=undefined&heights=100`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header>
        <h1 className="logo">予約管理システム</h1>
        <div className="header--link">
          <Link href="/login">ログイン</Link>
          <Link href="/customer">会員登録</Link>
          <Link href="/company">会社概要</Link>
          <Link href="/contact">お問い合わせ</Link>
          <Link href=""><a href="https://uemu-engineer.com/" target="_blank" rel="noreferrer">Nu-stack</a></Link>
        </div>
      </header>
      <main>{children}</main>
      <footer>
        <div className="footer--inner">
          <div className="footer--link__privacy">
            <Link href="/privacy">プライバシーポリシー</Link>
            <Link href="/company">会社概要</Link>
          </div>
          <div className="footer--copyrights"></div>
        </div>
      </footer>
    </div>
  )
}
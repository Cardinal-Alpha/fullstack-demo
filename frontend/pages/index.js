import Head from 'next/head'

import {LoginCard} from '../component/login_card'

export default function Page() {
  return (
    <div className="full-viewport p-d-flex p-jc-center p-ai-center">
      <Head>
        <title>Login</title>
      </Head>
      <LoginCard />
    </div>
  )
}

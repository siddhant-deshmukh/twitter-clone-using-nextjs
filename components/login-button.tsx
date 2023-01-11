import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        {/* {JSON.stringify(session.user)}<br/> */}

        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
  //"signup_email_password",{name:"Meow",email:"g@gmail.com",password:"password"}
  // google : name,email,image || "credentials",{name:"Meow",email:"g@gmail.com",password:"password"
}
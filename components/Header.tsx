import React, { useEffect } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { getSession } from 'next-auth/react'
import { client } from '../client'
import Link from 'next/link'

const Header = () => {
  const { data: session } = useSession()
  console.log(session)

  // get the session again
  useEffect(() => {
    getSession().then((session) => {
      console.log(session)
    })
  }, [session])
  useEffect(() => {
    getSession().then((session) => {
      console.log(session)
    })
  })

  useEffect(() => {
    if (session?.user) {
      const doc = {
        _type: 'author',
        _id: `${session && session?.user?.email?.split('@')[0]}`,
        name: session.user.name,
        image: session.user.image,
      }
      client.createIfNotExists(doc).then(() => {
        console.log('created')
      })
    }
  }, [session])

  return (
    <div className="flex items-center justify-around border-b-2 border-gray-300 bg-gray-200 py-5">
      <Link href="/">
        <div className="flex cursor-pointer items-center">
          <h1 className="font-serif text-5xl font-semibold">Matter</h1>
          <img
            src="https://www.svgrepo.com/show/216168/flask-chemical.svg"
            alt=""
            className="h-10 w-10"
          />
        </div>
      </Link>
      <div>
        {session ? (
          <div className="flex items-center space-x-4">
            <img
              src={session?.user?.image!}
              className="h-10 w-10 rounded-full"
              alt=""
            />
            <button
              className="font-xl rounded-md border-4 border-cyan-600 px-5 py-2 font-sans transition hover:bg-gray-300 hover:text-cyan-600"
              onClick={() => {
                signOut()
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            className="font-xl rounded-md border-4 border-cyan-600 px-5 py-2 font-sans transition hover:bg-gray-300 hover:text-cyan-600"
            onClick={() => {
              signIn()
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  )
}

export default Header

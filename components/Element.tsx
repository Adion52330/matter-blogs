import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { client } from '../client'
import Link from 'next/link'

const Element = (props: any) => {
  const [authorImg, setAuthorImg] = useState('')
  const [authorName, setAuthorName] = useState('')
  const { data: session } = useSession()
  useEffect(() => {
    const query = `*[_type == "author" && _id == "${props.author}"]{
      name,
      image
    }`
    client.fetch(query).then((author: any) => {
      setAuthorImg(author[0]?.image)
      setAuthorName(author[0]?.name)
    })
  }, [])
  return (
    <Link href={`/posts/${props.slug}`}>
      <div>
        <div className="group cursor-pointer overflow-hidden rounded-lg border">
          <img
            className="h-60 w-full object-cover transition duration-200 ease-in-out group-hover:scale-105"
            src={props.image}
            alt=""
          />
          <div className="flex items-center justify-between bg-white p-5">
            <div>
              <p className="text-xl font-bold">{props.blogTitle}</p>
              <p>
                {props.description} by{' '}
                <span className="font-semibold">{authorName}</span>
              </p>
            </div>
            <img src={authorImg} className="h-12 w-12 rounded-full" alt="" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Element

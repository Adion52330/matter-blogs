import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Header from '../../components/Header'
import { client, urlFor } from '../../client'
import { Post } from '../../typings'
import { GetStaticProps } from 'next'
import PortableText from 'react-portable-text'
import Head from 'next/head'

interface Props {
  post: Post
}

const Slug = ({ post }: Props) => {
  const [authorImg, setAuthorImg] = useState('')
  const router = useRouter()
  const { slug } = router.query
  useEffect(() => {
    // @ts-ignore
    const query = `*[_type == "author" && _id == "${post.author._ref}"]{
      name,
      image
    }`
    client.fetch(query).then((author: any) => {
      setAuthorImg(author[0]?.image)
    })
  }, [])
  return (
    <main className="">
      <Head>
        <title>{post.title}</title>
      </Head>

      <Header />

      <img
        src={urlFor(post.mainImage).url()!}
        className="h-40 w-full object-cover"
        alt=""
      />

      <article className="mx-auto max-w-3xl p-5">
        <h1 className="mt-10 mb-3 text-3xl font-bold">{post.title}</h1>
        <p className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </p>

        <div className="flex items-center space-x-2">
          <img src={authorImg} className="h-10 rounded-full" alt="" />
          <p className="text-sm font-extralight">
            Blog post by{' '}
            <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-10 text-xl">
          <PortableText
            dataset="production"
            projectId="sdu7xsnt"
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="my-5 text-xl font-bold" {...props} />
              ),
              li: (props: any) => (
                <li className="ml-4 list-disc">{props.children}</li>
              ),
              link: (props: any) => (
                <a href={props.href} className="text-blue-500 hover:underline">
                  {props.children}
                </a>
              ),
            }}
          />
        </div>
      </article>
    </main>
  )
}

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
      slug {
          current
      }
    }`
  const posts = await client.fetch(query)

  const paths = posts.map((post: Post) => {
    return {
      params: {
        slug: post.slug.current,
      },
    }
  })

  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author -> {
         name, image
        },
        description,
        mainImage,
        slug,
        body
      }`

  const post = await client.fetch(query, { slug: params?.slug })

  if (!post) {
    return {
      notFound: true,
    }
  } else {
    return {
      props: {
        post,
      },
      revalidate: 60,
    }
  }
}

export default Slug

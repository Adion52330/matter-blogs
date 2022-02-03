import Head from 'next/head'
import Element from '../components/Element'
import Header from '../components/Header'
import Main from '../components/Main'
import { client, urlFor } from '../client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [blogs, setBlogs] = useState([])
  useEffect(() => {
    const query = `
    *[_type=="post"]{
      _id,
      title,
      body,
      description,
      mainImage,
      author,
      slug
    }
    `
    client.fetch(query).then((blogs) => {
      setBlogs(blogs)
    })
  }, [])
  console.log(blogs)

  return (
    <div className="">
      <Head>
        <title>Matter Blogs - Presented by Adion</title>
        <link
          rel="icon"
          href="https://www.svgrepo.com/show/216168/flask-chemical.svg"
        />
      </Head>

      {/*//*Structure */}
      <Header />
      <div>
        <Main />
        <div className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Element
              key={blog._id}
              slug={blog.slug.current}
              blogTitle={blog?.title}
              description={blog?.description}
              body={blog?.body}
              image={urlFor(blog?.mainImage).url()!}
              author={blog?.author?._ref}
            />
          ))}
        </div>
      </div>
      {/* Footer */}
    </div>
  )
}

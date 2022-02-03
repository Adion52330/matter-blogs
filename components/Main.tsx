import React, { useEffect, useState } from 'react'
import { useSession, signIn, getSession } from 'next-auth/react'
import { client } from '../client'

const Main = () => {
  const { data: session } = useSession()
  const [image, setImage] = useState(null)
  const [wrongImageType, setWrongImageType] = useState(false)
  const [addBlog, setAddBlog] = useState(false)
  const [blogTitle, setBlogTitle] = useState('')
  const [blogDescription, setBlogDescription] = useState('')
  const [blog, setBlog] = useState('')

  const uploadImage = (e: any) => {
    const selectedFile = e.target.files[0]
    // uploading asset to sanity
    if (
      selectedFile.type === 'image/png' ||
      selectedFile.type === 'image/svg' ||
      selectedFile.type === 'image/jpeg' ||
      selectedFile.type === 'image/gif' ||
      selectedFile.type === 'image/tiff'
    ) {
      setWrongImageType(false)
      client.assets
        .upload('image', selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((document: any) => {
          setImage(document)
        })
        .catch((error: any) => {
          console.log('Upload failed:', error.message)
        })
    } else {
      setWrongImageType(true)
    }
  }

  const slugify = (str: any) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const saveBlog = (e: any) => {
    e.preventDefault()
    // @ts-ignore
    if (blogTitle && blogDescription && image?._id && blog) {
      const doc = {
        // @ts-ignore
        _type: 'post',
        title: blogTitle,
        // create the slug for the blog
        slug: blogTitle,
        description: blogDescription,
        mainImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            // @ts-ignore
            _ref: image?._id,
          },
        },
        author: {
          _type: 'reference',
          // @ts-ignore
          _ref: session?.user?.email.split('@')[0],
        },
        body: [
          {
            _key: blogTitle.split(' ').join(''),
            _type: 'block',
            children: [
              {
                _type: 'span',
                // give it a random key
                _key: Math.random().toString(36).substring(7),
                text: blog,
              },
            ],
            markDefs: [],
          },
        ],
        // @ts-ignore
        slug: {
          _type: 'slug',
          current: slugify(blogTitle),
        },
      }
      client.create(doc).then(() => {
        setAddBlog(false)
        setBlogTitle('')
        setBlog('')
        setBlogDescription('')
        setImage(null)
      })
      setTimeout(() => {
        window.location.reload()
      }, 14000)
    } else {
      alert('Please fill all the fields')
    }
  }

  // get the session again
  useEffect(() => {
    getSession().then((session: any) => {
      console.log(session)
    })
  }, [session])

  if (session) {
    return (
      <div className="m-2">
        <button
          className="flex justify-end bg-gray-300 py-2 px-4  font-semibold transition hover:bg-gray-400"
          onClick={() => setAddBlog(!addBlog)}
        >
          Add Your Blog
        </button>
        {addBlog && (
          <form className="animate m-3 max-w-full flex flex-col items-center space-y-5 border-4 px-2 py-5">
            <input
              type="text"
              placeholder="Title"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              className="bg-gray-300 w-full p-2 text-2xl font-bold outline-none"
            />
            <input
              type="text"
              placeholder="Description"
              value={blogDescription}
              onChange={(e) => setBlogDescription(e.target.value)}
              className="bg-gray-300 w-full p-2 text-lg  outline-none"
            />
            {!image ? (
              <input
                type="file"
                placeholder="Image"
                className="bg-gray-300 p-2 text-lg outline-none"
                onChange={uploadImage}
              />
            ) : (
              <div className="relative h-full">
                <img
                  // @ts-ignore
                  src={image?.url}
                  alt="uploaded-pic"
                  className="h-full w-full"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 m-2 rounded-full bg-gray-300 px-2 py-1 text-sm font-bold"
                  onClick={() => setImage(null)}
                >
                  Delete
                </button>
              </div>
            )}
            <textarea
              placeholder="Blog"
              value={blog}
              onChange={(e) => setBlog(e.target.value)}
              className="bg-gray-300 w-full p-2 outline-none"
              cols={30}
            ></textarea>
            <input
              type="submit"
              value="Add Blog"
              onClick={saveBlog}
              className="cursor-pointer rounded-md bg-yellow-500 py-2 px-10 text-white transition hover:bg-yellow-700"
            />
          </form>
        )}
      </div>
    )
  }

  return (
    <div className="m-2 flex items-center justify-between flex-wrap bg-yellow-500 p-7 font-sans">
      <div>
        <h1 className="text-6xl font-bold">Welcome User</h1>
        <p className="text-lg">Sign In to get started</p>
      </div>
      <div>
        <button
          className="rounded-md border-4 bg-blue-500 px-5 py-2 font-sans text-2xl font-bold transition hover:bg-gray-300 hover:text-cyan-600"
          onClick={() => {
            signIn()
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  )
}

export default Main

import { Link, useRouteError, useActionData, json } from "@remix-run/react"
import { redirect } from "@remix-run/node"
import { db } from "../utils/db.server"

function validateTitle(title) {
  if(typeof title !== 'string' || title.length < 3) {
    return 'Title should be at least 3 characters long'
  }
}
function validateBody(body) {
  if(typeof body !== 'string' || body.length < 10) {
    return 'Body should be at least 10 characters long'
  }
}

export const action = async ({request}) => {
  const form = await request.formData()
  const title = form.get('title')
  const body = form.get('body')

  const fields = {title, body}

  const fieldErrors = {
    title: validateTitle(title),
    body: validateBody(body)
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors)
    return json({fieldErrors, fields}, { stats: 400 })
  }

  const post = await db.post.create({data: fields})

  return redirect(`/posts/${post.id}`)
}

function NewPost() {
  const actionData = useActionData()

  return (
    <>
      <div className="page-header">
        <h1>New Post</h1>
        <Link to='/posts' className="btn btn-reverse">
          Back
        </Link>
      </div>

      <div className="page-content">
        <form method="POST">
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" />
          </div>

          <div className="form-control">
            <label htmlFor="body">Post Body</label>
            <textarea name="body" id="body" />
          </div>

          <button type="submit" className="btn btn-block">
            Add Post
          </button>
        </form>
      </div>
    </>
  )
}

// This works for specific pages. Look at the root version for root pages
/* export function ErrorBoundary() {
  const error = useRouteError()
  console.log(error)
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
    </div>
  )
} */

export default NewPost
import { Outlet, LiveReload, Link, Links, Meta, useRouteError, isRouteErrorResponse, useLoaderData} from '@remix-run/react'
import globalStylesUrl from './styles/global.css'
import { getUser } from './utils/session.server'
import { json } from '@remix-run/node'

export const links = () => [{rel: 'stylesheet', href:
globalStylesUrl }]

export const meta = () => {
  const description = 'A cool blog built with Remix'
  const keywords = 'remix, react, js'

  return [
      {
        description,
        keywords
      }
  ]

}

export const loader = async ({request} : any) => {
  const user = await getUser(request)
  const data = {
    user
  }
  return json(data)
}

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}

function Document({ children, title } : any) {
  return (
    <html lang='en'>
        <head>
          <meta charSet='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <Meta />
          <Links />
          <title>My Remix Blog</title>
        </head>
        <body>
          {children}
          {process.env.NODE_ENV === 'development' ?
          <LiveReload /> : null}
        </body>
      </html>
  )
}

function Layout({children} : any) {
  const {user} = useLoaderData<typeof loader>()

  return (
    <>
      <nav className='navbar'>
        <Link to='/' className='logo'>
          Remix
        </Link>

        <ul className='nav'>
          <li>
            <Link to='/posts'>Posts</Link>
          </li>
          {user ? (
            <li>
              <form action='/logout' method="POST">
                <button className="btn" type="submit">
                  Logout {user.username}
                </button>
              </form>
            </li>
          ) : (
            <li>
              <Link to='/login'>Login</Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="container">
        {children}
      </div>
    </>
  )
}

// This is how you format ErrorBoundary for root pages
export function ErrorBoundary() {
  const error = useRouteError()
  console.log(error)
  return (
    <Document>
      <Layout>
        <h1>Error</h1>
        <p>
          {isRouteErrorResponse(error)
          ? `${error.status} ${error.statusText}`
          : error instanceof Error
          ? error.message
          : "Unknown Error"
          }
        </p>
      </Layout>
    </Document>
  )
}
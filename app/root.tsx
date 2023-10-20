import { Outlet, LiveReload, Link, Links, Meta, useRouteError, isRouteErrorResponse} from '@remix-run/react'
import globalStylesUrl from './styles/global.css'

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
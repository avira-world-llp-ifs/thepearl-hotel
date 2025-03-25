import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="w-full py-4 px-6 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-amber-500">The Pearl</span>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-6xl font-bold text-amber-500 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
            >
              Return Home
            </Link>
            <Link
              href="/rooms"
              className="px-6 py-3 border border-amber-500 text-amber-500 rounded-md hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
            >
              Browse Rooms
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 px-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} The Pearl Hotel. All rights reserved.
        </div>
      </footer>
    </div>
  )
}


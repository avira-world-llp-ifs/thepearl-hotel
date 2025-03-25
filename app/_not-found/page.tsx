export default function NotFoundPage() {
  return (
    <div className="max-w-md w-full text-center">
      <h1 className="text-6xl font-bold text-amber-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/" className="px-6 py-3 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors">
          Return Home
        </a>
        <a
          href="/rooms"
          className="px-6 py-3 border border-amber-500 text-amber-500 rounded-md hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
        >
          Browse Rooms
        </a>
      </div>
    </div>
  )
}


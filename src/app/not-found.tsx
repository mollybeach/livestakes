import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-purple-400">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">Page Not Found</h2>
      <p className="text-lg text-gray-300 mb-8">
        Oops! The page you&#39;re looking for doesn&#39;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
} 
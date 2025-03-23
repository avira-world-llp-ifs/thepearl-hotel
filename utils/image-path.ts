/**
 * Utility function to get the correct image path based on environment variables
 */
export function getImagePath(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_ENV_IMAGE || ""
  // Remove any double slashes except for http(s)://
  return `${baseUrl}${path}`.replace(/([^:])\/\//g, "$1/")
}


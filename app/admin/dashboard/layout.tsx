import type React from "react"

interface Props {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return <div className="w-full max-w-screen-xl mx-auto px-4">{children}</div>
}

export default Layout


import {
  HomeIcon,
  DocumentDuplicateIcon,
  UsersIcon,
  FolderIcon,
  CalendarIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  CogIcon,
} from "@heroicons/react/24/outline"
import { NavLink } from "@remix-run/react"

export default function Sidebar() {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-gray-800">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
        <nav className="flex-1 px-2 space-y-1" aria-label="Sidebar">
          <NavLink
            to="/dashboard"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <HomeIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" aria-hidden="true" />
            Dashboard
          </NavLink>

          <NavLink
            to="/dashboard/documents"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <DocumentDuplicateIcon
              className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300"
              aria-hidden="true"
            />
            Documents
          </NavLink>

          <NavLink
            to="/dashboard/users"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <UsersIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" aria-hidden="true" />
            Users
          </NavLink>

          <NavLink
            to="/dashboard/projects"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <FolderIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" aria-hidden="true" />
            Projects
          </NavLink>

          <NavLink
            to="/dashboard/calendar"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <CalendarIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" aria-hidden="true" />
            Calendar
          </NavLink>

          <NavLink
            to="/dashboard/reports"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <ChartBarIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" aria-hidden="true" />
            Reports
          </NavLink>

          <NavLink
            to="/dashboard/ecommerce"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <ShoppingBagIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" aria-hidden="true" />
            E-commerce
          </NavLink>

          <NavLink
            to="/dashboard/settings"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <CogIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" aria-hidden="true" />
            Settings
          </NavLink>
        </nav>
      </div>
    </div>
  )
}


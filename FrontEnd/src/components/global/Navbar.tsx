
import * as React from "react"
import { Transition } from "@headlessui/react"
import { Bell, Settings, User, LogOut } from "lucide-react"


export interface Language {
    code: string
    name: string
    flag: string
  }
  
  export interface Notification {
    id: string
    avatar: string
    user: string
    action: string
    target: string
    timestamp: string
  }
  
  export interface User {
    name: string
    role: string
    avatar: string
  }
  

const languages: Language[] = [
  { code: "en", name: "English", flag: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWYW5_EOLH0Qo4eAH8icpJc_yYWszkhNs-Lg&s" },
  { code: "fr", name: "French", flag: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJTdYV8slYr9JgTw4LsMPP9DdaEj36iVVfEA&s" },
  { code: "es", name: "Spanish", flag: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMMr0gPdt8WQFr18uN4gdiNz_lJZCZfexCbg&s" },
  { code: "de", name: "German", flag: "https://www.countryflags.com/wp-content/uploads/germany-flag-png-xl.png" },
]

const notifications: Notification[] = [
  {
    id: "1",
    avatar: "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png",
    user: "John Doe",
    action: "added new task",
    target: "Patient appointment booking",
    timestamp: "4 mins ago",
  },
  {
    id: "2",
    avatar: "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png",
    user: "Tarah Shropshire",
    action: "changed the task name",
    target: "Appointment booking with payment gateway",
    timestamp: "6 mins ago",
  },
  {
    id: "3",
    avatar: "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png",
    user: "Misty Tison",
    action: "added",
    target: "Domenic Houston and Claire Mapes to project Doctor available module",
    timestamp: "8 mins ago",
  },
  {
    id: "4",
    avatar: "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png",
    user: "Misty Tison",
    action: "added",
    target: "Domenic Houston and Claire Mapes to project Doctor available module",
    timestamp: "8 mins ago",
  },
  {
    id: "5",
    avatar: "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png",
    user: "Misty Tison",
    action: "added",
    target: "Domenic Houston and Claire Mapes to project Doctor available module",
    timestamp: "8 mins ago",
  },
]

const currentUser: User = {
  name: "John Doe",
  role: "Admin",
  avatar: "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png",
}


export default function Navbar() {
  const [isLangOpen, setIsLangOpen] = React.useState(false)
  const [isNotifOpen, setIsNotifOpen] = React.useState(false)
  const [isProfileOpen, setIsProfileOpen] = React.useState(false)
  const [currentLang, setCurrentLang] = React.useState(languages[0])

  // Refs for click outside detection
  const langRef = React.useRef<HTMLDivElement>(null)
  const notifRef = React.useRef<HTMLDivElement>(null)
  const profileRef = React.useRef<HTMLDivElement>(null)

  // Handle click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Simplified handlers that only toggle their own dropdown
  const handleOpenLang = () => setIsLangOpen(!isLangOpen)
  const handleOpenNoti = () => setIsNotifOpen(!isNotifOpen)
  const handleOpenProfile = () => setIsProfileOpen(!isProfileOpen)

  return (
    <nav className="fixed h-[60px] top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-[60px] gap-4">
          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={handleOpenLang}
              className="flex items-center cursor-pointer gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <img className="text-xl w-8 h-5" src={currentLang.flag || "/placeholder.svg"} alt={currentLang.name} />
            </button>

            <Transition
              show={isLangOpen}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setCurrentLang(lang)
                      setIsLangOpen(false)
                    }}
                    className="flex cursor-pointer items-center gap-3 w-full p-3 hover:bg-gray-50 text-left transition-colors"
                  >
                    <img className="text-xl w-5 h-3" src={lang.flag || "/placeholder.svg"} alt={lang.name} />
                    <span className="text-sm">{lang.name}</span>
                  </button>
                ))}
              </div>
            </Transition>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={handleOpenNoti}
              className="relative p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="sr-only">Notifications</span>
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                4
              </span>
            </button>

            <Transition
              show={isNotifOpen}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="font-semibold">Notifications</h2>
                  <button className="text-red-500 text-xs hover:underline">CLEAR ALL</button>
                </div>
                <div className="overflow-y-auto max-h-96">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="flex cursor-pointer items-start gap-3 p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors"
                    >
                      <img src={notif.avatar || "/placeholder.svg"} alt="" className="w-10 h-10 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{notif.user}</span> {notif.action}{" "}
                          <span className="font-medium">{notif.target}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notif.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-1 text-center border-t border-gray-200">
                  <button className="text-xs hover:underline">View all Notifications</button>
                </div>
              </div>
            </Transition>
          </div>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={handleOpenProfile}
              className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <img src={currentUser.avatar || "/placeholder.svg"} alt="" className="w-8 h-8 rounded-full" />
              <div className="hidden sm:block text-left">
                <div className="font-medium">{currentUser.name}</div>
                <div className="text-sm text-gray-500">{currentUser.role}</div>
              </div>
            </button>

            <Transition
              show={isProfileOpen}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <div className="font-medium">{currentUser.name}</div>
                  <div className="text-sm text-gray-500">{currentUser.role}</div>
                </div>
                <div className="py-2">
                  <button className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 text-left transition-colors">
                    <User className="w-5 h-5 text-gray-500" />
                    My Profile
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 text-left transition-colors">
                    <Settings className="w-5 h-5 text-gray-500" />
                    Settings
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 text-left text-red-600 transition-colors">
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </nav>
  )
}


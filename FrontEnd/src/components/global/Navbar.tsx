import * as React from "react";
import { Transition } from "@headlessui/react";
import { Bell, Settings, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Language {
    code: string;
    name: string;
    flag: string;
}

export interface Notification {
    id: string;
    avatar: string;
    user: string;
    action: string;
    target: string;
    timestamp: string;
}

export interface User {
    name: string;
    role: string;
    avatar: string;
}

const languages: Language[] = [
    { code: "en", name: "English", flag: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWYW5_EOLH0Qo4eAH8icpJc_yYWszkhNs-Lg&s" },
    { code: "fr", name: "French", flag: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJTdYV8slYr9JgTw4LsMPP9DdaEj36iVVfEA&s" },
    { code: "es", name: "Spanish", flag: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMMr0gPdt8WQFr18uN4gdiNz_lJZCZfexCbg&s" },
    { code: "de", name: "German", flag: "https://www.countryflags.com/wp-content/uploads/germany-flag-png-xl.png" },
];

const currentUser: User = {
    name: "John Doe",
    role: "Admin",
    avatar: "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png",
};

export default function Navbar() {
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const profileRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        console.log("Logging out...");
        navigate("/signin");
    };

    return (
        <nav className="fixed h-[60px] top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-end items-center h-[60px] gap-4">
                    {/* User Profile */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
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
                                        Hồ sơ
                                    </button>
                                    <button className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 text-left transition-colors">
                                        <Settings className="w-5 h-5 text-gray-500" />
                                        Cài đặt
                                    </button>
                                    <button
                                        className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 text-left text-red-600 transition-colors"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>
        </nav>
    );
}

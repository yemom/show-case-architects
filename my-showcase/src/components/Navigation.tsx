import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/useAppContext";

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { token } = useAppContext();

    const navigation = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Services", href: "/services" },
        { name: "Portfolio", href: "/portfolio" },
        { name: "Contact", href: "/contact" },
    ];

    const isActive = (href: string) => {
        if (href === "/") return location.pathname === "/";
        return location.pathname.startsWith(href);
    };

    const isHome = location.pathname === "/";

    return (
        <nav
            className={`fixed top-0 w-full z-50 border-b backdrop-blur-md transition-colors ${
                isHome
                    ? "bg-[#dfe7ef]/82 border-[#a9bacd]/40 text-[#1a222d]"
                    : "bg-[#10171d]/88 border-white/10 text-[#f4f7fa]"
            }`}
        >
            <div className="max-w-[1250px] mx-auto px-4 sm:px-8">
                <div className="h-16 flex items-center justify-between gap-4">
                    <Link to="/" className="flex items-center">
                        <img src={assets.logo} alt="Monolith" className="h-7 w-auto select-none" draggable={false} />
                    </Link>

                    <div className="hidden md:flex items-center gap-9">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                aria-current={isActive(item.href) ? "page" : undefined}
                                className={`text-[11px] tracking-[0.14em] uppercase transition-all duration-300 ${
                                    isActive(item.href)
                                        ? "opacity-100 font-semibold border-b border-current pb-1"
                                        : "opacity-70 hover:opacity-100"
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to={token ? "/admin" : "/admin/login"}
                            className="hidden sm:inline-block text-[11px] tracking-[0.12em] uppercase opacity-80 hover:opacity-100"
                        >
                            {token ? "Dashboard" : "Login"}
                        </Link>

                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex h-9 w-9 items-center justify-center border border-current/25 hover:border-current/60 transition-colors"
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                        >
                            {isOpen ? <X size={16} /> : <Menu size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className={`md:hidden border-t ${isHome ? "border-[#a9bacd]/40 bg-[#eaf0f5]" : "border-white/10 bg-[#121a22]"}`}>
                    <div className="max-w-[1250px] mx-auto px-4 py-4 flex flex-col gap-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`text-sm uppercase tracking-[0.12em] ${isActive(item.href) ? "font-semibold" : "opacity-80"}`}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            to={token ? "/admin" : "/admin/login"}
                            onClick={() => setIsOpen(false)}
                            className="text-sm uppercase tracking-[0.12em] opacity-80"
                        >
                            {token ? "Dashboard" : "Login"}
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;

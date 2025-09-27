import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
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

    return (
        <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-primary to-secondary text-white backdrop-blur-sm border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3">
                        <img
                            src={assets.logo}
                            alt="Logo"
                            className="h-8 w-auto select-none"
                            draggable={false}
                        />

                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                aria-current={isActive(item.href) ? "page" : undefined}
                                className={`text-sm font-light transition-colors hover:text-accent ${isActive(item.href) ? "text-accent" : "text-white/80"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link to={token ? "/admin" : "/admin/login"} className="ml-2">
                            <Button variant="default" size="sm" className="gap-2 bg-accent text-white hover:bg-accent/90">
                                {token ? 'Dashboard' : 'Login'}
                                <img src={assets.arrow} alt="arrow" className="w-3 h-3" />
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-foreground"
                            aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-secondary border-t border-white/10">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`block px-3 py-2 text-base font-light transition-colors ${isActive(item.href)
                                        ? "text-accent bg-accent/10"
                                        : "text-white/80 hover:text-accent hover:bg-accent/5"
                                        }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="px-3 py-2">
                                <Link to={token ? "/admin" : "/admin/login"} onClick={() => setIsOpen(false)}>
                                    <Button variant="default" size="sm" className="w-full gap-2 bg-accent text-white hover:bg-accent/90">
                                        {token ? 'Dashboard' : 'Login'}
                                        <img src={assets.arrow} alt="arrow" className="w-3 h-3" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;

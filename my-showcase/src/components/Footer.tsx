import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { assets } from "@/assets/assets";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-primary to-secondary text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center overflow-hidden">
                                <img src={assets.logo} alt="Studio 21 Logo" className="w-6 h-6 object-contain" />
                            </div>
                            <span className="text-xl font-light tracking-wide text-white"> Studio 21</span>
                        </div>
                        <p className="text-[var(--color-background-2)] architectural-body">
                            Creating innovative architectural solutions that blend sustainability,
                            functionality, and aesthetic excellence.
                        </p>
                        <div className="flex space-x-4">
                            <Button variant="ghost" size="sm" className="text-[var(--color-background-2)] hover:text-accent hover:bg-white/10">
                                <Facebook className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-[var(--color-background-2)] hover:text-accent hover:bg-white/10">
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-[var(--color-background-2)] hover:text-accent hover:bg-white/10">
                                <Instagram className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-[var(--color-background-2)] hover:text-accent hover:bg-white/10">
                                <Linkedin className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-light text-white">Quick Links</h3>
                        <nav className="space-y-3">
                            {[
                                { name: "About Us", href: "/about" },
                                { name: "Services", href: "/services" },
                                { name: "Portfolio", href: "/portfolio" },
                                { name: "Contact", href: "/contact" },
                            ].map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="block text-[var(--color-background-2)] hover:text-accent transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Services */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-light text-white">Services</h3>
                        <nav className="space-y-3">
                            {[
                                "Architectural Design",
                                "Interior Design",
                                "3D Modeling",
                                "Renovations",
                                "Consulting",
                            ].map((service) => (
                                <div
                                    key={service}
                                    className="text-white/80"
                                >
                                    {service}
                                </div>
                            ))}
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-light text-white">Contact</h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-accent mt-1" />
                                <div className="text-[var(--color-background-2)]">
                                    <div>123 Architecture Ave</div>
                                    <div>Design District, NY 10001</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-accent" />
                                <span className="text-[var(--color-background-2)]">+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-accent" />
                                <span className="text-[var(--color-background-2)]">hello@architecturestudio.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/20 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-[var(--color-background-2)] text-sm">
                            © 2024–2025 Studio 21. All rights reserved.
                        </div>
                        <div className="flex space-x-6 text-sm">
                            <Link to="/privacy" className="text-[var(--color-background-2)] hover:text-accent transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="text-[var(--color-background-2)] hover:text-accent transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

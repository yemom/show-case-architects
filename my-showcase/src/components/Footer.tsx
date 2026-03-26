import { Link } from "react-router-dom";
import { assets } from "@/assets/assets";

const Footer = () => {
    return (
        <footer className="bg-[#10161c] text-[#d9e1ea] border-t border-white/10">
            <div className="max-w-[1250px] mx-auto px-4 sm:px-8 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] tracking-[0.12em] uppercase">
                    <Link to="/" className="opacity-90 hover:opacity-100 transition-opacity">
                        <img src={assets.logo} alt="Monolith" className="h-6 w-auto" draggable={false} />
                    </Link>

                    <div className="flex items-center gap-6 text-[#aab8c9]">
                        <a href="https://www.instagram.com/architectsstudio21" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                            Instagram
                        </a>
                        <a href="https://www.behance.net" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                            Behance
                        </a>
                        <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                            LinkedIn
                        </a>
                        <Link to="/contact" className="hover:text-white transition-colors">
                            Contact
                        </Link>
                    </div>

                    <p className="text-[#97a6b8] text-center md:text-right">© 2026 Monolith Architecture. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

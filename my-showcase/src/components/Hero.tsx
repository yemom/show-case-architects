import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
    return (
        <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#dfe6ee]">
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=2000&auto=format&fit=crop"
                    alt="Monolith architecture"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(219,232,245,0.72)_12%,rgba(21,51,85,0.36)_52%,rgba(8,17,28,0.28)_100%)]" />
            </div>

            <div className="relative z-10 w-full max-w-[1250px] px-4 sm:px-8 pt-24 pb-14">
                <div className="max-w-4xl mx-auto text-center reveal-up">
                    <h1 className="architectural-heading text-[#f7fafc] text-[64px] leading-[0.92] sm:text-[96px] md:text-[126px] font-extrabold">
                        Monolith
                        <span className="block">Architecture</span>
                    </h1>

                    <p className="mt-5 text-[11px] sm:text-[14px] uppercase tracking-[0.36em] text-[#e8f0f8]">
                        Redefining spaces with elegance and minimalism
                    </p>

                    <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/portfolio"
                            className="inline-flex items-center justify-center h-12 px-9 border border-white/45 bg-[#425768]/55 text-white text-[11px] uppercase tracking-[0.12em] hover:bg-[#425768]/80 transition-colors"
                        >
                            View Projects
                        </Link>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center h-12 px-9 border border-white/50 bg-[#18324c]/55 text-white text-[11px] uppercase tracking-[0.12em] hover:bg-[#18324c]/82 transition-colors"
                        >
                            Contact Us
                            <ArrowRight size={15} className="ml-2" />
                        </Link>
                    </div>
                </div>

                <p className="hidden md:block absolute left-3 bottom-16 text-[9px] tracking-[0.45em] uppercase text-[#d9e8f7]/85 rotate-180 [writing-mode:vertical-rl]">
                    Established MMXXII
                </p>
            </div>
        </section>
    );
};

export default Hero;

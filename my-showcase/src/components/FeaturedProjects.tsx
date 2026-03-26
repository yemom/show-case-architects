import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "@/context/useAppContext";
import { getMediaUrl } from "@/lib/util";

type Blog = {
    _id: string;
    title: string;
    subTitle: string;
    category: string;
    description: string;
    image?: string | null;
    video?: string | null;
    createdAt: string;
};

const FeaturedProjects: React.FC = () => {
    const { axios } = useAppContext();
    const [projects, setProjects] = React.useState<Blog[]>([]);
    const [loading, setLoading] = React.useState(true);

    const fallbackImages = [
        "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1529429612779-c8e40ef2f36d?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?q=80&w=900&auto=format&fit=crop",
    ];

    React.useEffect(() => {
        const run = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('/api/blog/all');
                const list: Blog[] = (data?.blogs || []).slice(0, 5);
                setProjects(list);
                    } catch {
                        // no-op for homepage
            } finally {
                setLoading(false);
            }
        };
        run();
    }, [axios]);

    const getProjectMedia = (project: Blog | undefined, index: number) => {
        if (project?.image) {
            return getMediaUrl(project.image, axios.defaults.baseURL) || fallbackImages[index] || fallbackImages[0];
        }
        return fallbackImages[index] || fallbackImages[0];
    };

    return (
        <>
            <section className="py-20 sm:py-24 bg-[#eceff2]">
                <div className="max-w-[1250px] mx-auto px-4 sm:px-8">
                    <div className="flex flex-col lg:flex-row justify-between gap-10 mb-12">
                        <div>
                            <p className="text-[10px] tracking-[0.22em] uppercase text-[#4a5f79] mb-4">Curated Works</p>
                            <h2 className="architectural-heading text-[44px] sm:text-[64px] leading-[0.9] text-[#111821]">
                                The Portfolio
                            </h2>
                        </div>
                        <p className="max-w-md text-sm sm:text-base text-[#5c6775] leading-7 lg:pt-8">
                            A selection of projects that embody our philosophy of structural honesty, material precision, and geometric restraint.
                        </p>
                    </div>

                    {loading && <p className="text-sm text-[#647285]">Loading featured projects...</p>}

                    {!loading && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                            <Link to={projects[0]?._id ? `/blog/${projects[0]._id}` : "/portfolio"} className="md:col-span-2 block group overflow-hidden bg-[#dfe4e9] min-h-[220px] sm:min-h-[320px] md:min-h-[470px]">
                                <img src={getProjectMedia(projects[0], 0)} alt={projects[0]?.title || "Project"} className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                            </Link>

                            <Link to={projects[1]?._id ? `/blog/${projects[1]._id}` : "/portfolio"} className="block group overflow-hidden bg-[#dfe4e9] min-h-[220px] sm:min-h-[320px] md:min-h-[470px]">
                                <img src={getProjectMedia(projects[1], 1)} alt={projects[1]?.title || "Project"} className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                            </Link>

                            <Link to={projects[2]?._id ? `/blog/${projects[2]._id}` : "/portfolio"} className="block group overflow-hidden bg-[#dfe4e9] min-h-[220px] sm:min-h-[270px]">
                                <img src={getProjectMedia(projects[2], 2)} alt={projects[2]?.title || "Project"} className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                            </Link>

                            <Link to={projects[3]?._id ? `/blog/${projects[3]._id}` : "/portfolio"} className="block group overflow-hidden bg-[#dfe4e9] min-h-[220px] sm:min-h-[270px]">
                                <img src={getProjectMedia(projects[3], 3)} alt={projects[3]?.title || "Project"} className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                            </Link>

                            <Link to={projects[4]?._id ? `/blog/${projects[4]._id}` : "/portfolio"} className="block group overflow-hidden bg-[#dfe4e9] min-h-[220px] sm:min-h-[270px]">
                                <img src={getProjectMedia(projects[4], 4)} alt={projects[4]?.title || "Project"} className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-16 sm:py-24 bg-[#e8ecef] border-t border-[#d2dae3]">
                <div className="max-w-[1250px] mx-auto px-4 sm:px-8 grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
                    <div>
                        <h3 className="architectural-heading text-[44px] sm:text-[64px] leading-[0.9] text-[#111821] mb-5">The Studio</h3>
                        <p className="text-[#596676] leading-8 max-w-xl">
                            Based in Addis Ababa, we design structures where material, light, and circulation are intentionally composed to create calm and durable spaces.
                        </p>

                        <div className="mt-10 flex items-center gap-8 sm:gap-12">
                            <div>
                                <p className="architectural-heading text-[42px] text-[#5a3f84] leading-none">15+</p>
                                <p className="text-[10px] uppercase tracking-[0.18em] text-[#556476]">Awards</p>
                            </div>
                            <div>
                                <p className="architectural-heading text-[42px] text-[#5a3f84] leading-none">100+</p>
                                <p className="text-[10px] uppercase tracking-[0.18em] text-[#556476]">Projects</p>
                            </div>
                            <div>
                                <p className="architectural-heading text-[42px] text-[#5a3f84] leading-none">01</p>
                                <p className="text-[10px] uppercase tracking-[0.18em] text-[#556476]">Offices</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative bg-[#dfe5eb] min-h-[300px] sm:min-h-[450px] overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1400&auto=format&fit=crop"
                            alt="Studio 21 Architects studio"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute left-0 bottom-0 bg-[#f5f7fa] px-8 py-5 shadow-[0_14px_30px_rgba(22,32,43,0.18)]">
                            <p className="text-[10px] tracking-[0.24em] uppercase text-[#5e6978]">Current Location</p>
                            <p className="architectural-heading mt-2 text-[25px] text-[#111821]">Addis Ababa, Ethiopia</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 sm:py-28 bg-[#0f151b] text-white text-center">
                <div className="max-w-3xl mx-auto px-4 sm:px-8">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#9babc0] mb-6">Interested in collaboration?</p>
                    <h3 className="architectural-heading text-[52px] sm:text-[82px] leading-[0.86] mb-10">Let's Build The Unconventional.</h3>
                    <Link
                        to="/contact"
                        className="inline-flex items-center justify-center h-12 px-10 bg-[#e7eaee] text-[#0f151b] text-[11px] uppercase tracking-[0.12em] hover:bg-white transition-colors"
                    >
                        Start a Conversation
                    </Link>
                </div>
            </section>
        </>
    );
};

export default FeaturedProjects;

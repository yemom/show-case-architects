import React from "react";
import Layout from "../components/Layout";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { MapPin, Calendar, Eye, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext } from "@/context/useAppContext";
import { getMediaUrl, stripHtml } from "@/lib/util";

type Blog = {
    _id: string;
    title: string;
    subTitle: string;
    description: string;
    category: string;
    image?: string | null;
    video?: string | null;
    createdAt: string;
};

const Portfolio: React.FC = () => {
    const { axios } = useAppContext();
    const [activeFilter, setActiveFilter] = React.useState("All");
    const [blogs, setBlogs] = React.useState<Blog[]>([]);
    const [loading, setLoading] = React.useState(true);

    const categories = React.useMemo(() => {
        const set = new Set<string>(["All"]);
        blogs.forEach((b) => b.category && set.add(b.category));
        return Array.from(set);
    }, [blogs]);

    React.useEffect(() => {
        const run = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('/api/blog/all');
                setBlogs(data?.blogs || []);
            } catch {
                setBlogs([]);
            } finally {
                setLoading(false);
            }
        };
        run();
    }, [axios]);

    const filtered = React.useMemo(() => {
        if (activeFilter === 'All') return blogs;
        return blogs.filter((p) => p.category === activeFilter);
    }, [activeFilter, blogs]);

    return (
        <Layout>
            <div className="">
                {/* Hero Section */}
                <section className="py-20 border-t bg-gradient-to-r from-primary to-secondary text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6  architectural-heading">
                            Our <span className="font-light">Portfolio</span>
                        </h1>
                        <p className="text-xl text-muted-foreground architectural-body">
                            Discover our collection of innovative architectural projects that demonstrate
                            our commitment to excellence, sustainability, and transformative design.
                        </p>
                    </div>
                </section>

                {/* Filter Tabs */}
                <section className="py-12 bg-architectural-light border-b border-border">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap justify-center gap-2">
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant={activeFilter === category ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setActiveFilter(category)}
                                    className="transition-all duration-200"
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Projects Grid */}
                <section className="py-20 bg-architectural-light">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {loading && (
                                <p className="col-span-full text-center text-sm text-muted-foreground">Loading projects…</p>
                            )}
                            {!loading && filtered.length === 0 && (
                                <p className="col-span-full text-center text-sm text-muted-foreground">No projects yet.</p>
                            )}
                            {!loading && filtered.map((project, index) => (
                                <Card key={project._id} className="group overflow-hidden border-0 shadow-card hover:shadow-architectural transition-all duration-500 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="relative overflow-hidden">
                                        {project.video ? (
                                            <video src={getMediaUrl(project.video, axios.defaults.baseURL) || ''} className="w-full h-64 object-cover" controls onError={(e) => {
                                                const el = e.currentTarget as HTMLVideoElement;
                                                if (el.src.includes('/uploads/videos/')) el.src = el.src.replace('/uploads/videos/', '/uploads/');
                                            }} />
                                        ) : (
                                            <img src={getMediaUrl(project.image, axios.defaults.baseURL) || ''} alt={project.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => {
                                                const el = e.currentTarget as HTMLImageElement;
                                                if (el.src.includes('/uploads/images/')) el.src = el.src.replace('/uploads/images/', '/uploads/');
                                            }} />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute top-4 left-4 right-4 flex justify-between">
                                            <Badge variant="secondary" className="bg-accent text-accent-foreground">
                                                {project.category}
                                            </Badge>
                                            <div className="flex space-x-2">
                                                <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Eye className="h-3 w-3" />
                                                </Button>
                                                <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ExternalLink className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <CardContent className="p-6 space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xl font-light group-hover:text-accent transition-colors">
                                                    {project.title}
                                                </h3>
                                                <Badge variant="outline">{project.category}</Badge>
                                            </div>

                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                <div className="flex items-center space-x-1">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{project.subTitle}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{new Date(project.createdAt).getFullYear()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                                            {stripHtml(project.description, 180)}
                                        </p>

                                        <Link to={`/blog/${project._id}`} className="w-full">
                                            <Button variant="ghost" size="sm" className="group/btn w-full justify-between p-0 h-auto font-light">
                                                View Project Details
                                                <ExternalLink className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Portfolio CTA */}
                <section className="py-20 bg-primary text-primary-foreground">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl font-light architectural-heading mb-6">
                            Have a Project in Mind?
                        </h2>
                        <p className="text-xl mb-8 text-primary-foreground/80">
                            Let's create something extraordinary together. Every great project starts with a conversation.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary">
                                Start Your Project
                            </Button>
                            <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                                Download Brochure
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default Portfolio;

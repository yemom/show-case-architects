import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext } from "@/context/useAppContext";
import { getMediaUrl, stripHtml } from "@/lib/util";

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

    React.useEffect(() => {
        const run = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('/api/blog/all');
                // Take latest 3
                const list: Blog[] = (data?.blogs || []).slice(0, 3);
                setProjects(list);
                    } catch {
                        // no-op for homepage
            } finally {
                setLoading(false);
            }
        };
        run();
    }, [axios]);

    return (
        <section className="py-20 bg-architectural-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-light architectural-heading mb-6">
                        Featured Projects
                    </h2>
                    <p className="text-xl text-muted-foreground architectural-body max-w-3xl mx-auto">
                        Explore our portfolio of innovative architectural solutions that have transformed
                        communities and redefined spaces across the globe.
                    </p>
                </div>

                {/* Projects Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {loading && (
                      <p className="col-span-full text-center text-sm text-muted-foreground">Loading featured projects…</p>
                    )}
                    {!loading && projects.length === 0 && (
                      <p className="col-span-full text-center text-sm text-muted-foreground">No projects yet.</p>
                    )}
                    {!loading && projects.map((project, index) => (
                        <Card key={project._id} className="group overflow-hidden border-0 shadow-card hover:shadow-architectural transition-all duration-500 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="relative overflow-hidden">
                                                                {project.video ? (
                                                                    <video
                                                                        src={getMediaUrl(project.video, axios.defaults.baseURL) || ''}
                                                                        className="w-full h-64 object-cover"
                                                                        controls
                                                                        onError={(e) => {
                                                                            const el = e.currentTarget as HTMLVideoElement;
                                                                            if (el.src.includes('/uploads/videos/')) el.src = el.src.replace('/uploads/videos/', '/uploads/');
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        src={getMediaUrl(project.image, axios.defaults.baseURL) || ''}
                                                                        alt={project.title}
                                                                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                                                                        onError={(e) => {
                                                                            const el = e.currentTarget as HTMLImageElement;
                                                                            if (el.src.includes('/uploads/images/')) el.src = el.src.replace('/uploads/images/', '/uploads/');
                                                                        }}
                                                                    />
                                                                )}
                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                                        {project.category || 'Project'}
                                    </span>
                                </div>
                            </div>

                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-light group-hover:text-accent transition-colors">
                                        {project.title}
                                    </h3>
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

                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {stripHtml(project.description, 160)}
                                </p>

                                <Link to={`/blog/${project._id}`}>
                                    <Button variant="ghost" size="sm" className="group/btn p-0 h-auto font-light">
                                        View Project
                                        <ArrowRight className="ml-2 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <Link to="/portfolio">
                        <Button size="lg" variant="outline">
                            View All Projects
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProjects;

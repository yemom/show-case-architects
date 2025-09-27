import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MapPin, Calendar } from "lucide-react";

const FeaturedProjects = () => {
    const projects = [
        {
            id: 1,
            title: "Skyline Residences",
            category: "Residential",
            location: "New York, NY",
            year: "2024",
            description: "A 40-story luxury residential tower featuring sustainable design principles and panoramic city views.",
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
        },
        {
            id: 2,
            title: "Innovation Hub",
            category: "Commercial",
            location: "San Francisco, CA",
            year: "2023",
            description: "Modern office complex designed to foster creativity and collaboration in the heart of Silicon Valley.",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
        },
        {
            id: 3,
            title: "Cultural Center",
            category: "Public",
            location: "Chicago, IL",
            year: "2023",
            description: "A dynamic cultural space that brings together art, performance, and community engagement.",
            image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=600&h=400&fit=crop",
        },
    ];

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
                    {projects.map((project, index) => (
                        <Card key={project.id} className="group overflow-hidden border-0 shadow-card hover:shadow-architectural transition-all duration-500 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="relative overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                                        {project.category}
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
                                            <span>{project.location}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>{project.year}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {project.description}
                                </p>

                                <Button variant="ghost" size="sm" className="group/btn p-0 h-auto font-light">
                                    View Project
                                    <ArrowRight className="ml-2 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <Button size="lg" variant="outline">
                        View All Projects
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProjects;

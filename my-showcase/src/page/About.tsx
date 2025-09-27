import Layout from "../components/Layout";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Users, Award, Building, Target } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
    const team = [
        {
            name: "Yohanes Lakew",
            role: "Lead Architect",
            image: "",
            bio: "20+ years of experience in sustainable architecture and urban planning.",
        },
        {
            name: "Michael Rodriguez",
            role: "Design Director",
            image: "",
            bio: "Specializes in innovative commercial and residential design solutions.",
        },
        {
            name: "Emma Thompson",
            role: "Project Manager",
            image: "e",
            bio: "Expert in project coordination and client relationship management.",
        },
    ];

    const values = [
        {
            icon: Target,
            title: "Innovation",
            description: "We push the boundaries of architectural design with cutting-edge technology and creative solutions.",
        },
        {
            icon: Building,
            title: "Sustainability",
            description: "Every project incorporates eco-friendly materials and energy-efficient design principles.",
        },
        {
            icon: Users,
            title: "Collaboration",
            description: "We work closely with clients, communities, and partners to create meaningful spaces.",
        },
        {
            icon: Award,
            title: "Excellence",
            description: "Our commitment to quality and attention to detail has earned us industry recognition.",
        },
    ];

    return (
        <Layout>
            <div className="">
                {/* Hero Section */}
                <section className="py-20 border-t bg-gradient-to-r from-primary to-secondary text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 architectural-heading">
                            About <span className="font-light">Our </span>
                            Studio
                        </h1>
                        <p className="text-xl text-muted-foreground architectural-body">
                            For over a decade, we've been transforming visions into reality through
                            innovative architectural design and sustainable building practices.
                        </p>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-20 bg-architectural-light">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-6">
                                <h2 className="text-4xl font-light architectural-heading">Our Story</h2>
                                <div className="space-y-4 text-muted-foreground architectural-body">
                                    <p>
                                        Founded in 2012, Architecture Studio began as a small team of passionate
                                        architects with a shared vision: to create buildings that not only serve
                                        their purpose but inspire and uplift the communities they serve.
                                    </p>
                                    <p>
                                        Today, we're a full-service architectural firm with over 150 completed
                                        projects spanning residential, commercial, and public spaces. Our work
                                        has been recognized with numerous awards for innovation, sustainability,
                                        and design excellence.
                                    </p>
                                    <p>
                                        We believe that great architecture has the power to transform lives,
                                        strengthen communities, and create a more sustainable future for all.
                                    </p>
                                </div>
                                <Link to="/portfolio">
                                    <Button size="lg" className="mt-6">
                                        View Our Portfolio
                                    </Button>
                                </Link>
                            </div>
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop"
                                    alt="Architecture team working"
                                    className="rounded-lg shadow-architectural"
                                />
                                <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground p-6 rounded-lg shadow-accent">
                                    <div className="text-2xl font-light">12+</div>
                                    <div className="text-sm">Years Experience</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-light architectural-heading mb-6">Our Values</h2>
                            <p className="text-xl text-muted-foreground architectural-body max-w-3xl mx-auto">
                                These core principles guide everything we do, from initial concept to final construction.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <Card key={index} className="text-center border-0 shadow-card hover:shadow-architectural transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <CardContent className="p-8 space-y-4">
                                        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                                            <value.icon className="h-8 w-8 text-accent" />
                                        </div>
                                        <h3 className="text-xl font-light">{value.title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {value.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-20 bg-architectural-light">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-light architectural-heading mb-6">Meet Our Team</h2>
                            <p className="text-xl text-muted-foreground architectural-body max-w-3xl mx-auto">
                                Our talented professionals bring diverse expertise and creative vision to every project.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {team.map((member, index) => (
                                <Card key={index} className="text-center border-0 shadow-card hover:shadow-architectural transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <CardContent className="p-8 space-y-4">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-24 h-24 rounded-full mx-auto object-cover"
                                        />
                                        <div>
                                            <h3 className="text-xl font-light">{member.name}</h3>
                                            <p className="text-accent font-medium">{member.role}</p>
                                        </div>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {member.bio}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default About;

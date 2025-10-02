import Layout from "../components/Layout";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
    Building,
    Home,
    Palette,
    Box,
    Wrench,
    Users,
    ArrowRight,
    CheckCircle
} from "lucide-react";
import { services as servicesData } from "@/assets/services";
import type { ServiceItem } from "@/assets/services";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
    const IconMap = { Building, Home, Palette, Box, Wrench, Users } satisfies Record<ServiceItem["icon"], LucideIcon>;

    type MappedService = Omit<ServiceItem, "icon"> & { icon: LucideIcon };
    const services: MappedService[] = servicesData.map((s) => ({
        ...s,
        icon: IconMap[s.icon],
    }));

    const process = [
        {
            step: "01",
            title: "Discovery & Consultation",
            description: "We begin with an in-depth consultation to understand your vision, requirements, and budget.",
        },
        {
            step: "02",
            title: "Concept Development",
            description: "Our team develops initial concepts and presents design options for your review and feedback.",
        },
        {
            step: "03",
            title: "Design Development",
            description: "We refine the chosen concept, creating detailed drawings and specifications for construction.",
        },
        {
            step: "04",
            title: "Construction Support",
            description: "We provide ongoing support during construction to ensure your vision is realized perfectly.",
        },
    ];

    return (
        <Layout>
            <div className="">
                {/* Hero Section */}
                <section className="py-20 border-t bg-gradient-to-r from-primary to-secondary text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className=" architectural-heading  text-4xl md:text-6xl font-bold mb-6">
                            Our <span className="font-light">Services</span>
                        </h1>
                        <p className="text-xl text-muted-foreground architectural-body">
                            Comprehensive architectural services tailored to bring your vision to life
                            with precision, creativity, and exceptional attention to detail.
                        </p>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="py-20 bg-architectural-light">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service, index) => (
                                <Card key={index} className="border-0 shadow-card hover:shadow-architectural transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <CardContent className="p-8 space-y-6">
                                        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                                            <service.icon className="h-8 w-8 text-accent" />
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-light mb-3">{service.title}</h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                {service.description}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            {service.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center space-x-2 text-sm">
                                                    <CheckCircle className="h-4 w-4 text-accent" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-4 border-t border-border">
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-light text-accent">{service.price}</span>
                                                <Link to={`/services/${service.slug}`}>
                                                    <Button variant="ghost" size="sm" className="group">
                                                        Learn More
                                                        <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Process Section */}
                <section className="py-20 bg-background">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-light architectural-heading mb-6">Our Process</h2>
                            <p className="text-xl text-muted-foreground architectural-body max-w-3xl mx-auto">
                                A streamlined approach that ensures every project is delivered on time,
                                within budget, and exceeds expectations.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {process.map((step, index) => (
                                <div key={index} className="text-center space-y-4 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto text-xl font-light">
                                        {step.step}
                                    </div>
                                    <h3 className="text-lg font-light">{step.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                    {index < process.length - 1 && (
                                        <div className="hidden lg:block absolute top-8 left-full w-8 h-px bg-border" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-primary text-primary-foreground">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl font-light architectural-heading mb-6">
                            Ready to Start Your Project?
                        </h2>
                        <p className="text-xl mb-8 text-primary-foreground/80">
                            Let's discuss your vision and create something extraordinary together.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/contact">
                                <Button size="lg" variant="secondary">
                                    Schedule Consultation
                                </Button>
                            </Link>
                            <Link to="/portfolio">
                                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                                    View Portfolio
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default Services;

import Layout from "../components/Layout";
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
            <div className="bg-[#eceff2] text-[#13202b]">
                <section className="relative min-h-[52vh] border-b border-[#c9d3df] overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1800&auto=format&fit=crop"
                            alt="Services"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(222,232,242,0.85)_18%,rgba(21,40,60,0.4)_58%,rgba(10,18,28,0.58)_100%)]" />
                    </div>
                    <div className="relative z-10 max-w-[1250px] mx-auto px-4 sm:px-8 pt-28 pb-16">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-[#d8e5f2] mb-4">Services</p>
                        <h1 className="architectural-heading text-[56px] sm:text-[88px] leading-[0.9] text-white max-w-3xl">Programmed Precision Across Every Scale.</h1>
                        <p className="mt-5 text-sm sm:text-base text-[#d6e4f1] max-w-2xl leading-8">
                            Comprehensive architectural services tailored to bring your vision to life
                            with precision, creativity, and exceptional attention to detail.
                        </p>
                    </div>
                </section>

                <section className="py-16 sm:py-24 bg-[#0f151b] text-white">
                    <div className="max-w-[1250px] mx-auto px-4 sm:px-8">
                        <div className="mb-12">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8da0b5] mb-3">Capabilities</p>
                            <h2 className="architectural-heading text-[44px] sm:text-[68px] leading-[0.9]">What We Deliver</h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {services.map((service, index) => (
                                <article key={index} className="border border-white/12 bg-[#151e27] p-6 reveal-up" style={{ animationDelay: `${index * 0.08}s` }}>
                                    <div className="w-12 h-12 border border-white/20 bg-[#1b2632] flex items-center justify-center">
                                            <service.icon className="h-5 w-5 text-[#9cb7d5]" />
                                        </div>

                                    <div className="mt-5">
                                        <h3 className="architectural-heading text-[30px] leading-[0.95] mb-3">{service.title}</h3>
                                            <p className="text-[#a7b5c6] text-sm leading-7">
                                                {service.description}
                                            </p>
                                        </div>

                                    <div className="space-y-2 mt-4">
                                            {service.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center space-x-2 text-sm text-[#c5d1dd]">
                                                <CheckCircle className="h-4 w-4 text-[#8fa7c4]" />
                                                <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                    <div className="pt-5 mt-5 border-t border-white/12">
                                        <div className="flex items-center justify-between">
                                            <span className="architectural-heading text-[28px] text-[#dfeaf6]">{service.price}</span>
                                                <Link to={`/services/${service.slug}`}>
                                                <span className="inline-flex items-center text-[11px] uppercase tracking-[0.12em] text-[#b6c7d9] hover:text-white transition-colors">
                                                        Learn More
                                                    <ArrowRight className="ml-2 h-3 w-3" />
                                                </span>
                                                </Link>
                                            </div>
                                        </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16 sm:py-24">
                    <div className="max-w-[1250px] mx-auto px-4 sm:px-8">
                        <div className="mb-12">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#50647d] mb-3">Method</p>
                            <h2 className="architectural-heading text-[44px] sm:text-[68px] leading-[0.9]">Our Process</h2>
                            <p className="mt-4 text-[#5a6878] max-w-3xl leading-8">
                                A streamlined approach that ensures every project is delivered on time,
                                within budget, and exceeds expectations.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {process.map((step, index) => (
                                <div key={index} className="bg-[#dfe6ed] p-6 reveal-up" style={{ animationDelay: `${index * 0.08}s` }}>
                                    <div className="w-11 h-11 bg-[#111b25] text-white flex items-center justify-center text-sm tracking-[0.08em] mb-5">
                                        {step.step}
                                    </div>
                                    <h3 className="architectural-heading text-[28px] leading-[0.95] text-[#101a24]">{step.title}</h3>
                                    <p className="text-[#56687b] text-sm leading-7 mt-3">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-20 sm:py-28 bg-[#0f151b] text-white text-center">
                    <div className="max-w-3xl mx-auto px-4 sm:px-8">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-[#9babc0] mb-6">Start with a brief</p>
                        <h2 className="architectural-heading text-[48px] sm:text-[78px] leading-[0.86] mb-7">
                            Ready to Start Your Project?
                        </h2>
                        <p className="text-[#b0bfce] mb-8 leading-8">
                            Let's discuss your vision and create something extraordinary together.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/contact">
                                <span className="inline-flex h-12 items-center px-9 bg-[#e7edf4] text-[#111b24] text-[11px] uppercase tracking-[0.12em] hover:bg-white transition-colors">
                                    Schedule Consultation
                                </span>
                            </Link>
                            <Link to="/portfolio">
                                <span className="inline-flex h-12 items-center px-9 border border-white/40 text-white text-[11px] uppercase tracking-[0.12em] hover:bg-white/10 transition-colors">
                                    View Portfolio
                                </span>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default Services;

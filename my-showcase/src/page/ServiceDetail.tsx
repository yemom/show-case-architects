import Layout from "@/components/Layout";
import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { services } from "@/assets/services";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const ServiceDetail = () => {
    const { slug } = useParams<{ slug: string }>();

    const service = useMemo(() => services.find((s) => s.slug === slug), [slug]);

    if (!service) {
        return (
            <Layout>
                <div className="max-w-3xl mx-auto px-6 py-24 text-center">
                    <h1 className="text-3xl font-light mb-4">Service not found</h1>
                    <p className="text-muted-foreground mb-8">The service you're looking for doesn't exist.</p>
                    <Link to="/services">
                        <Button variant="outline">Back to Services</Button>
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="py-20 border-t bg-gradient-to-r from-primary to-secondary text-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{service.title}</h1>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">{service.description}</p>
                </div>
            </section>

            <section className="py-16 bg-architectural-light">
                <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-10">
                        <p className="text-base leading-relaxed">{service.longDescription}</p>

                        {/* Key Features */}
                        <div className="space-y-3">
                            {service.features.map((f: string, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-accent" />
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>

                        {/* Build Steps */}
                        {service.buildSteps && service.buildSteps.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-light mb-4">How We Build</h2>
                                <div className="space-y-4">
                                    {service.buildSteps.map(
                                        (s: { title: string; content: string }, idx: number) => (
                                            <div key={idx} className="rounded-lg border p-4 bg-card/50">
                                                <div className="font-medium">
                                                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}. {s.title}
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">{s.content}</div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Materials */}
                        {service.materials && service.materials.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-light mb-4">Materials We Recommend</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {service.materials.map(
                                        (
                                            m: { category: string; items: string[] },
                                            idx: number
                                        ) => (
                                            <div key={idx} className="rounded-lg border p-4 bg-card/50">
                                                <div className="font-medium mb-2">{m.category}</div>
                                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                                    {m.items.map((item: string, i: number) => (
                                                        <li key={i}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Furnishings */}
                        {service.furnishings && service.furnishings.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-light mb-4">Furniture & Layout Guidance</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {service.furnishings.map(
                                        (
                                            f: { area: string; items: string[] },
                                            idx: number
                                        ) => (
                                            <div key={idx} className="rounded-lg border p-4 bg-card/50">
                                                <div className="font-medium mb-2">{f.area}</div>
                                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                                    {f.items.map((item: string, i: number) => (
                                                        <li key={i}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Deliverables */}
                        {service.deliverables && service.deliverables.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-light mb-4">What You Receive</h2>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    {service.deliverables.map((d: string, i: number) => (
                                        <li key={i}>{d}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-4 rounded-xl border bg-card p-6">
                        <div>
                            <div className="text-sm text-muted-foreground">Pricing</div>
                            <div className="text-xl text-accent mt-1">{service.price}</div>
                        </div>
                        <Link to="/contact">
                            <Button className="w-full bg-accent text-white hover:bg-accent/90">Schedule Consultation</Button>
                        </Link>
                        <Link to="/portfolio">
                            <Button variant="outline" className="w-full">View Portfolio</Button>
                        </Link>
                    </aside>
                </div>
            </section>
        </Layout>
    );
};

export default ServiceDetail;

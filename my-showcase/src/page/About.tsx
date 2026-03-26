import Layout from "../components/Layout";
import { Users, Award, Building, Target } from "lucide-react";
import { Link } from "react-router-dom";
import johnImage from "../assets/john.png";

const About = () => {
    const team = [
        {
            name: "Yohanes Lakew",
            role: "Lead Architect",
            image: johnImage,
            bio: "20+ years of experience in sustainable architecture and urban planning.",
        },
        {
            name: "Elshadai Begashaw",
            role: "Design Director",
            image: johnImage,
            bio: "Specializes in innovative commercial and residential design solutions.",
        },
        {
            name: "Ftsum Begashaw",
            role: "Project Manager",
           image: johnImage,
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
            <div className="bg-[#eceff2] text-[#13202b]">
                <section className="relative min-h-[58vh] border-b border-[#c9d3df] overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1800&auto=format&fit=crop"
                            alt="Architecture studio"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(106deg,rgba(219,230,240,0.82)_15%,rgba(17,34,53,0.42)_60%,rgba(12,20,30,0.46)_100%)]" />
                    </div>
                    <div className="relative z-10 max-w-[1250px] mx-auto px-4 sm:px-8 pt-28 pb-16">
                        <p className="text-[10px] uppercase tracking-[0.23em] text-[#dfebf7] mb-4">About Studio 21 Architects</p>
                        <h1 className="architectural-heading text-white text-[56px] sm:text-[92px] leading-[0.9] max-w-3xl">Designing Cultural Memory In Built Form.</h1>
                        <p className="mt-5 text-sm sm:text-base text-[#d8e5f2] max-w-2xl leading-8">
                            We translate ambition into enduring spaces through disciplined geometry, material intelligence, and contextual sensitivity.
                        </p>
                    </div>
                </section>

                <section className="py-16 sm:py-24">
                    <div className="max-w-[1250px] mx-auto px-4 sm:px-8 grid lg:grid-cols-[1fr_1.1fr] gap-12 items-start">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#50647d] mb-3">Our Story</p>
                            <h2 className="architectural-heading text-[44px] sm:text-[68px] leading-[0.9] mb-6">From Vision To Legacy.</h2>
                            <div className="space-y-4 text-[#4f5f71] leading-8">
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
                            <Link
                                to="/portfolio"
                                className="inline-flex mt-8 h-11 items-center px-7 bg-[#111a23] text-white text-[11px] uppercase tracking-[0.12em] hover:bg-[#1a2733] transition-colors"
                            >
                                View Portfolio
                            </Link>
                        </div>
                        <div className="relative bg-[#dfe6ed] min-h-[320px] sm:min-h-[500px] overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1300&auto=format&fit=crop"
                                    alt="Architecture team working"
                                className="h-full w-full object-cover"
                                />
                            <div className="absolute left-0 bottom-0 bg-[#f5f8fb] px-8 py-5 shadow-[0_14px_30px_rgba(18,30,42,0.16)]">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#607287]">Established</p>
                                <p className="architectural-heading text-[34px] text-[#0f1b27] leading-none mt-1">2012</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 sm:py-20 bg-[#0f151b] text-white">
                    <div className="max-w-[1250px] mx-auto px-4 sm:px-8">
                        <div className="mb-12">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8da0b5] mb-3">Framework</p>
                            <h2 className="architectural-heading text-[44px] sm:text-[68px] leading-[0.9]">Our Values</h2>
                            <p className="mt-4 text-[#a4b4c7] max-w-3xl leading-8">
                                These core principles guide everything we do, from initial concept to final construction.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {values.map((value, index) => (
                                <article key={index} className="border border-white/12 bg-[#151e27] p-6 sm:p-7 reveal-up" style={{ animationDelay: `${index * 0.08}s` }}>
                                    <value.icon className="h-7 w-7 text-[#9cb7d5]" />
                                    <h3 className="architectural-heading text-[28px] mt-5 mb-3">{value.title}</h3>
                                    <p className="text-sm text-[#a7b5c6] leading-7">
                                            {value.description}
                                        </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16 sm:py-24">
                    <div className="max-w-[1250px] mx-auto px-4 sm:px-8">
                        <div className="mb-12">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#50647d] mb-3">People</p>
                            <h2 className="architectural-heading text-[44px] sm:text-[68px] leading-[0.9]">The Team</h2>
                            <p className="mt-4 text-[#5a6878] max-w-3xl leading-8">
                                Our talented professionals bring diverse expertise and creative vision to every project.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {team.map((member, index) => (
                                <article key={index} className="bg-[#dfe6ed] reveal-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                        className="w-full h-60 object-cover"
                                        />
                                    <div className="p-6">
                                        <div className="mb-3">
                                            <h3 className="architectural-heading text-[30px] leading-none text-[#111c26]">{member.name}</h3>
                                            <p className="text-[11px] mt-2 uppercase tracking-[0.14em] text-[#5e738c]">{member.role}</p>
                                        </div>
                                        <p className="text-sm text-[#4f6174] leading-7">
                                            {member.bio}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default About;

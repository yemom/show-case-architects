import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1400&auto=format&fit=crop"
                    alt="Modern architecture showcase"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Hero Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 animate-fade-in text-white">
                        {/* Badge */}
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                            <span className="text-accent text-sm font-medium">Award-Winning Architecture</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight architectural-heading text-white">
                            Designing
                            <span className="block text-accent">Tomorrow's</span>
                            Spaces
                        </h1>

                        {/* Description */}
                        <p className="text-xl text-white/80 architectural-body max-w-lg">
                            We create innovative architectural solutions that blend sustainability,
                            functionality, and aesthetic excellence to shape the future of living spaces.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/portfolio">
                                <Button size="lg" className="group">
                                    View Our Portfolio
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/portfolio">
                                <Button variant="outline" size="lg" className="group">
                                    <Play className="mr-2 h-4 w-4" />
                                    Watch Showcase
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
                            <div>
                                <div className="text-2xl font-light text-accent">150+</div>
                                <div className="text-sm text-white/70">Projects Completed</div>
                            </div>
                            <div>
                                <div className="text-2xl font-light text-accent">25+</div>
                                <div className="text-sm text-white/70">Awards Won</div>
                            </div>
                            <div>
                                <div className="text-2xl font-light text-accent">12</div>
                                <div className="text-sm text-white/70">Years Experience</div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Additional visual element could go here */}
                    <div className="hidden lg:block animate-slide-up">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-accent rounded-lg blur-2xl opacity-20 animate-parallax" />
                            <div className="relative bg-card/30 backdrop-blur-sm border border-white/20 rounded-lg p-8 shadow-architectural text-white">
                                <h3 className="text-xl font-light mb-4">Latest Project</h3>
                                <p className="text-white/80 mb-4">
                                    Sustainable residential complex featuring innovative green building techniques
                                </p>
                                <Link to="/portfolio">
                                    <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
                                        Learn More
                                        <ArrowRight className="ml-2 h-3 w-3" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                <div className="flex flex-col items-center space-y-2 animate-bounce">
                    <div className="w-px h-8 bg-accent" />
                    <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
            </div>
        </section>
    );
};

export default Hero;

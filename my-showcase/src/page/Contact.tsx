import React, { useState, useRef } from "react";
import { motion as Motion } from "framer-motion";
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { assets } from "@/assets/assets";
import toast from 'react-hot-toast';
import Layout from "@/components/Layout";

type FormData = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

type TemplateParams = {
    from_name: string;
    from_email: string;
    reply_to: string;
    subject: string;
    message: string;
    to_name: string;
    to_email: string;
};

const Contact: React.FC = () => {
    const formRef = useRef<HTMLFormElement | null>(null);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Please fill in all required fields');
            setIsSubmitting(false);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            setIsSubmitting(false);
            return;
        }

        const SERVICE_ID = (import.meta.env.VITE_EMAILJS_SERVICE_ID as string) || 'service_1h9yo34';
        const TEMPLATE_ID = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string) || 'template_3zk488d';
        const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;


        const templateParams: TemplateParams = {
            from_name: formData.name,
            from_email: formData.email,
            reply_to: formData.email,
            subject: formData.subject || 'New Contact Message',
            message: formData.message,
            to_name: 'Studio 21',
            to_email: 'Studio21.architectsanddesign@gmail.com'
        };

        try {
            const sendPromise: Promise<EmailJSResponseStatus> = PUBLIC_KEY
                ? emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
                : emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);

            await sendPromise;
            toast.success("Message sent successfully. We'll reply soon.");
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error: unknown) {
            // Narrow possible EmailJS error shapes safely
            const err = error as { text?: string; message?: string } | undefined;
            console.error('EmailJS send error:', error);
            const detail = err?.text || err?.message || 'Unknown error';
            toast.error(`Failed to send message: ${detail}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <Motion.div className="min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-primary to-secondary text-white py-20">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact <span className="font-light">Our Interior Design </span>Team</h1>
                        <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto text-gray-500 mb-8">
                            We'd love to hear about your next project or answer any design questions. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>
                </div>

                <div className="py-16 bg-architectural-light">
                    <div className="max-w-6xl mx-auto px-8 sm:px-20 xl:px-32">
                        <div className="grid lg:grid-cols-2 gap-12 bg-background-2">
                            {/* Contact Form */}
                            <Motion.div
                                className="card card-elevate p-8"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.4 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            placeholder="What's this about?"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                            placeholder="Tell us what's on your mind..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            </Motion.div>

                            {/* Contact Information */}
                            <div className="space-y-8">
                                <Motion.div className="card card-elevate p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: 0.05 }}>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
                                    <div className="space-y-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <img src={assets.email_icon} alt="Email" className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                                                <p className="text-gray-600">Studio21.architectsanddesign@gmail.com</p>
                                                <p className="text-gray-600">etonetor@gmail.com</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                                                <p className="text-gray-600">+251-996-519-900</p>
                                                <p className="text-gray-600">Mon-Fri 9AM-6PM EST</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800 mb-1">Office</h3>
                                                <p className="text-gray-600">Gurd Shola Senper</p>
                                                <p className="text-gray-600">4th flor office 415</p>
                                            </div>
                                        </div>
                                    </div>
                                </Motion.div>

                                {/* Social Media */}
                                <Motion.div className="card card-elevate p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: 0.1 }}>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Follow Us</h2>
                                    <div className="flex space-x-4">

                                        <a href="https://www.tiktok.com/@studio.21.architects?_t=ZM-8zpWoh2CNSq&_r=1" className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                                            <img src={assets.tiktok_icon} alt="Twitter" className="w-6 h-6" />
                                        </a>
                                        <a href="https://www.instagram.com/architectsstudio21?utm_source=qr&igsh=MTNrZGM4ZjR3cnd5ZA==" className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                                            <img src={assets.instagram_icon} alt="Google+" className="w-6 h-6" />
                                        </a>
                                    </div>
                                </Motion.div>

                                {/* FAQ */}
                                <Motion.div className="card card-elevate p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: 0.15 }}>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
                                    <h3 className="font-semibold text-gray-800 mb-2">How fast does Studio 21 Architects reply?</h3>
                                    <p className="text-gray-600 text-sm">Most enquiries receive an initial response within one business day. Urgent, active project clients get priority updates throughout the design & build cycle.</p>
                                    <h3 className="font-semibold text-gray-800 mb-2">Do you both design and build interiors?</h3>
                                    <p className="text-gray-600 text-sm">Yes. We handle full interior architecture: concept development, 3D visualization, technical drawings, material & furniture specification, and supervised build / fit‑out to deliver a finished space.</p>
                                    <h3 className="font-semibold text-gray-800 mb-2">Can you showcase my project?</h3>
                                    <p className="text-gray-600 text-sm">If we design or build your space and you grant permission, we can professionally photograph and feature it in our Studio 21 showcase portfolio and social channels.</p>
                                    <h3 className="font-semibold text-gray-800 mb-2">What is your typical process?</h3>
                                    <p className="text-gray-600 text-sm">1) Discovery & site review  2) Concept + mood & space planning  3) 3D & technical detailing  4) Budget & procurement  5) Build / supervision  6) Styling & handover.</p>
                                </Motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </Motion.div>
        </Layout>
    );
};

export default Contact;

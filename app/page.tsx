"use client";
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Facebook, Twitter , Youtube, MapPin, Phone, Mail } from "lucide-react"
import { useState, useEffect } from "react"
import { teamMembers } from "./data/teamMembers"
import GalleryCarousel from "./components/GalleryCarousel"
import TeamCarousel from "./components/TeamCarousel"

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Team", href: "#team" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact Us", href: "#contact" },
]

export default function Home() {
  const [active, setActive] = useState("Home")
  const [isScrolled, setIsScrolled] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    loading: false,
    success: false,
    error: ''
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Add intersection observer for section tracking
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -90% 0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id
          const sectionToNavMap: { [key: string]: string } = {
            'home': 'Home',
            'features': 'Features',
            'team': 'Team',
            'gallery': 'Gallery',
            'contact': 'Contact Us'
          }
          const newActive = sectionToNavMap[sectionId]
          if (newActive && newActive !== active) {
            setActive(newActive)
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    const sections = document.querySelectorAll('section[id]')
    sections.forEach(section => observer.observe(section))
    return () => {
      sections.forEach(section => observer.unobserve(section))
    }
  }, [active])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, error: '' });
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      setFormStatus({ loading: false, success: true, error: '' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setFormStatus({ loading: false, success: false, error: 'Failed to send message. Please try again.' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-[100] shadow-sm transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}>
        <div className={`container mx-auto px-4 md:px-10 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'max-w-5xl' : 'max-w-7xl'
        }`}>
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="VocaB.AI Logo"
              width={isScrolled ? 160 : 200}
              height={isScrolled ? 50 : 62}
              priority
              className="transition-all duration-300 w-auto h-8 md:h-auto"
            />
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className={`flex space-x-8 transition-all duration-300 ${
              isScrolled ? 'space-x-6' : 'space-x-8'
            }`}>
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`text-sm transition-all duration-300 ${
                      active === link.label
                        ? "font-medium border-b-2 border-primary pb-1"
                        : "font-small hover:text-primary"
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      setActive(link.label)
                      const section = document.querySelector(link.href)
                      section?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Navigation */}
          <div className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg transition-all duration-300 ${
            isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}>
            <ul className="py-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`block px-3 py-1 text-sm ${
                      active === link.label
                        ? "font-medium text-primary"
                        : "text-gray-600 hover:text-primary"
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      setActive(link.label)
                      setIsMobileMenuOpen(false)
                      const section = document.querySelector(link.href)
                      section?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      {/* Add padding to account for fixed header */}
      <div className={`pt-[86px] transition-all duration-300 ${
        isScrolled ? 'pt-[70px]' : 'pt-[86px]'
      }`}>
        {/* Hero Section */}
        <section id="home" className="relative bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="container mx-auto px-4 md:px-20">
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-2xl mx-auto mb-8">
                <div className="absolute left-2 sm:-left-46 top-20 p-[1px] rounded-full bg-gradient-to-b from-[#82C4FF] to-[#56B0FF] shadow-sm animate-gradient hover:scale-105 transition-transform duration-300">
                  <div className="bg-white rounded-full px-3 md:px-4 py-2 md:py-3 text-xs hover:bg-opacity-90 transition-all duration-300">
                    Conversational AI
                  </div>
                </div>
                <div className="absolute right-2 md:-right-10 top-4 p-[1px] rounded-full bg-gradient-to-b from-[#82C4FF] to-[#56B0FF] shadow-sm animate-gradient hover:scale-105 transition-transform duration-300">
                  <div className="bg-white rounded-full px-2 md:px-3 py-2 text-xs hover:bg-opacity-90 transition-all duration-300">
                    Agentic AI
                  </div>
                </div>
                <div className="absolute right-0 md:right-0 top-28 p-[1px] rounded-full bg-gradient-to-b from-[#82C4FF] to-[#56B0FF] shadow-sm animate-gradient hover:scale-105 transition-transform duration-300">
                  <div className="bg-white rounded-full px-3 md:px-4 py-2 text-xs hover:bg-opacity-90 transition-all duration-300">
                    CRM
                  </div>
                </div>
                <Image
                  src="/hero.svg"
                  alt="AI Analytics Illustration"
                  width={800}
                  height={400}
                  className="mx-auto w-full max-w-[800px] -mt-16"
                />

                <div className="text-center max-w-3xl px-4 -mt-40 md:-mt-80">
                <p className="text-lg md:text-xl mt-44 text-opacity-60 text-gray-900 mb-4">Image, Audio and Text Analytics</p>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                  Unlock Valuable Insights From
                  <br className="hidden md:block" />
                  Real Life Conversations
                </h2>
                <p className="text-base md:text-lg text-gray-600 text-opacity-60 mb-6">
                  Harnessing <span className="font-bold">Artificial Intelligence</span> for transforming businesses
                </p>
                <div className="w-24 h-[2px] bg-gradient-to-r from-[#002CCD] to-[#002CCD] mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Data Potential Section */}
        <section id="features" className="py-16 bg-blue-50">
          <div className="container mx-auto px-4 md:px-20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Unlock The Full   
                  <br className="hidden md:block" />
                  Potential Of Your Data
                </h2>
                <div className="flex flex-row gap-2 w-full">
                  <div className="flex-1">
                    <Image
                      src="/d1.svg"
                      alt="Data Visualization 1"
                      width={400}
                      height={240}
                      className="rounded-lg w-full h-auto aspect-[5/3] object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="flex-1">
                    <Image
                      src="/d2.svg"
                      alt="Data Visualization 2"
                      width={400}
                      height={240}
                      className="rounded-lg w-full h-auto aspect-[5/3] object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="flex-1">
                    <Image
                      src="/d3.svg"
                      alt="Data Visualization 3"
                      width={400}
                      height={240}
                      className="rounded-lg w-full h-auto aspect-[5/3] object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8 md:mt-0">
                <p className="text-gray-500 mb-4">
                  With our advanced AI-based analytics, clients can automate processes, enhance decision-making, and drive
                  growth.
                </p>
                <p className="text-gray-500">
                  From natural language processing, speech recognition and sentiment analysis to image recognition, our
                  expert team develops tailored solutions that transform data into actionable intelligence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Features */}
        <section id="demo" className="py-16 bg-blue-50">
          <div className="container mx-auto px-4 md:px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Text Analytics */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-lg">
                <div className="h-50 flex items-center justify-center p-5">
                  <Image
                    src="/textanalytics.png"
                    alt="Text Analytics"
                    width={400}
                    height={120}
                  />
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-xl font-bold text-center mb-4 md:mb-6">Text Analytics</h3>
                  <p className="text-sm md:text-base text-center text-gray-600 opacity-60">
                    Using NLP and machine learning, we analyze client-based inputs and conversations to enable data-driven
                    decisions. Our focus is on enhancing customer experience, improving operational efficiency, and
                    driving innovation for a competitive edge.
                  </p>
                </div>
              </div>

              {/* Audio Analytics */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-lg">
                <div className="h-50 flex items-center justify-center p-5">
                  <Image
                    src="/audioanalytics.png"
                    alt="Audio Analytics"
                    width={400}
                    height={120}
                    className="rounded-[10px] object-cover w-full max-w-[400px]"
                  />
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-xl font-bold text-center mb-4 md:mb-6">Audio Analytics</h3>
                  <p className="text-sm md:text-base text-center text-gray-600 opacity-60">
                    Using speech recognition, NLP, and machine learning, our tools help analyze audio data to improve
                    customer service, boost efficiency, and drive innovation. Our solutions identify emotions, sentiment
                    and speech patterns, enabling insights-driven decisions.
                  </p>
                </div>
              </div>

              {/* Image Analytics */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-lg">
                <div className="h-50 flex items-center justify-center p-5">
                  <Image
                    src="/imageanalytics.png"
                    alt="Image Analytics"
                    width={400}
                    height={120}
                    className="rounded-[10px] object-cover w-full max-w-[400px]"
                  />
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-xl font-bold text-center mb-4 md:mb-6">Image Analytics</h3>
                  <p className="text-sm md:text-base text-center text-gray-600 opacity-60">
                    Our solutions support object detection, visual recognition, and information extraction from images,
                    helping clients instantly access quality data. Leveraging cutting-edge computer vision technology, it
                    continues to open new opportunities in service and operations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section id="features" className="py-16">
          <div className="container mx-auto px-4 md:px-20 lg:px-60">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Why Choose Us?</h2>
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2 mb-4 md:mb-2 text-center">
              <div className="bg-pink-100 rounded-lg p-4 md:p-6 transition-shadow duration-300 hover:shadow-[0_2px_12px_0_rgba(236,72,153,0.3)]">
                <h3 className="text-base md:text-lg font-bold mb-2">Cutting-Edge AI Solutions</h3>
                <p className="text-xs md:text-sm text-gray-700">State-of-the-art solutions for image, text, and audio analytics.</p>
              </div>

              <div className="bg-orange-100 rounded-lg p-4 md:p-6 transition-shadow duration-300 hover:shadow-[0_2px_12px_0_rgba(251,146,60,0.3)]">
                <h3 className="text-base md:text-lg font-bold mb-2">Data Insight Expertise</h3>
                <p className="text-xs md:text-sm text-gray-700">
                  Specialized in extracting actionable insights from complex data patterns, sentiments, and trends.
                </p>
              </div>

              <div className="bg-blue-300 rounded-lg p-4 md:p-6 transition-shadow duration-300 hover:shadow-[0_2px_12px_0_rgba(59,130,246,0.3)]">
                <h3 className="text-base md:text-lg font-bold mb-2">Informed Decision-Making</h3>
                <p className="text-xs md:text-sm text-gray-700">
                  Empower businesses with data-driven insights for strategic decisions.
                </p>
              </div>
            </div>
            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-2 mb-4 md:mb-2 text-center">
              <div className="bg-blue-100 rounded-lg p-4 md:p-6 transition-shadow duration-300 hover:shadow-[0_2px_12px_0_rgba(147,197,253,0.3)]">
                <h3 className="text-base md:text-lg font-bold mb-2">Competitive Edge</h3>
                <p className="text-xs md:text-sm text-gray-700">
                  Stay ahead in the market by leveraging VocaB.AI's innovative and transformative capabilities.
                </p>
              </div>

              <div className="bg-blue-100 rounded-lg p-4 md:p-6 transition-shadow duration-300 hover:shadow-[0_2px_12px_0_rgba(147,197,253,0.3)]">
                <h3 className="text-base md:text-lg font-bold mb-2">Comprehensive Analytics Suite</h3>
                <p className="text-xs md:text-sm text-gray-700">
                  A wide range of tools for analyzing multiple data formats, providing a holistic view of business
                  operations.
                </p>
              </div>
            </div>
            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2 text-center">
              <div className="bg-green-100 rounded-lg p-4 md:p-6 transition-shadow duration-300 hover:shadow-[0_2px_12px_0_rgba(34,197,94,0.3)]">
                <h3 className="text-base md:text-lg font-bold mb-2">Seasoned AI Professionals</h3>
                <p className="text-xs md:text-sm text-gray-700">
                  A team of experienced experts dedicated to delivering high-quality results.
                </p>
              </div>

              <div className="bg-orange-100 rounded-lg p-4 md:p-6 transition-shadow duration-300 hover:shadow-[0_2px_12px_0_rgba(251,146,60,0.3)]">
                <h3 className="text-base md:text-lg font-bold mb-2">Enhanced Operational Efficiency</h3>
                <p className="text-xs md:text-sm text-gray-700">
                  Boost productivity and innovation processes through intelligent analytics.
                </p>
              </div>
              <div className="bg-purple-100 rounded-lg p-4 md:p-6 transition-shadow duration-300 hover:shadow-[0_2px_12px_0_rgba(192,132,252,0.3)]">
                <h3 className="text-base md:text-lg font-bold mb-2">Tailored Solutions</h3>
                <p className="text-xs md:text-sm text-gray-700">
                  Customizable solution solutions designed to address unique business challenges.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Meet Our Team */}
        <section id="team" className="py-6">
          <div className="container mx-auto px-4 md:px-20">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Meet Our Team</h2>
            <TeamCarousel />
          </div>
        </section>
        
        {/* Gallery */}
        <section id="gallery" className="py-4">
          <div className="container mx-auto px-4 md:px-20">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Gallery</h2>
            <GalleryCarousel />
          </div>
        </section>

        {/* Contact Us */}
        <section id="contact" className="py-16 bg-gray-900 text-white">
          <div className="container mx-auto px-4 md:px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Contact Us</h2>

                <div className="flex items-start mb-4">
                  <div className="mr-4 text-blue-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <p className="text-sm">
                    VocaB.AI Private Limited, #123, 3rd Floor Whitefield Industrial Estate, Kadugodi Main Road,
                    Kundalahalli Post, Bengaluru - 560066
                  </p>
                </div>

                <div className="flex items-center mb-4">
                  <div className="mr-4 text-blue-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <p className="text-sm">+1 234 567 1234</p>
                </div>

                <div className="flex items-center mb-8">
                  <div className="mr-4 text-blue-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <p className="text-sm">contact@vocabai.com, help@vocabai.ai</p>
                </div>

                <div className="flex space-x-4">
                  <a href="#" className="text-white hover:text-blue-400 transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-white hover:text-blue-400 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-white hover:text-blue-400 transition-colors">
                    <Youtube className="h-5 w-5" />
                  </a>
                </div>
              </div>

              <div className="bg-white text-black p-4 md:p-6 rounded-lg">
                <p className="text-sm text-gray-700 mb-4">
                  Please fill out the form below to send us an email. We will get back to you as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="sr-only">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name"
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="sr-only">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Message"
                      required
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>

                  {formStatus.error && (
                    <p className="text-red-500 text-sm">{formStatus.error}</p>
                  )}

                  {formStatus.success && (
                    <p className="text-green-500 text-sm">Message sent successfully!</p>
                  )}

                  <button
                    type="submit"
                    disabled={formStatus.loading}
                    className={`w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium transition-colors ${
                      formStatus.loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                    }`}
                  >
                    {formStatus.loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-4 bg-gray-900 text-white text-center text-sm">
          <div className="container mx-auto px-4 md:px-20">
            <p>© VocaB.AI</p>
          </div>
        </footer>
      </div>
    </main>
  )
}

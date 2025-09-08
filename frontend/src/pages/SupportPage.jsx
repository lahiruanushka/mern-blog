import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  MessageCircle, 
  Shield, 
  Flag,
  Search,
  BookOpen,
  Mail,
  Phone,
  Clock,
  Users,
  AlertTriangle,
  FileText,
  CheckCircle,
  Send,
  Star,
  ThumbsUp,
  Eye,
  Heart,
  Share2,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  Zap,
  Globe,
  Lock
} from 'lucide-react';

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState('help-center');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [reportForm, setReportForm] = useState({
    contentUrl: '',
    reportType: 'spam',
    description: ''
  });

  const tabs = [
    {
      id: 'help-center',
      label: 'Help Center',
      icon: HelpCircle,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'contact',
      label: 'Contact Us',
      icon: MessageCircle,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'guidelines',
      label: 'Community Guidelines',
      icon: Shield,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'report',
      label: 'Report Content',
      icon: Flag,
      color: 'from-red-500 to-orange-500'
    }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    // Handle form submission
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    console.log('Report form submitted:', reportForm);
    // Handle report submission
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const contentVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 px-6 py-12">
        {/* Header */}
        <div className="max-w-6xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full mb-8"
          >
            <HelpCircle className="w-5 h-5 text-blue-400 mr-3" />
            <span className="text-blue-200 font-bold tracking-wide uppercase">Support Center</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl md:text-7xl font-black text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text mb-6 tracking-tight"
          >
            We're Here to Help
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Find answers to your questions, get in touch with our team, or learn about our community standards. We're committed to providing you with the best possible experience.
          </motion.p>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl" />
            <div className="relative bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-2">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-6 rounded-2xl transition-all duration-300 overflow-hidden ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r ' + tab.color + ' text-white shadow-2xl'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      <div className="relative z-10 flex flex-col items-center text-center">
                        <IconComponent className={`w-8 h-8 mb-3 ${activeTab === tab.id ? 'text-white' : ''}`} />
                        <span className="font-bold text-sm lg:text-base">{tab.label}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="initial"
              animate="in"
              exit="out"
              variants={contentVariants}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {activeTab === 'help-center' && <HelpCenterContent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
              {activeTab === 'contact' && <ContactContent form={contactForm} setForm={setContactForm} onSubmit={handleContactSubmit} />}
              {activeTab === 'guidelines' && <GuidelinesContent />}
              {activeTab === 'report' && <ReportContent form={reportForm} setForm={setReportForm} onSubmit={handleReportSubmit} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// Help Center Content Component
const HelpCenterContent = ({ searchQuery, setSearchQuery }) => {
  const faqs = [
    {
      category: 'Getting Started',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-500',
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'Click on the "Sign Up" button in the top right corner and fill out the registration form with your details.'
        },
        {
          question: 'How do I write my first blog post?',
          answer: 'After logging in, click on "Write" in the navigation menu and use our intuitive editor to craft your story.'
        },
        {
          question: 'Can I customize my profile?',
          answer: 'Yes! Go to your profile settings to upload a profile picture, write a bio, and customize your public information.'
        }
      ]
    },
    {
      category: 'Publishing & Content',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-500',
      questions: [
        {
          question: 'How do I add images to my posts?',
          answer: 'Use the image upload button in the editor toolbar or drag and drop images directly into your post.'
        },
        {
          question: 'Can I schedule posts for later?',
          answer: 'Yes, you can schedule posts using the publish options. Select a future date and time for automatic publishing.'
        },
        {
          question: 'How do I make my posts discoverable?',
          answer: 'Use relevant tags, write compelling titles, and engage with the community to increase visibility.'
        }
      ]
    },
    {
      category: 'Community & Engagement',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      questions: [
        {
          question: 'How do comments work?',
          answer: 'Readers can comment on your posts, and you can reply to create discussions. You can moderate comments on your own posts.'
        },
        {
          question: 'Can I follow other writers?',
          answer: 'Yes! Follow writers you enjoy to see their latest posts in your personalized feed.'
        },
        {
          question: 'How do I report inappropriate content?',
          answer: 'Use the report button on any post or comment, or visit the Report Content section in our Support Center.'
        }
      ]
    }
  ];

  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl" />
        <div className="relative bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/10 p-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help topics, FAQs, and guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-8">
        {faqs.map((section, sectionIndex) => {
          const IconComponent = section.icon;
          return (
            <motion.div
              key={sectionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1, duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-3xl blur-xl" />
              <div className="relative bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-8">
                <div className="flex items-center mb-6">
                  <div className={`p-3 bg-gradient-to-r ${section.color} rounded-2xl mr-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{section.category}</h3>
                </div>

                <div className="space-y-4">
                  {section.questions.map((faq, faqIndex) => {
                    const isExpanded = expandedFaq === `${sectionIndex}-${faqIndex}`;
                    return (
                      <motion.div
                        key={faqIndex}
                        className="bg-white/10 rounded-2xl overflow-hidden border border-white/10"
                      >
                        <button
                          onClick={() => setExpandedFaq(isExpanded ? null : `${sectionIndex}-${faqIndex}`)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-all duration-300"
                        >
                          <span className="text-lg font-semibold text-white pr-4">{faq.question}</span>
                          <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6 text-gray-300 leading-relaxed border-t border-white/10">
                                <div className="pt-4">{faq.answer}</div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl" />
        <div className="relative bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Quick Links</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: FileText, label: 'Documentation', desc: 'Complete guides and tutorials', color: 'from-blue-500 to-cyan-500' },
              { icon: Globe, label: 'API Reference', desc: 'Technical documentation for developers', color: 'from-green-500 to-emerald-500' },
              { icon: MessageSquare, label: 'Community Forum', desc: 'Connect with other users', color: 'from-purple-500 to-pink-500' }
            ].map((link, index) => {
              const IconComponent = link.icon;
              return (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="block p-6 bg-white/10 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <div className={`p-3 bg-gradient-to-r ${link.color} rounded-2xl mb-4 w-fit`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {link.label}
                  </h4>
                  <p className="text-gray-400 text-sm">{link.desc}</p>
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Contact Content Component
const ContactContent = ({ form, setForm, onSubmit }) => {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      contact: 'support@blogsite.com',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team now',
      contact: 'Available 9 AM - 6 PM EST',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our team',
      contact: '+1 (555) 123-4567',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Contact Methods */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {contactMethods.map((method, index) => {
          const IconComponent = method.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 group-hover:border-white/20 p-8 transition-all duration-300">
                <div className={`p-4 bg-gradient-to-r ${method.color} rounded-2xl mb-6 w-fit mx-auto`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">{method.title}</h3>
                <p className="text-gray-300 text-center mb-4">{method.description}</p>
                <p className="text-center font-semibold text-blue-300">{method.contact}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Contact Form */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl" />
        <div className="relative bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-8">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">Send us a Message</h3>
          
          <form onSubmit={onSubmit} className="max-w-2xl mx-auto space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({...form, category: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="general" className="bg-gray-800">General Question</option>
                <option value="technical" className="bg-gray-800">Technical Issue</option>
                <option value="billing" className="bg-gray-800">Billing & Payments</option>
                <option value="feature" className="bg-gray-800">Feature Request</option>
                <option value="bug" className="bg-gray-800">Bug Report</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Subject</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({...form, subject: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Brief description of your inquiry"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Message</label>
              <textarea
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm({...form, message: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Please provide as much detail as possible..."
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center gap-3"
            >
              <Send className="w-5 h-5" />
              Send Message
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Community Guidelines Content Component
const GuidelinesContent = () => {
  const guidelines = [
    {
      icon: Heart,
      title: 'Be Respectful',
      color: 'from-red-500 to-pink-500',
      rules: [
        'Treat all community members with kindness and respect',
        'Avoid personal attacks, harassment, or discriminatory language',
        'Respect different opinions and engage in constructive discussions',
        'Use inclusive language that welcomes all community members'
      ]
    },
    {
      icon: CheckCircle,
      title: 'Create Quality Content',
      color: 'from-green-500 to-emerald-500',
      rules: [
        'Write original, well-researched, and engaging content',
        'Properly cite sources and give credit where due',
        'Use clear, readable formatting and structure',
        'Avoid duplicate or low-effort posts'
      ]
    },
    {
      icon: Lock,
      title: 'Privacy & Safety',
      color: 'from-blue-500 to-indigo-500',
      rules: [
        'Do not share personal information of others without consent',
        'Respect privacy and confidentiality',
        'Report suspicious or harmful behavior',
        'Keep personal data secure and private'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Prohibited Content',
      color: 'from-orange-500 to-red-500',
      rules: [
        'No spam, self-promotion, or misleading content',
        'No hate speech, violence, or illegal activities',
        'No copyright infringement or plagiarism',
        'No explicit or inappropriate content'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl" />
        <div className="relative bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-8 text-center">
          <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl w-fit mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Our Community Standards</h2>
          <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
            These guidelines help us maintain a positive, inclusive, and productive environment for all community members. 
            By participating in our platform, you agree to follow these standards.
          </p>
        </div>
      </div>

      {/* Guidelines Sections */}
      <div className="space-y-8">
        {guidelines.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-3xl blur-xl" />
              <div className="relative bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-8">
                <div className="flex items-center mb-6">
                  <div className={`p-3 bg-gradient-to-r ${section.color} rounded-2xl mr-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{section.title}</h3>
                </div>

                <div className="grid gap-4">
                  {section.rules.map((rule, ruleIndex) => (
                    <div key={ruleIndex} className="flex items-start space-x-4 p-4 bg-white/10 rounded-2xl border border-white/10">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-300 leading-relaxed">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Enforcement */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-xl" />
        <div className="relative bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-3 text-orange-400" />
            Enforcement & Consequences
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Warning System</h4>
              <p className="text-gray-300">
                We operate on a three-strike warning system for violations of our community guidelines. Each violation is reviewed by our moderation team.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">1st violation: Warning and content removal</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">2nd violation: Temporary suspension (7 days)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">3rd violation: Permanent account termination</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Severe Violations</h4>
              <p className="text-gray-300">
                Severe violations, including hate speech, harassment, or illegal content, may result in immediate account termination without prior warning.
              </p>
              <div className="p-4 bg-red-900/30 border border-red-500/30 rounded-xl">
                <h5 className="font-semibold text-red-300 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Zero Tolerance
                </h5>
                <p className="text-sm text-red-200">
                  We have a zero-tolerance policy for threats, harassment, or any form of discrimination. Such violations will result in immediate and permanent bans.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <h4 className="text-lg font-semibold text-white mb-4">Appeals Process</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h5 className="font-medium text-white">Submitting an Appeal</h5>
                <p className="text-gray-300">
                  If you believe your content was removed or your account was suspended in error, you may submit an appeal through our contact form.
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    Include your username and relevant details
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    Explain why you believe the action was in error
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    We typically respond within 3-5 business days
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="font-medium text-white">What to Expect</h5>
                <p className="text-gray-300">
                  Our team will review your appeal and the original content or violation. We may request additional information if needed.
                </p>
                <div className="p-4 bg-blue-900/30 border border-blue-500/30 rounded-xl">
                  <h6 className="font-medium text-blue-300 mb-2">Note</h6>
                  <p className="text-sm text-blue-200">
                    Submitting multiple appeals for the same issue will not result in a faster response. Please be patient while we review your case.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Report Content Component
const ReportContent = ({ form, setForm, onSubmit }) => {
  const reportTypes = [
    { value: 'spam', label: 'Spam or Scam', description: 'Unsolicited promotion or fraudulent content' },
    { value: 'harassment', label: 'Harassment or Bullying', description: 'Targeted harassment or threats' },
    { value: 'hate_speech', label: 'Hate Speech', description: 'Content that promotes violence or hatred' },
    { value: 'explicit', label: 'Explicit Content', description: 'Adult or NSFW content' },
    { value: 'copyright', label: 'Copyright Infringement', description: 'Unauthorized use of copyrighted material' },
    { value: 'other', label: 'Other', description: 'Something else that violates our policies' },
  ];

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-xl" />
        <div className="relative bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl w-fit mx-auto mb-6">
              <Flag className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Report Inappropriate Content</h2>
            <p className="text-gray-300 text-lg">
              Help us keep our community safe by reporting content that violates our community guidelines.
              All reports are confidential and will be reviewed by our moderation team.
            </p>
          </div>
        </div>
      </div>

      {/* Report Form */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-xl" />
        <div className="relative bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">URL of the content</label>
              <input
                type="url"
                required
                value={form.contentUrl}
                onChange={(e) => setForm({...form, contentUrl: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                placeholder="https://example.com/posts/123"
              />
              <p className="mt-1 text-sm text-gray-400">
                Please provide the direct link to the content you're reporting
              </p>
            </div>

            <div>
              <label className="block text-white font-semibold mb-3">Type of Report</label>
              <div className="grid gap-3">
                {reportTypes.map((type) => (
                  <label 
                    key={type.value}
                    className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${form.reportType === type.value ? 'border-red-500 bg-red-900/20' : 'border-white/10 hover:border-white/20'}`}
                  >
                    <input
                      type="radio"
                      name="reportType"
                      value={type.value}
                      checked={form.reportType === type.value}
                      onChange={() => setForm({...form, reportType: type.value})}
                      className="mt-1 text-red-500 focus:ring-red-500"
                    />
                    <div className="ml-3">
                      <span className="block font-medium text-white">{type.label}</span>
                      <span className="block text-sm text-gray-400 mt-1">{type.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Additional Details
                <span className="text-gray-400 text-sm font-normal ml-2">(Optional but helpful)</span>
              </label>
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Please provide any additional details about your report..."
              />
              <p className="mt-1 text-sm text-gray-400">
                The more details you can provide, the better we can address your report.
              </p>
            </div>

            <div className="pt-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="confirmation"
                    name="confirmation"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-red-500 border-white/20 rounded focus:ring-red-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="confirmation" className="text-gray-300">
                    I confirm that this report is accurate and submitted in good faith.
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:shadow-red-500/25"
              >
                Submit Report
              </motion.button>
              <p className="mt-3 text-center text-sm text-gray-400">
                We take all reports seriously. False reports may result in account restrictions.
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* What Happens Next */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-3xl blur-xl" />
        <div className="relative bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-8">
          <h3 className="text-2xl font-bold text-white mb-6">What Happens Next?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Eye,
                title: 'Review Process',
                description: 'Our moderation team will review your report and take appropriate action if necessary.'
              },
              {
                icon: MessageCircle,
                title: 'Confirmation',
                description: 'You may receive a confirmation email once your report has been processed.'
              },
              {
                icon: Lock,
                title: 'Confidentiality',
                description: 'Your report is confidential. The reported user won\'t know who reported them.'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="p-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl w-fit mb-4">
                    <Icon className="w-6 h-6 text-red-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
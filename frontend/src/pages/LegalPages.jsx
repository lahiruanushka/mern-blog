import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  FileText,
  Cookie,
  Calendar,
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Globe,
  Lock,
  Eye,
  Settings,
  Users,
  Database,
  Smartphone,
  Server,
  ExternalLink,
  Home,
  ArrowLeft,
  Scale,
} from "lucide-react";

const LegalPages = () => {
  const [activeTab, setActiveTab] = useState("privacy");
  const [lastUpdated] = useState("March 15, 2024");

  // Get initial tab from URL params if available
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get("tab");
    if (tab && ["privacy", "terms", "cookies"].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  // Update URL when tab changes
  useEffect(() => {
    const url = new URL(window.location);
    url.searchParams.set("tab", activeTab);
    window.history.replaceState({}, "", url);
  }, [activeTab]);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  // Tab configuration
  const tabs = [
    {
      id: "privacy",
      label: "Privacy Policy",
      icon: Shield,
      color: "blue",
      description: "How we collect, use, and protect your data",
    },
    {
      id: "terms",
      label: "Terms of Service",
      icon: FileText,
      color: "purple",
      description: "Rules and guidelines for using our platform",
    },
    {
      id: "cookies",
      label: "Cookie Policy",
      icon: Cookie,
      color: "orange",
      description: "Information about cookies and tracking",
    },
  ];

  // Section component for consistent styling
  const Section = ({ title, children, icon: Icon, variant = "default" }) => (
    <motion.div
      variants={itemVariants}
      className={`mb-8 p-6 rounded-2xl border ${
        variant === "warning"
          ? "bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800/30"
          : variant === "info"
          ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30"
          : "bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <Icon
            className={`w-6 h-6 ${
              variant === "warning"
                ? "text-yellow-600 dark:text-yellow-400"
                : variant === "info"
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-600 dark:text-slate-400"
            }`}
          />
        )}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
      </div>
      <div className="text-slate-600 dark:text-slate-300 leading-relaxed">
        {children}
      </div>
    </motion.div>
  );

  // List component
  const List = ({ items, ordered = false }) => (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          <div
            className={`mt-2 w-2 h-2 rounded-full flex-shrink-0 ${
              ordered ? "bg-blue-500" : "bg-slate-400"
            }`}
          ></div>
          <div className="flex-1">
            {typeof item === "string" ? (
              <p>{item}</p>
            ) : (
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                  {item.title}
                </h4>
                <p className="text-sm">{item.description}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Privacy Policy Content
  const PrivacyContent = () => (
    <motion.div
      key="privacy"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Privacy Policy
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          At YourBlog, we take your privacy seriously. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information
          when you visit our website and use our services. Please read this
          privacy policy carefully.
        </p>
      </div>

      <Section title="Information We Collect" icon={Database}>
        <p className="mb-4">
          We collect information you provide directly to us, information we
          obtain automatically when you use our services, and information from
          third-party sources.
        </p>
        <List
          items={[
            {
              title: "Personal Information",
              description:
                "Name, email address, username, profile information, and account preferences you provide when creating an account or using our services.",
            },
            {
              title: "Content Information",
              description:
                "Blog posts, comments, messages, and other content you create, upload, or share on our platform.",
            },
            {
              title: "Usage Information",
              description:
                "How you interact with our platform, including pages visited, features used, time spent on pages, and navigation patterns.",
            },
            {
              title: "Device Information",
              description:
                "Browser type, operating system, IP address, device identifiers, and technical information about your device and internet connection.",
            },
            {
              title: "Location Information",
              description:
                "General location information based on your IP address and any location data you choose to share.",
            },
            {
              title: "Communication Data",
              description:
                "Messages, comments, feedback, and other communications you send to us or share on our platform.",
            },
          ]}
        />
      </Section>

      <Section title="How We Use Your Information" icon={Settings}>
        <p className="mb-4">
          We use the information we collect to provide, maintain, and improve
          our services in the following ways:
        </p>
        <List
          items={[
            "Provide and deliver the services and features you request",
            "Create and manage your user account and profile",
            "Process transactions and send related information and confirmations",
            "Send technical notices, updates, security alerts, and support messages",
            "Respond to your comments, questions, and customer service requests",
            "Monitor and analyze trends, usage patterns, and activities on our platform",
            "Personalize and improve the services and your user experience",
            "Provide personalized content recommendations and suggestions",
            "Facilitate contests, sweepstakes, promotions, and special offers",
            "Detect, investigate, and prevent fraudulent transactions and unauthorized access",
            "Comply with legal obligations and enforce our terms of service",
          ]}
        />
      </Section>

      <Section title="Information Sharing and Disclosure" icon={Users}>
        <p className="mb-4">
          We do not sell, trade, or rent your personal information to third
          parties. We may share personal information only in the following
          limited circumstances:
        </p>
        <List
          items={[
            {
              title: "With Your Explicit Consent",
              description:
                "We may share your information when you give us explicit, informed consent to do so.",
            },
            {
              title: "Service Providers and Business Partners",
              description:
                "Trusted third-party companies that provide services on our behalf, such as hosting, analytics, payment processing, and customer support.",
            },
            {
              title: "Business Transfers",
              description:
                "In connection with mergers, acquisitions, asset sales, or other business transactions where user information may be transferred.",
            },
            {
              title: "Legal Requirements and Safety",
              description:
                "When required by law, legal process, or to protect the rights, property, and safety of our users and the public.",
            },
            {
              title: "Public Content",
              description:
                "Content you choose to make public (such as blog posts and comments) may be visible to other users and search engines.",
            },
            {
              title: "Aggregated and De-identified Data",
              description:
                "We may share aggregated, anonymized, or de-identified information that cannot reasonably be used to identify you.",
            },
          ]}
        />
      </Section>

      <Section title="Data Security and Protection" icon={Lock} variant="info">
        <p className="mb-4">
          We implement appropriate technical and organizational security
          measures to protect your personal information:
        </p>
        <List
          items={[
            "Industry-standard encryption of data in transit and at rest using SSL/TLS protocols",
            "Regular security assessments, vulnerability testing, and system updates",
            "Multi-factor authentication and robust access controls for our systems",
            "Employee training on data protection practices and privacy principles",
            "Comprehensive incident response procedures for security breaches",
            "Regular backups and disaster recovery procedures to ensure data availability",
            "Physical security measures for our servers and data centers",
            "Privacy by design principles in our product development process",
          ]}
        />
        <p className="mt-4 p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-sm">
          <strong>Important:</strong> While we use industry-standard security
          measures, no method of transmission over the internet or electronic
          storage is 100% secure. We cannot guarantee absolute security but are
          committed to protecting your information to the best of our ability.
        </p>
      </Section>

      <Section title="Your Privacy Rights and Choices" icon={Eye}>
        <p className="mb-4">
          Depending on your location, you may have certain rights regarding your
          personal information. These may include:
        </p>
        <List
          items={[
            {
              title: "Access and Portability",
              description:
                "Request access to your personal information and receive a copy in a portable format.",
            },
            {
              title: "Correction and Updates",
              description:
                "Update, correct, or complete your personal information through your account settings or by contacting us.",
            },
            {
              title: "Deletion and Right to be Forgotten",
              description:
                "Request deletion of your personal information, subject to certain legal exceptions.",
            },
            {
              title: "Objection and Restriction",
              description:
                "Object to or restrict certain types of processing of your personal information.",
            },
            {
              title: "Withdrawal of Consent",
              description:
                "Withdraw previously given consent for data processing where consent is the legal basis.",
            },
            {
              title: "Communication Preferences",
              description:
                "Opt-out of marketing communications and promotional emails at any time.",
            },
          ]}
        />
        <p className="mt-4 p-4 bg-green-100 dark:bg-green-900/20 rounded-lg text-sm">
          <strong>How to Exercise Your Rights:</strong> To exercise any of these
          rights, please contact us at privacy@yourblog.com or use the settings
          in your account dashboard. We will respond to your request within 30
          days.
        </p>
      </Section>

      <Section title="Data Retention" icon={Clock}>
        <p className="mb-4">
          We retain your personal information only for as long as necessary to
          fulfill the purposes outlined in this privacy policy, unless a longer
          retention period is required by law:
        </p>
        <List
          items={[
            "Account information: Retained while your account is active and for 2 years after account deletion",
            "Content and posts: Retained while publicly available or until you delete them",
            "Usage and analytics data: Typically retained for 2-3 years for analysis and improvement purposes",
            "Communication records: Retained for 3 years for customer service and legal purposes",
            "Payment information: Retained as required by financial regulations and tax laws",
            "Legal hold data: Retained as required by applicable laws and legal proceedings",
          ]}
        />
      </Section>

      <Section title="International Data Transfers" icon={Globe}>
        <p className="mb-4">
          Your information may be transferred to and processed in countries
          other than your own. We ensure appropriate safeguards are in place:
        </p>
        <List
          items={[
            "Data Processing Agreements with third-party processors in compliance with applicable laws",
            "Standard Contractual Clauses approved by regulatory authorities",
            "Adequacy decisions for transfers to countries with adequate data protection laws",
            "Your explicit consent for transfers where other safeguards are not available",
          ]}
        />
      </Section>

      <Section
        title="Children's Privacy"
        icon={AlertTriangle}
        variant="warning"
      >
        <p className="mb-4">
          Our services are not intended for children under 13 years of age (or
          16 in some jurisdictions):
        </p>
        <List
          items={[
            "We do not knowingly collect personal information from children under the applicable age",
            "If we learn that we have collected information from a child under the applicable age, we will delete that information promptly",
            "Parents or guardians who believe their child has provided us with information should contact us immediately",
            "We may require additional verification for accounts that appear to belong to minors",
          ]}
        />
      </Section>

      <Section title="Changes to This Privacy Policy" icon={FileText}>
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in our practices, technology, legal requirements, or other factors.
          When we make material changes, we will:
        </p>
        <List
          items={[
            "Update the 'Last Updated' date at the top of this policy",
            "Notify you via email if you have an account with us",
            "Post a prominent notice on our website",
            "For significant changes, provide additional notice as required by law",
          ]}
        />
        <p className="mt-4">
          Your continued use of our services after the effective date of any
          changes constitutes your acceptance of the revised Privacy Policy.
        </p>
      </Section>
    </motion.div>
  );

  // Terms of Service Content
  const TermsContent = () => (
    <motion.div
      key="terms"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Terms of Service
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Welcome to YourBlog. These Terms of Service govern your use of our
          website and services. By accessing or using our platform, you agree to
          be bound by these terms. Please read them carefully.
        </p>
      </div>

      <Section title="Acceptance of Terms" icon={CheckCircle}>
        <p className="mb-4">
          By accessing and using our platform, you accept and agree to be bound
          by these Terms of Service and our Privacy Policy. These terms apply to
          all users, including visitors, registered users, and contributors.
        </p>
        <List
          items={[
            "You must be at least 13 years old (or the minimum age in your jurisdiction) to use our services",
            "If you are using our services on behalf of an organization, you represent that you have authority to bind that organization",
            "You agree to use our services in accordance with all applicable laws and regulations",
            "If you do not agree to these terms, please do not use our services",
          ]}
        />
      </Section>

      <Section title="Description of Service" icon={Globe}>
        <p className="mb-4">
          YourBlog is a content management and blogging platform that provides
          users with tools to create, publish, and discover content. Our
          services include:
        </p>
        <List
          items={[
            "Content creation and publishing tools with rich text editing capabilities",
            "User authentication, profile management, and customization options",
            "Comment and interaction features to engage with other users and content",
            "Content discovery, search, and recommendation features",
            "Analytics and reporting tools for content creators",
            "Social sharing and integration features",
            "Mobile applications and responsive web interface",
            "API access for developers (where applicable)",
          ]}
        />
      </Section>

      <Section title="User Accounts and Registration" icon={Users}>
        <p className="mb-4">
          To access certain features of our platform, you must create a user
          account. When creating and maintaining your account:
        </p>
        <List
          items={[
            "Provide accurate, current, and complete registration information",
            "Maintain and promptly update your account information to keep it accurate",
            "Maintain the security and confidentiality of your account credentials",
            "Accept responsibility for all activities that occur under your account",
            "Notify us immediately of any unauthorized use of your account",
            "You may have only one account unless we expressly permit otherwise",
            "We reserve the right to refuse service or terminate accounts at our discretion",
          ]}
        />
      </Section>

      <Section title="Acceptable Use Policy" icon={Shield} variant="warning">
        <p className="mb-4">
          You agree to use our platform responsibly and not engage in any
          prohibited activities. You may not use our services to:
        </p>
        <List
          items={[
            "Post content that is illegal, harmful, threatening, abusive, defamatory, or discriminatory",
            "Infringe on intellectual property rights, copyrights, trademarks, or other proprietary rights",
            "Transmit viruses, malware, spam, or other malicious or harmful code",
            "Attempt to gain unauthorized access to our systems, servers, or user accounts",
            "Engage in harassment, bullying, stalking, or intimidation of other users",
            "Impersonate any person, entity, or misrepresent your affiliation with any person or entity",
            "Collect, harvest, or scrape user information without explicit consent",
            "Use our services for any commercial purpose without our written permission",
            "Violate any applicable laws, regulations, or third-party rights",
            "Interfere with or disrupt the integrity or performance of our services",
          ]}
        />
      </Section>

      <Section title="Content Ownership and Licensing" icon={FileText}>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
              Your Content
            </h4>
            <p className="mb-3">
              You retain ownership of all content you create and post on our
              platform. However, by posting content, you grant us certain
              rights:
            </p>
            <List
              items={[
                "A worldwide, non-exclusive, royalty-free license to use, copy, modify, distribute, and display your content",
                "The right to use your content in connection with operating and promoting our services",
                "Permission to make your content available to other users as intended by the platform features",
                "The ability to remove or disable access to your content if it violates these terms",
              ]}
            />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
              Our Content and Platform
            </h4>
            <p className="mb-3">
              All platform content, features, functionality, and intellectual
              property are owned by us and protected by law:
            </p>
            <List
              items={[
                "Our website design, logos, trademarks, and branding materials",
                "Software, algorithms, and technical infrastructure",
                "Curated content, recommendations, and editorial selections",
                "Documentation, guides, and help materials",
              ]}
            />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
              Third-Party Content
            </h4>
            <p>
              Our platform may include content from third parties. We do not
              endorse or assume responsibility for third-party content, and such
              content is subject to the respective third party's terms and
              conditions.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Privacy and Data Protection" icon={Lock}>
        <p className="mb-4">
          Your privacy is important to us. Our Privacy Policy explains in detail
          how we collect, use, and protect your information:
        </p>
        <List
          items={[
            "We collect only the information necessary to provide and improve our services",
            "We use industry-standard security measures to protect your data",
            "We do not sell your personal information to third parties",
            "You have control over your privacy settings and data sharing preferences",
            "We comply with applicable data protection laws including GDPR and CCPA where applicable",
          ]}
        />
        <p className="mt-4">
          By using our services, you agree to the collection and use of
          information in accordance with our Privacy Policy.
        </p>
      </Section>

      <Section
        title="Prohibited Content and Conduct"
        icon={AlertTriangle}
        variant="warning"
      >
        <p className="mb-4">
          The following types of content and conduct are strictly prohibited on
          our platform:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium text-slate-900 dark:text-white mb-2">
              Prohibited Content:
            </h5>
            <List
              items={[
                "Hate speech or discriminatory content",
                "Explicit sexual or adult content",
                "Violence, threats, or dangerous activities",
                "Spam, scams, or fraudulent content",
                "Copyrighted material without permission",
                "Personal information of others without consent",
              ]}
            />
          </div>
          <div>
            <h5 className="font-medium text-slate-900 dark:text-white mb-2">
              Prohibited Conduct:
            </h5>
            <List
              items={[
                "Creating fake accounts or impersonation",
                "Automated posting or bot activity",
                "Buying or selling accounts",
                "Coordinated harassment campaigns",
                "Attempting to manipulate platform features",
                "Circumventing our security measures",
              ]}
            />
          </div>
        </div>
      </Section>

      <Section
        title="Disclaimers and Limitation of Liability"
        icon={Info}
        variant="info"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
              Service Availability
            </h4>
            <p>
              We strive to maintain high service availability but cannot
              guarantee uninterrupted access. Our services may be temporarily
              unavailable due to maintenance, updates, technical issues, or
              circumstances beyond our control.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
              Content Disclaimer
            </h4>
            <p>
              User-generated content on our platform represents the views and
              opinions of the individual authors, not necessarily our views. We
              do not endorse, guarantee, or assume responsibility for the
              accuracy or reliability of user-generated content.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
              Limitation of Liability
            </h4>
            <p>
              To the maximum extent permitted by law, we shall not be liable for
              any indirect, incidental, special, consequential, or punitive
              damages, including but not limited to loss of profits, data, or
              other intangible losses resulting from your use of our services.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Account Termination and Suspension" icon={ExternalLink}>
        <p className="mb-4">
          We reserve the right to terminate or suspend accounts and access to
          our services under the following circumstances:
        </p>
        <List
          items={[
            {
              title: "Immediate Termination",
              description:
                "For material violations of these terms, illegal activity, or behavior that poses a risk to our users or services",
            },
            {
              title: "Suspension with Warning",
              description:
                "For minor violations or first-time offenses, we may issue warnings and temporary suspensions",
            },
            {
              title: "Account Inactivity",
              description:
                "Accounts inactive for extended periods may be suspended or terminated with reasonable notice",
            },
            {
              title: "Business Decisions",
              description:
                "We may discontinue services or terminate accounts for business reasons with reasonable notice",
            },
            {
              title: "User-Initiated Termination",
              description:
                "You may terminate your account at any time through your account settings or by contacting us",
            },
          ]}
        />
      </Section>

      <Section title="Changes to Terms of Service" icon={Clock}>
        <p className="mb-4">
          We may modify these Terms of Service from time to time. When we make
          changes:
        </p>
        <List
          items={[
            "We will update the 'Last Updated' date at the top of these terms",
            "For material changes, we will provide notice via email or prominent website notice",
            "Changes will take effect 30 days after notice is provided",
            "Your continued use of our services after changes take effect constitutes acceptance of the new terms",
            "If you do not agree to the modified terms, you should discontinue use of our services",
          ]}
        />
      </Section>

      <Section title="Governing Law and Dispute Resolution" icon={Scale}>
        <p className="mb-4">
          These Terms of Service are governed by and construed in accordance
          with the laws of [Your Jurisdiction]. For any disputes arising from
          these terms or your use of our services:
        </p>
        <List
          items={[
            "We encourage resolving disputes through direct communication with our support team",
            "Disputes that cannot be resolved informally may be subject to binding arbitration",
            "You retain the right to bring claims in small claims court for applicable matters",
            "Class action lawsuits and jury trials are waived to the extent permitted by law",
          ]}
        />
      </Section>
    </motion.div>
  );

  // Cookie Policy Content
  const CookiesContent = () => (
    <motion.div
      key="cookies"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Cookie Policy
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          This Cookie Policy explains how YourBlog uses cookies and similar
          tracking technologies when you visit our website. It describes what
          these technologies are, why we use them, and your rights to control
          their use.
        </p>
      </div>

      <Section title="What Are Cookies?" icon={Info}>
        <p className="mb-4">
          Cookies are small text files that are stored on your device (computer,
          tablet, or mobile) when you visit a website. They are widely used to
          make websites work more efficiently and provide information to website
          owners.
        </p>
        <List
          items={[
            {
              title: "First-Party Cookies",
              description:
                "Set directly by our website and can only be read by our site",
            },
            {
              title: "Third-Party Cookies",
              description:
                "Set by external services we use, such as analytics or advertising partners",
            },
            {
              title: "Session Cookies",
              description:
                "Temporary cookies that expire when you close your browser",
            },
            {
              title: "Persistent Cookies",
              description:
                "Remain on your device for a set period or until you delete them",
            },
          ]}
        />
      </Section>

      <Section title="Types of Cookies We Use" icon={Database}>
        <div className="space-y-6">
          <div className="p-4 bg-green-50/50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800/30">
            <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Essential Cookies (Always Active)
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300 mb-3">
              These cookies are necessary for basic website functionality and
              cannot be disabled.
            </p>
            <List
              items={[
                "User authentication and session management",
                "Security features and fraud prevention",
                "Load balancing and website performance",
                "Remembering your cookie preferences",
                "Shopping cart and checkout functionality (if applicable)",
              ]}
            />
          </div>

          <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800/30">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Performance and Analytics Cookies
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              Help us understand how visitors interact with our website by
              collecting anonymous information.
            </p>
            <List
              items={[
                "Google Analytics for website usage statistics",
                "Page load times and performance monitoring",
                "Error tracking and debugging information",
                "Popular content and user flow analysis",
                "A/B testing and feature optimization",
              ]}
            />
          </div>

          <div className="p-4 bg-purple-50/50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800/30">
            <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Functionality Cookies
            </h4>
            <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
              Remember your preferences and provide enhanced, personalized
              features.
            </p>
            <List
              items={[
                "Language and region preferences",
                "Theme settings (dark mode, font size)",
                "Personalized content recommendations",
                "Social media integration features",
                "Form data and user interface preferences",
              ]}
            />
          </div>

          <div className="p-4 bg-orange-50/50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800/30">
            <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Marketing and Advertising Cookies
            </h4>
            <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
              Track visitors across websites to display relevant and engaging
              advertisements.
            </p>
            <List
              items={[
                "Targeted advertising based on interests",
                "Retargeting campaigns for previous visitors",
                "Social media advertising pixels",
                "Affiliate marketing tracking",
                "Campaign effectiveness measurement",
              ]}
            />
          </div>
        </div>
      </Section>

      <Section title="How We Use Cookies" icon={Settings}>
        <p className="mb-4">
          We use cookies and similar technologies for various purposes to
          improve your experience:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-slate-900 dark:text-white mb-3">
              Core Functions:
            </h5>
            <List
              items={[
                "Authenticate users and prevent fraudulent account access",
                "Remember your login status and preferences",
                "Maintain shopping cart contents between sessions",
                "Provide secure access to account features",
                "Enable core website functionality and navigation",
              ]}
            />
          </div>
          <div>
            <h5 className="font-medium text-slate-900 dark:text-white mb-3">
              Enhancement Features:
            </h5>
            <List
              items={[
                "Personalize content based on your interests",
                "Remember your theme and display preferences",
                "Provide relevant search suggestions",
                "Enable social sharing and interaction features",
                "Optimize website performance and loading times",
              ]}
            />
          </div>
        </div>
      </Section>

      <Section title="Third-Party Cookies and Services" icon={ExternalLink}>
        <p className="mb-4">
          We partner with trusted third-party services that may place cookies on
          your device. These services have their own privacy policies and cookie
          practices:
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <h5 className="font-medium text-slate-900 dark:text-white mb-2">
              Analytics Services
            </h5>
            <List
              items={[
                {
                  title: "Google Analytics",
                  description:
                    "Website traffic analysis and user behavior insights - Privacy Policy: policies.google.com/privacy",
                },
                {
                  title: "Hotjar",
                  description:
                    "Heatmaps and user session recordings for UX improvement - Privacy Policy: hotjar.com/privacy",
                },
              ]}
            />
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <h5 className="font-medium text-slate-900 dark:text-white mb-2">
              Social Media Integration
            </h5>
            <List
              items={[
                {
                  title: "Facebook Pixel",
                  description:
                    "Social media integration and advertising - Privacy Policy: facebook.com/privacy",
                },
                {
                  title: "Twitter Analytics",
                  description:
                    "Social sharing and engagement tracking - Privacy Policy: twitter.com/privacy",
                },
                {
                  title: "LinkedIn Insight Tag",
                  description:
                    "Professional network integration - Privacy Policy: linkedin.com/legal/privacy-policy",
                },
              ]}
            />
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <h5 className="font-medium text-slate-900 dark:text-white mb-2">
              Content and Performance
            </h5>
            <List
              items={[
                {
                  title: "Cloudflare",
                  description:
                    "Content delivery and website security - Privacy Policy: cloudflare.com/privacy",
                },
                {
                  title: "YouTube",
                  description:
                    "Embedded video content - Privacy Policy: policies.google.com/privacy",
                },
              ]}
            />
          </div>
        </div>
      </Section>

      <Section title="Managing Your Cookie Preferences" icon={Eye}>
        <div className="space-y-6">
          <p className="mb-4">
            You have several options for managing cookies and controlling your
            privacy:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-2xl border border-blue-200 dark:border-blue-800/30"
            >
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Browser Settings
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                Most browsers allow you to control cookies through their
                settings:
              </p>
              <List
                items={[
                  "Block all cookies or only third-party cookies",
                  "Delete existing cookies from your device",
                  "Receive notifications when cookies are set",
                  "Browse in private/incognito mode",
                ]}
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 rounded-2xl border border-green-200 dark:border-green-800/30"
            >
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Our Cookie Preferences
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                Use our preference center to customize your experience:
              </p>
              <List
                items={[
                  "Accept or reject non-essential cookies",
                  "Customize advertising preferences",
                  "Control analytics and performance tracking",
                  "Manage social media integrations",
                ]}
              />
            </motion.div>
          </div>

          <div className="p-6 bg-yellow-50/50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-200 dark:border-yellow-800/30">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Cookie Preference Center
            </h4>
            <p className="text-yellow-700 dark:text-yellow-300 mb-4">
              Click the button below to open our cookie preference center where
              you can customize your cookie settings at any time:
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-medium transition-colors duration-200"
            >
              Manage Cookie Preferences
            </motion.button>
          </div>
        </div>
      </Section>

      <Section title="Browser-Specific Instructions" icon={Smartphone}>
        <p className="mb-4">
          Here's how to manage cookies in popular browsers:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <h5 className="font-medium text-slate-900 dark:text-white mb-2">
              Google Chrome
            </h5>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Settings → Privacy and Security → Cookies and other site data
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <h5 className="font-medium text-slate-900 dark:text-white mb-2">
              Mozilla Firefox
            </h5>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Options → Privacy & Security → Cookies and Site Data
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <h5 className="font-medium text-slate-900 dark:text-white mb-2">
              Safari
            </h5>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Preferences → Privacy → Manage Website Data
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <h5 className="font-medium text-slate-900 dark:text-white mb-2">
              Microsoft Edge
            </h5>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Settings → Site permissions → Cookies and site data
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <h5 className="font-medium text-slate-900 dark:text-white mb-2">
              Opera
            </h5>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Settings → Advanced → Privacy & security → Site Settings
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <h5 className="font-medium text-slate-900 dark:text-white mb-2">
              Mobile Browsers
            </h5>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Check your browser's help section for mobile-specific instructions
            </p>
          </div>
        </div>
      </Section>

      <Section title="Mobile Apps and Other Technologies" icon={Server}>
        <p className="mb-4">
          In addition to cookies, we may use other tracking technologies across
          our platforms:
        </p>
        <List
          items={[
            {
              title: "Local Storage and Session Storage",
              description:
                "Store information locally in your browser for improved performance and user experience",
            },
            {
              title: "Web Beacons and Pixel Tags",
              description:
                "Small transparent images that help us track user behavior and email engagement",
            },
            {
              title: "Mobile Device Identifiers",
              description:
                "Device-specific identifiers for mobile app analytics and personalization (with your permission)",
            },
            {
              title: "Server Logs",
              description:
                "Automatically collect technical information about your device and connection for security and performance",
            },
            {
              title: "Fingerprinting Prevention",
              description:
                "We do not use browser fingerprinting techniques to track users across sessions",
            },
          ]}
        />
      </Section>

      <Section
        title="Impact of Disabling Cookies"
        icon={AlertTriangle}
        variant="warning"
      >
        <p className="mb-4">
          While you can disable cookies, doing so may affect your experience on
          our website:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-slate-900 dark:text-white mb-3">
              Potential Issues:
            </h5>
            <List
              items={[
                "Need to re-enter login information on each visit",
                "Loss of personalized settings and preferences",
                "Slower website performance and loading times",
                "Some interactive features may not work correctly",
                "Less relevant content recommendations",
              ]}
            />
          </div>
          <div>
            <h5 className="font-medium text-slate-900 dark:text-white mb-3">
              What Still Works:
            </h5>
            <List
              items={[
                "Basic website navigation and content viewing",
                "Reading articles and blog posts",
                "Using search functionality",
                "Accessing public content and pages",
                "Contact forms and basic interactions",
              ]}
            />
          </div>
        </div>
      </Section>

      <Section title="International Considerations" icon={Globe}>
        <p className="mb-4">
          We comply with international privacy regulations regarding cookies:
        </p>
        <List
          items={[
            {
              title: "GDPR (European Union)",
              description:
                "We obtain consent before using non-essential cookies and provide clear information about our cookie practices",
            },
            {
              title: "CCPA (California)",
              description:
                "California residents have additional rights regarding personal information collected through cookies",
            },
            {
              title: "LGPD (Brazil)",
              description:
                "We comply with Brazilian data protection laws regarding cookie usage and consent",
            },
            {
              title: "Other Jurisdictions",
              description:
                "We adapt our cookie practices to comply with local privacy laws where applicable",
            },
          ]}
        />
      </Section>

      <Section title="Updates to This Cookie Policy" icon={Clock}>
        <p className="mb-4">
          We may update this Cookie Policy periodically to reflect changes in
          our practices, technology, or applicable laws:
        </p>
        <List
          items={[
            "Material changes will be communicated via email or website notice",
            "The 'Last Updated' date will reflect the most recent changes",
            "We encourage you to review this policy periodically",
            "Continued use of our website constitutes acceptance of cookie policy changes",
            "You can always update your cookie preferences through our preference center",
          ]}
        />
        <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Stay Informed:</strong> Subscribe to our newsletter or
            follow our blog to stay updated on privacy policy changes and new
            privacy features we introduce.
          </p>
        </div>
      </Section>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900/20">
      <div className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-16">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-2xl shadow-lg mb-8">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Legal Information</span>
                <FileText className="w-4 h-4" />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-8 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                Privacy & Legal
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Your privacy and security are our top priorities. Learn how we
                protect your data and understand our terms of service.
              </p>
            </motion.div>

            {/* Last Updated Info */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-2xl p-6 text-center">
                <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">Last Updated</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300">
                  {lastUpdated}
                </p>
              </div>
            </motion.div>

            {/* Navigation Tabs */}
            <motion.div variants={itemVariants} className="mb-12">
              <div className="flex flex-wrap justify-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-2 shadow-lg border border-white/50 dark:border-slate-700/50">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl transition-all duration-300 min-w-[160px] ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <div className="text-center">
                        <div className="font-bold text-sm">{tab.label}</div>
                        <div
                          className={`text-xs mt-1 ${
                            activeTab === tab.id
                              ? "text-white/80"
                              : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Content Area */}
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-slate-500/5 rounded-3xl blur-lg"></div>
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700/50 overflow-hidden">
                <div className="p-8 lg:p-12">
                  <AnimatePresence mode="wait">
                    {activeTab === "privacy" && <PrivacyContent />}
                    {activeTab === "terms" && <TermsContent />}
                    {activeTab === "cookies" && <CookiesContent />}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div variants={itemVariants} className="mt-16">
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Questions About Our Policies?
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  If you have any questions about our privacy practices or legal
                  policies, please don't hesitate to contact us.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    href="mailto:legal@yourblog.com"
                    className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>legal@bytethoughts.com</span>
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    href="tel:+94712345678"
                    className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>+94 712345678</span>
                  </motion.a>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <MapPin className="w-5 h-5" />
                    <span>Colombo, Sri Lanka</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-slate-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-slate-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-br from-slate-400/10 to-slate-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-40 w-28 h-28 bg-gradient-to-br from-slate-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
};

export default LegalPages;

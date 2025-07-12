'use client';

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "ElectroSage Academy",
    "description": "AI-powered electrical engineering education platform with interactive visualizations and Socratic tutoring",
    "url": "https://electrosage.emmi.zone",
    "logo": "https://electrosage.emmi.zone/icons/icon-512x512.png",
    "image": "https://electrosage.emmi.zone/electrosage-screenshot.jpg",
    "sameAs": [
      "https://github.com/EmminiX/ElectroSage",
      "https://twitter.com/ElectroSageAcad",
      "https://linkedin.com/company/electrosage-academy"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "Website",
    "name": "ElectroSage Academy",
    "description": "Master electrical engineering with AI-powered tutoring, interactive visualizations, and comprehensive educational content",
    "url": "https://electrosage.emmi.zone",
    "publisher": {
      "@type": "Organization",
      "name": "ElectroSage Academy"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://electrosage.emmi.zone/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const educationalCourseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Complete Electrical Engineering Fundamentals",
    "description": "Comprehensive electrical engineering course covering atomic structure, circuit analysis, and practical applications with AI tutoring",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "ElectroSage Academy"
    },
    "courseCode": "EE-101",
    "educationalLevel": "Beginner to Advanced",
    "teaches": [
      "Atomic Structure and Electrical Fundamentals",
      "Circuit Analysis and Design",
      "Electrical Measurements and Safety",
      "AC/DC Circuit Theory",
      "Electronic Components and Applications"
    ],
    "coursePrerequisites": "Basic mathematics and physics knowledge",
    "timeRequired": "PT40H",
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": "PT5H",
      "instructor": {
        "@type": "Person",
        "name": "ElectroSage AI Tutor",
        "description": "AI-powered Socratic method instructor"
      }
    }
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ElectroSage Academy",
    "applicationCategory": "EducationalApplication",
    "applicationSubCategory": "Engineering Education",
    "operatingSystem": "Web Browser",
    "softwareVersion": "1.0.0",
    "description": "Interactive electrical engineering education platform with AI tutoring and visualizations",
    "url": "https://electrosage.emmi.zone",
    "downloadUrl": "https://electrosage.emmi.zone",
    "screenshot": "https://electrosage.emmi.zone/electrosage-screenshot.jpg",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "featureList": [
      "AI-powered Socratic tutoring",
      "14 interactive visualizations",
      "Voice-to-text learning",
      "Educational podcasts",
      "Circuit builder tool",
      "Progress tracking",
      "Accessibility features"
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://electrosage.emmi.zone"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Sections",
        "item": "https://electrosage.emmi.zone/sections"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Visualizations", 
        "item": "https://electrosage.emmi.zone/visualizations"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Podcasts",
        "item": "https://electrosage.emmi.zone/podcast"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is ElectroSage Academy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ElectroSage Academy is an AI-powered electrical engineering education platform featuring Socratic tutoring, 14 interactive visualizations, educational podcasts, and voice-to-text learning capabilities."
        }
      },
      {
        "@type": "Question",
        "name": "How does the AI tutoring work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our AI tutor uses the Socratic method, asking strategic questions to guide you to discover solutions rather than providing direct answers. This promotes deeper understanding and critical thinking skills."
        }
      },
      {
        "@type": "Question",
        "name": "Is ElectroSage Academy free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, ElectroSage Academy is completely free to use. All educational content, visualizations, and AI tutoring features are available at no cost."
        }
      },
      {
        "@type": "Question",
        "name": "What topics are covered in the course?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The course covers 8 comprehensive sections: Introduction to Electrical Engineering, Atomic Structure, Electron Shells, Electrical Charge, Coulomb's Law, Basic Electrical Units, and Circuit Fundamentals."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalCourseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
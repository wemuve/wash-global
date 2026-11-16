// Homepage-only structured data; shared business identity remains in index.html.
export const homepageBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://wewashglobal.com/#organization",
  "name": "WeWash Zambia",
  "alternateName": [
    "WeWash Global",
    "WeWash Cleaning Services",
    "WeWash Lusaka",
    "WeWash Kabulonga"
  ],
  "description": "Zambia's premium professional cleaning company offering deep cleaning, sofa & carpet cleaning, mobile car detailing, office & facility cleaning, fumigation, and trained domestic staff across Lusaka.",
  "url": "https://wewashglobal.com",
  "telephone": "+260768671420",
  "email": "booking@wewashglobal.com",
  "image": "https://wewashglobal.com/og-image.jpg",
  "logo": "https://wewashglobal.com/wewash-logo.png",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "D13 Antelope Close, Kabulonga",
    "addressLocality": "Lusaka",
    "addressRegion": "Lusaka Province",
    "postalCode": "10101",
    "addressCountry": "ZM"
  },
  "hasMap": "https://www.google.com/maps/search/?api=1&query=-15.387526,28.322817",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -15.387526,
    "longitude": 28.322817
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "07:00",
      "closes": "19:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Sunday",
      "opens": "08:00",
      "closes": "16:00"
    }
  ],
  "priceRange": "K150 - K5000+",
  "paymentAccepted": [
    "Cash",
    "Mobile Money",
    "Bank Transfer"
  ],
  "currenciesAccepted": "ZMW",
  "areaServed": [
    {
      "@type": "City",
      "name": "Lusaka"
    },
    {
      "@type": "Place",
      "name": "Kabulonga, Lusaka"
    },
    {
      "@type": "Place",
      "name": "Woodlands, Lusaka"
    },
    {
      "@type": "Place",
      "name": "Rhodes Park, Lusaka"
    },
    {
      "@type": "Place",
      "name": "Ibex Hill, Lusaka"
    },
    {
      "@type": "Place",
      "name": "Roma, Lusaka"
    },
    {
      "@type": "Place",
      "name": "Sunningdale, Lusaka"
    },
    {
      "@type": "Country",
      "name": "Zambia"
    }
  ],
  "knowsAbout": [
    "House cleaning Lusaka",
    "Deep cleaning Zambia",
    "Maid services Lusaka",
    "Facility management Zambia",
    "Swimming pool cleaning Lusaka",
    "Pool construction Zambia",
    "Car detailing Lusaka",
    "Mobile car wash Lusaka",
    "Fumigation Lusaka"
  ],
  "sameAs": [
    "https://www.facebook.com/wewashzambia",
    "https://www.instagram.com/wewashzambia",
    "https://www.linkedin.com/company/wewashglobal",
    "https://wa.me/260768671420"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "WeWash Services in Lusaka, Zambia",
    "itemListElement": [
      {
        "@type": "Offer",
        "priceCurrency": "ZMW",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "minPrice": 550,
          "priceCurrency": "ZMW"
        },
        "itemOffered": {
          "@type": "Service",
          "name": "House & Deep Cleaning in Lusaka",
          "serviceType": "House cleaning",
          "areaServed": {
            "@type": "City",
            "name": "Lusaka"
          },
          "url": "https://wewashglobal.com/services",
          "description": "General cleaning from K550 and deep cleaning from K850 for homes across Lusaka, plus sofa, carpet and post-construction cleaning."
        }
      },
      {
        "@type": "Offer",
        "priceCurrency": "ZMW",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "minPrice": 150,
          "priceCurrency": "ZMW"
        },
        "itemOffered": {
          "@type": "Service",
          "name": "Maid Services & Housekeeping in Lusaka",
          "serviceType": "Maid service",
          "areaServed": {
            "@type": "City",
            "name": "Lusaka"
          },
          "url": "https://wewashglobal.com/services",
          "description": "Trained, vetted maids and housekeepers in Lusaka — daily from K150 or live-in from K2,500 per month."
        }
      },
      {
        "@type": "Offer",
        "priceCurrency": "ZMW",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "minPrice": 2500,
          "priceCurrency": "ZMW"
        },
        "itemOffered": {
          "@type": "Service",
          "name": "Facility Management & Office Cleaning in Zambia",
          "serviceType": "Facility management",
          "areaServed": {
            "@type": "Country",
            "name": "Zambia"
          },
          "url": "https://wewashglobal.com/services",
          "description": "Managed cleaning contracts for offices and institutions in Lusaka — office cleaning from K200 per day, facility management from K2,500 per month."
        }
      },
      {
        "@type": "Offer",
        "priceCurrency": "ZMW",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "minPrice": 800,
          "priceCurrency": "ZMW"
        },
        "itemOffered": {
          "@type": "Service",
          "name": "Swimming Pool Cleaning, Servicing, Repairs & Construction in Lusaka",
          "serviceType": "Swimming pool service",
          "areaServed": {
            "@type": "City",
            "name": "Lusaka"
          },
          "url": "https://wewashglobal.com/services/pools",
          "description": "Pool cleaning and servicing from K800, green pool recovery, repairs and new pool construction in Lusaka."
        }
      },
      {
        "@type": "Offer",
        "priceCurrency": "ZMW",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "minPrice": 450,
          "priceCurrency": "ZMW"
        },
        "itemOffered": {
          "@type": "Service",
          "name": "Mobile Car Detailing in Lusaka",
          "serviceType": "Car detailing",
          "areaServed": {
            "@type": "City",
            "name": "Lusaka"
          },
          "url": "https://wewashglobal.com/services/car-detailing",
          "description": "Interior detailing from K450 and full interior + exterior detailing from K650 — at your home or at our Kabulonga base."
        }
      },
      {
        "@type": "Offer",
        "priceCurrency": "ZMW",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "minPrice": 400,
          "priceCurrency": "ZMW"
        },
        "itemOffered": {
          "@type": "Service",
          "name": "Fumigation & Pest Control in Lusaka",
          "serviceType": "Pest control",
          "areaServed": {
            "@type": "City",
            "name": "Lusaka"
          },
          "url": "https://wewashglobal.com/services",
          "description": "Residential fumigation from K400, commercial from K800 and termite treatment from K1,200."
        }
      }
    ]
  },
  "potentialAction": [
    {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://wewashglobal.com/book-now",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "result": {
        "@type": "Reservation",
        "name": "Book a WeWash service"
      }
    },
    {
      "@type": "CommunicateAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://wa.me/260768671420",
        "actionPlatform": "http://schema.org/MobileWebPlatform"
      }
    }
  ]
};

export const homepageFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does deep cleaning cost in Lusaka?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Deep cleaning in Lusaka starts from K850 for a 1-bedroom property. Final pricing depends on property size, condition, location, and specific requirements. WeWash provides a free, no-obligation quote after assessment. Contact us at +260768671420."
      }
    },
    {
      "@type": "Question",
      "name": "How much does car detailing cost in Lusaka?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Mobile car detailing starts from K450 for interior deep cleaning of a small car and K650 for full detailing. SUV prices start from K550 (interior) and K850 (full detail). We come to your location across Lusaka."
      }
    },
    {
      "@type": "Question",
      "name": "Do you provide sofa and carpet cleaning in Zambia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! WeWash provides professional sofa, carpet, and upholstery cleaning with industrial-grade equipment. We use eco-friendly products safe for families and pets. Book via WhatsApp at +260768671420."
      }
    },
    {
      "@type": "Question",
      "name": "What areas in Lusaka do you serve?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "WeWash serves all areas across Lusaka including Kabulonga, Woodlands, Rhodes Park, Ibex Hill, Meanwood, Chelstone, Avondale, Chalalala, Roma, Sunningdale, and surrounding areas. Transport is calculated separately based on distance."
      }
    },
    {
      "@type": "Question",
      "name": "Do you provide trained maids in Lusaka?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! WeWash provides professionally trained, vetted, and background-checked domestic staff. All our staff undergo comprehensive training in cleaning, hygiene, and professional conduct."
      }
    }
  ]
};

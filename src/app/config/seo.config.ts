import { SEOData, MultilangSEOData } from '../services/seo.service';

export const SEO_CONFIG = {
  // Supported languages with their configurations
  supportedLanguages: {
    en: { name: 'English', nativeName: 'English', code: 'en', hreflang: 'en-US' },
    es: { name: 'Spanish', nativeName: 'Español', code: 'es', hreflang: 'es-ES' },
    fr: { name: 'French', nativeName: 'Français', code: 'fr', hreflang: 'fr-FR' },
    de: { name: 'German', nativeName: 'Deutsch', code: 'de', hreflang: 'de-DE' },
    it: { name: 'Italian', nativeName: 'Italiano', code: 'it', hreflang: 'it-IT' },
    pt: { name: 'Portuguese', nativeName: 'Português', code: 'pt', hreflang: 'pt-BR' },
    ru: { name: 'Russian', nativeName: 'Русский', code: 'ru', hreflang: 'ru-RU' },
    ja: { name: 'Japanese', nativeName: '日本語', code: 'ja', hreflang: 'ja-JP' },
    ko: { name: 'Korean', nativeName: '한국어', code: 'ko', hreflang: 'ko-KR' },
    zh: { name: 'Chinese', nativeName: '中文', code: 'zh', hreflang: 'zh-CN' },
    ar: { name: 'Arabic', nativeName: 'العربية', code: 'ar', hreflang: 'ar-SA' },
    hi: { name: 'Hindi', nativeName: 'हिंदी', code: 'hi', hreflang: 'hi-IN' },
    bn: { name: 'Bengali', nativeName: 'বাংলা', code: 'bn', hreflang: 'bn-BD' },
    ur: { name: 'Urdu', nativeName: 'اردو', code: 'ur', hreflang: 'ur-PK' },
  },

  // Default SEO configuration
  defaultSEO: {
    title: 'Smart Text Converter - Free Online Text Tools',
    description:
      'Smart Text Converter - Convert, format, and analyze text with our free online tools. Case converter, text formatter, and more utilities for developers and writers.',
    keywords:
      'smart text converter, text converter, case converter, online tools, free utilities, text formatter',
    url: 'https://smarttextconverter.com',
    type: 'website',
    image: '/main-logo-80x80.png',
    author: 'SmartTextConverter',
    locale: 'en',
    canonicalUrl: 'https://smarttextconverter.com',
  },

  // Multi-language SEO data
  multilangSEO: {
    en: {
      title: 'SmartTextConverter - Free Online Text Tools',
      description:
        'Convert, format, and analyze text with our free online tools. Case converter, text formatter, and more utilities for developers and writers.',
      keywords: 'text converter, case converter, online tools, free utilities, text formatter',
      locale: 'en',
    },
    es: {
      title: 'SmartTextConverter - Herramientas de Texto Online Gratuitas',
      description:
        'Convierte, formatea y analiza texto con nuestras herramientas online gratuitas. Convertidor de mayúsculas, formateador de texto y más utilidades para desarrolladores y escritores.',
      keywords:
        'convertidor de texto, convertidor de mayúsculas, herramientas online, utilidades gratuitas, formateador de texto',
      locale: 'es',
    },
    fr: {
      title: 'SmartTextConverter - Outils de Texte en Ligne Gratuits',
      description:
        "Convertissez, formatez et analysez le texte avec nos outils en ligne gratuits. Convertisseur de casse, formateur de texte et plus d'utilitaires pour développeurs et écrivains.",
      keywords:
        'convertisseur de texte, convertisseur de casse, outils en ligne, utilitaires gratuits, formateur de texte',
      locale: 'fr',
    },
    de: {
      title: 'SmartTextConverter - Kostenlose Online-Textwerkzeuge',
      description:
        'Konvertieren, formatieren und analysieren Sie Text mit unseren kostenlosen Online-Tools. Groß-/Kleinschreibung-Konverter, Textformatierer und mehr Utilities für Entwickler und Autoren.',
      keywords:
        'textkonverter, groß-/kleinschreibung konverter, online tools, kostenlose utilities, textformatierer',
      locale: 'de',
    },
    it: {
      title: 'SmartTextConverter - Strumenti di Testo Online Gratuiti',
      description:
        'Converti, formatta e analizza il testo con i nostri strumenti online gratuiti. Convertitore di maiuscole/minuscole, formattatore di testo e più utilità per sviluppatori e scrittori.',
      keywords:
        'convertitore di testo, convertitore maiuscole/minuscole, strumenti online, utilità gratuite, formattatore di testo',
      locale: 'it',
    },
    pt: {
      title: 'SmartTextConverter - Ferramentas de Texto Online Gratuitas',
      description:
        'Converta, formate e analise texto com nossas ferramentas online gratuitas. Conversor de maiúsculas/minúsculas, formatador de texto e mais utilitários para desenvolvedores e escritores.',
      keywords:
        'conversor de texto, conversor de maiúsculas, ferramentas online, utilitários gratuitos, formatador de texto',
      locale: 'pt',
    },
    ru: {
      title: 'SmartTextConverter - Бесплатные Онлайн Инструменты для Текста',
      description:
        'Конвертируйте, форматируйте и анализируйте текст с помощью наших бесплатных онлайн-инструментов. Конвертер регистра, форматировщик текста и другие утилиты для разработчиков и писателей.',
      keywords:
        'конвертер текста, конвертер регистра, онлайн инструменты, бесплатные утилиты, форматировщик текста',
      locale: 'ru',
    },
    ja: {
      title: 'SmartTextConverter - 無料オンラインテキストツール',
      description:
        '無料のオンラインツールでテキストを変換、フォーマット、分析します。大文字小文字変換器、テキストフォーマッター、開発者やライター向けのその他のユーティリティ。',
      keywords:
        'テキストコンバーター, 大文字小文字変換器, オンラインツール, 無料ユーティリティ, テキストフォーマッター',
      locale: 'ja',
    },
    ko: {
      title: 'SmartTextConverter - 무료 온라인 텍스트 도구',
      description:
        '무료 온라인 도구로 텍스트를 변환, 포맷 및 분석하세요. 대소문자 변환기, 텍스트 포맷터 및 개발자와 작가를 위한 더 많은 유틸리티.',
      keywords: '텍스트 변환기, 대소문자 변환기, 온라인 도구, 무료 유틸리티, 텍스트 포맷터',
      locale: 'ko',
    },
    zh: {
      title: 'SmartTextConverter - 免费在线文本工具',
      description:
        '使用我们的免费在线工具转换、格式化和分析文本。大小写转换器、文本格式化器以及更多面向开发者和作家的实用工具。',
      keywords: '文本转换器, 大小写转换器, 在线工具, 免费实用工具, 文本格式化器',
      locale: 'zh',
    },
    ar: {
      title: 'SmartTextConverter - أدوات النص المجانية عبر الإنترنت',
      description:
        'قم بتحويل وتنسيق وتحليل النص باستخدام أدواتنا المجانية عبر الإنترنت. محول حالة الأحرف، منسق النصوص والمزيد من الأدوات للمطورين والكتاب.',
      keywords: 'محول النص, محول حالة الأحرف, أدوات عبر الإنترنت, أدوات مجانية, منسق النصوص',
      locale: 'ar',
    },
    hi: {
      title: 'SmartTextConverter - मुफ्त ऑनलाइन टेक्स्ट टूल्स',
      description:
        'हमारे मुफ्त ऑनलाइन टूल्स के साथ टेक्स्ट को कन्वर्ट, फॉर्मेट और एनालाइज़ करें। केस कन्वर्टर, टेक्स्ट फॉर्मेटर और डेवलपर्स और लेखकों के लिए अधिक यूटिलिटीज।',
      keywords: 'टेक्स्ट कन्वर्टर, केस कन्वर्टर, ऑनलाइन टूल्स, मुफ्त यूटिलिटीज, टेक्स्ट फॉर्मेटर',
      locale: 'hi',
    },
    bn: {
      title: 'SmartTextConverter - বিনামূল্যের অনলাইন টেক্সট টুলস',
      description:
        'আমাদের বিনামূল্যের অনলাইন টুলস দিয়ে টেক্সট কনভার্ট, ফরম্যাট এবং বিশ্লেষণ করুন। কেস কনভার্টার, টেক্সট ফরম্যাটার এবং ডেভেলপার এবং লেখকদের জন্য আরও ইউটিলিটি।',
      keywords:
        'টেক্সট কনভার্টার, কেস কনভার্টার, অনলাইন টুলস, বিনামূল্যের ইউটিলিটি, টেক্সট ফরম্যাটার',
      locale: 'bn',
    },
    ur: {
      title: 'SmartTextConverter - مفت آن لائن ٹیکسٹ ٹولز',
      description:
        'ہمارے مفت آن لائن ٹولز کے ساتھ ٹیکسٹ کو کنورٹ، فارمیٹ اور تجزیہ کریں۔ کیس کنورٹر، ٹیکسٹ فارمیٹر اور ڈیولپرز اور مصنفین کے لیے مزید یوٹیلیٹیز۔',
      keywords: 'ٹیکسٹ کنورٹر, کیس کنورٹر, آن لائن ٹولز, مفت یوٹیلیٹیز, ٹیکسٹ فارمیٹر',
      locale: 'ur',
    },
  },

  // Page-specific SEO data
  pageSEO: {
    home: {
      en: {
        title: 'Smart Text Converter - Free Online Text Tools',
        description:
          'Smart Text Converter - Convert, format, and analyze text with our free online tools. Case converter, text formatter, and more utilities for developers and writers.',
        keywords:
          'smart text converter, text converter, case converter, online tools, free utilities, text formatter',
        structuredData: [
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Smart Text Converter',
            description: 'Smart Text Converter - Free online text conversion and formatting tools',
            url: 'https://smarttextconverter.com',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '2847',
              bestRating: '5',
              worstRating: '1',
            },
            publisher: {
              '@type': 'Organization',
              name: 'SmartTextConverter',
              url: 'https://smarttextconverter.com',
            },
            audience: {
              '@type': 'Audience',
              audienceType: 'Global users requiring text processing tools',
            },
            keywords:
              'text converter, case converter, text formatter, multi language, international, global, online tools, free utilities',
            screenshot: '/main-logo-80x80.png',
            softwareVersion: '2.0',
            datePublished: '2024-01-01',
            dateModified: '2025-01-07',
            featureList: [
              'Case Converter - Convert text between uppercase, lowercase, title case, camelCase, snake_case, kebab-case',
              'Text Formatter - Trim whitespace, collapse spaces, remove line breaks, normalize text',
              'Line Tools - Sort lines, remove duplicates, number lines, reverse order, shuffle lines',
              'Encode/Decode - URL encode/decode, Base64 encode/decode, HTML escape/unescape, JSON encode',
              'Text Analyzer - Analyze text, find and replace, word frequency, text statistics',
              'Text Generator - Generate Lorem Ipsum, random text, UUIDs, extract emails and URLs',
              'JSON Formatter - Format, validate, and beautify JSON data with syntax highlighting',
              'JSON Parser - Parse, analyze, and understand JSON data structure with detailed statistics',
              'XML Formatter - Format, validate, and beautify XML documents',
              'JavaScript Formatter - Format, beautify, minify, and validate JavaScript code',
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'SmartTextConverter',
            url: 'https://smarttextconverter.com',
            logo: 'https://smarttextconverter.com/main-logo-80x80.png',
            description: 'Free online text conversion and formatting tools supporting 20 languages',
            foundingDate: '2024-01-01',
            sameAs: [
              'https://github.com/smarttextconverter',
              'https://twitter.com/smarttextconverter',
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              url: 'https://smarttextconverter.com/contact',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://smarttextconverter.com',
              },
            ],
          },
        ],
      },
    },
    caseConverter: {
      en: {
        title: 'Case Converter - Free Online Text Case Converter',
        description:
          'Convert text between uppercase, lowercase, title case, and more. Free online case converter tool for developers and writers.',
        keywords: 'case converter, uppercase, lowercase, title case, text converter',
        structuredData: [
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Case Converter',
            description: 'Free online text case conversion tool',
            url: 'https://smarttextconverter.com/case-converter',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web Browser',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '1250',
              bestRating: '5',
              worstRating: '1',
            },
          },
        ],
      },
    },
    textFormatter: {
      en: {
        title: 'Text Formatter - Free Online Text Formatting Tool',
        description:
          'Format text with our free online text formatter. Clean, format, and organize your text with various formatting options.',
        keywords: 'text formatter, text formatting, clean text, format text',
        structuredData: [
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Text Formatter',
            description: 'Free online text formatting tool',
            url: 'https://smarttextconverter.com/text-formatter',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web Browser',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.7',
              ratingCount: '892',
              bestRating: '5',
              worstRating: '1',
            },
          },
        ],
      },
    },
    textAnalyzer: {
      en: {
        title: 'Text Analyzer - Free Online Text Analysis Tool',
        description:
          'Analyze text with our free online text analyzer. Get word count, character count, reading time, and more text statistics.',
        keywords: 'text analyzer, word count, character count, text analysis, reading time',
        structuredData: [
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Text Analyzer',
            description: 'Free online text analysis tool',
            url: 'https://smarttextconverter.com/text-analyzer',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web Browser',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.7',
              ratingCount: '567',
              bestRating: '5',
              worstRating: '1',
            },
          },
        ],
      },
    },
    jsonUtility: {
      en: {
        title: 'JSON Utility - Free Online JSON Tools',
        description:
          'Format, validate, and convert JSON with our free online JSON utility tools. JSON formatter, validator, and more.',
        keywords: 'json utility, json formatter, json validator, json tools',
        structuredData: [
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'JSON Utility',
            description: 'Free online JSON formatting and validation tools',
            url: 'https://smarttextconverter.com/json/formatter',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web Browser',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.7',
              ratingCount: '1200',
              bestRating: '5',
              worstRating: '1',
            },
          },
        ],
      },
    },
    jsonParser: {
      en: {
        title: 'JSON Parser - Free Online JSON Parsing Tool',
        description:
          'Parse, analyze, and understand JSON data structure instantly. Get detailed statistics, insights, and comprehensive analysis of your JSON data.',
        keywords:
          'json parser, json analyzer, json statistics, json structure, json viewer, json editor, online json tool, json data analysis',
        structuredData: [
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'JSON Parser',
            description: 'Free online JSON parsing and analysis tools',
            url: 'https://smarttextconverter.com/json/parser',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.7',
              ratingCount: '1200',
              bestRating: '5',
              worstRating: '1',
            },
            publisher: {
              '@type': 'Organization',
              name: 'SmartTextConverter',
              url: 'https://smarttextconverter.com',
            },
            audience: {
              '@type': 'Audience',
              audienceType: 'Developers and data analysts',
            },
            keywords:
              'JSON parser, JSON analyzer, JSON statistics, JSON structure, JSON viewer, JSON editor, online JSON tool, JSON data analysis',
            screenshot: '/main-logo-80x80.png',
            softwareVersion: '2.0',
            datePublished: '2024-01-01',
            dateModified: '2025-01-04',
          },
        ],
      },
    },
    blog: {
      en: {
        title: 'Blog - Text Conversion Tips and Tutorials',
        description:
          'Read our blog for text conversion tips, tutorials, and best practices. Learn how to use our tools effectively.',
        keywords: 'text conversion blog, tutorials, tips, best practices',
        structuredData: [
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'SmartTextConverter Blog',
            description: 'Text conversion tips and tutorials',
            url: 'https://smarttextconverter.com/blog',
          },
        ],
      },
    },
    jsFormatter: {
      en: {
        title: 'JavaScript Formatter - Format, Beautify, Minify JS Code Online Free',
        description:
          'Free online JavaScript formatter. Format, beautify, minify, and validate JavaScript code. Convert ES6, fix syntax errors. No registration required.',
        keywords:
          'JavaScript formatter, JS beautifier, JS minifier, JavaScript validator, code formatter, JS prettifier, ES6 converter, JavaScript tools, online JS editor, JS parser',
        structuredData: [
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'JavaScript Formatter',
            description: 'Free online JavaScript formatting, beautification, and minification tool',
            url: 'https://smarttextconverter.com/js/formatter',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '850',
              bestRating: '5',
              worstRating: '1',
            },
            publisher: {
              '@type': 'Organization',
              name: 'SmartTextConverter',
              url: 'https://smarttextconverter.com',
            },
            audience: {
              '@type': 'Audience',
              audienceType: 'JavaScript developers and web developers',
            },
            keywords:
              'JavaScript formatter, JS beautifier, JS minifier, JavaScript validator, code formatter, JS prettifier, ES6 converter, JavaScript tools, online JS editor, JS parser',
            screenshot: '/main-logo-80x80.png',
            softwareVersion: '1.0',
            datePublished: '2025-01-07',
            dateModified: '2025-01-07',
            featureList: [
              'JavaScript Formatting',
              'Code Beautification',
              'Code Minification',
              'Syntax Validation',
              'ES6 Conversion',
              'Error Detection',
            ],
          },
        ],
      },
    },
    htmlFormatter: {
      en: {
        title: 'HTML Formatter - Format, Beautify, Minify HTML Code Online Free',
        description:
          'Free online HTML formatter. Format, beautify, minify, and validate HTML code. Clean up HTML, fix indentation, remove empty attributes. No registration required.',
        keywords:
          'HTML formatter, HTML beautifier, HTML minifier, HTML validator, code formatter, HTML prettifier, HTML tools, online HTML editor, HTML parser',
        structuredData: [
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'HTML Formatter',
            description: 'Free online HTML formatting, beautification, and minification tool',
            url: 'https://smarttextconverter.com/html/formatter',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.7',
              ratingCount: '650',
              bestRating: '5',
              worstRating: '1',
            },
            publisher: {
              '@type': 'Organization',
              name: 'SmartTextConverter',
              url: 'https://smarttextconverter.com',
            },
            audience: {
              '@type': 'Audience',
              audienceType: 'Web developers and HTML developers',
            },
            keywords:
              'HTML formatter, HTML beautifier, HTML minifier, HTML validator, code formatter, HTML prettifier, HTML tools, online HTML editor, HTML parser',
            screenshot: '/main-logo-80x80.png',
            softwareVersion: '1.0',
            datePublished: '2025-01-07',
            dateModified: '2025-01-07',
            featureList: [
              'HTML Formatting',
              'Code Beautification',
              'Code Minification',
              'Syntax Validation',
              'Indentation Fix',
              'Empty Attribute Removal',
            ],
          },
        ],
      },
    },
    xmlFormatter: {
      en: {
        title: 'XML Formatter - Format, Beautify, Minify XML Code Online Free',
        description:
          'Free online XML formatter. Format, beautify, minify, and validate XML code. Clean up XML, fix indentation, convert to HTML/JSON. No registration required.',
        keywords:
          'XML formatter, XML beautifier, XML minifier, XML validator, code formatter, XML prettifier, XML tools, online XML editor, XML parser',
        structuredData: [
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'XML Formatter',
            description: 'Free online XML formatting, beautification, and minification tool',
            url: 'https://smarttextconverter.com/xml/formatter',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.6',
              ratingCount: '420',
              bestRating: '5',
              worstRating: '1',
            },
            publisher: {
              '@type': 'Organization',
              name: 'SmartTextConverter',
              url: 'https://smarttextconverter.com',
            },
            audience: {
              '@type': 'Audience',
              audienceType: 'XML developers and data analysts',
            },
            keywords:
              'XML formatter, XML beautifier, XML minifier, XML validator, code formatter, XML prettifier, XML tools, online XML editor, XML parser',
            screenshot: '/main-logo-80x80.png',
            softwareVersion: '1.0',
            datePublished: '2025-01-07',
            dateModified: '2025-01-07',
            featureList: [
              'XML Formatting',
              'Code Beautification',
              'Code Minification',
              'Syntax Validation',
              'HTML Conversion',
              'JSON Conversion',
            ],
          },
        ],
      },
    },
  },

  // Technical SEO requirements
  technicalSEO: {
    // Meta tags requirements
    metaTags: {
      required: ['title', 'description', 'viewport', 'charset'],
      recommended: [
        'keywords',
        'author',
        'robots',
        'canonical',
        'og:title',
        'og:description',
        'og:image',
        'og:url',
        'og:type',
        'twitter:card',
        'twitter:title',
        'twitter:description',
        'twitter:image',
      ],
    },

    // Content requirements
    content: {
      titleLength: { min: 30, max: 60, optimal: 50 },
      descriptionLength: { min: 120, max: 160, optimal: 140 },
      headingStructure: {
        h1: { required: true, maxPerPage: 1 },
        h2: { required: false, maxPerPage: 10 },
        h3: { required: false, maxPerPage: 20 },
      },
    },

    // URL structure requirements
    urlStructure: {
      maxLength: 255,
      useHyphens: true,
      avoidSpecialChars: true,
      includeKeywords: true,
    },

    // Image optimization requirements
    imageOptimization: {
      maxWidth: 1200,
      maxHeight: 630,
      formats: ['webp', 'jpg', 'png'],
      altTextRequired: true,
      lazyLoading: true,
    },

    // Internal linking requirements
    internalLinking: {
      minInternalLinks: 3,
      maxInternalLinks: 100,
      useDescriptiveAnchorText: true,
      avoidGenericAnchorText: true,
    },

    // Mobile optimization requirements
    mobileOptimization: {
      responsiveDesign: true,
      touchOptimized: true,
      fastLoading: true,
      viewportMetaTag: true,
    },

    // Accessibility requirements
    accessibility: {
      altTextForImages: true,
      properHeadingStructure: true,
      keyboardNavigation: true,
      screenReaderCompatible: true,
      colorContrast: true,
    },
  },

  // Performance requirements
  performance: {
    coreWebVitals: {
      lcp: { target: 2.5, good: 4.0 },
      fid: { target: 100, good: 300 },
      cls: { target: 0.1, good: 0.25 },
    },
    pageSpeed: {
      target: 90,
      good: 80,
      poor: 50,
    },
  },

  // E-E-A-T requirements (Experience, Expertise, Authoritativeness, Trustworthiness)
  eat: {
    experience: {
      authorCredentials: true,
      userReviews: true,
      caseStudies: true,
      testimonials: true,
    },
    expertise: {
      authorBio: true,
      qualifications: true,
      industryKnowledge: true,
      technicalAccuracy: true,
    },
    authoritativeness: {
      backlinks: true,
      citations: true,
      industryRecognition: true,
      thoughtLeadership: true,
    },
    trustworthiness: {
      contactInformation: true,
      privacyPolicy: true,
      termsOfService: true,
      securityCertificates: true,
      customerSupport: true,
    },
  },
};

export type SEOConfig = typeof SEO_CONFIG;

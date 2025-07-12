import { NextRequest, NextResponse } from 'next/server';

const SITE_URL = 'https://electrosage.emmi.zone';

// Educational sections for the sitemap
const educationalSections = [
  'introduction-to-electrical-engineering',
  'atomic-structure-and-fundamentals', 
  'understanding-the-atom',
  'electron-shells-and-valence',
  'electrical-charge-and-interaction',
  'coulombs-law-and-quantification',
  'basic-electrical-units',
  'circuit-fundamentals'
];

// Visualization pages
const visualizations = [
  'atomic-structure',
  'circuit-builder',
  'ac-waveform',
  'transformer',
  'capacitor',
  'inductor',
  'resistance',
  'current-flow',
  'voltage',
  'safety',
  'ohms-law-calculator',
  'series-circuit',
  'parallel-circuit',
  'component-library'
];

// Static pages
const staticPages = [
  '',
  'about',
  'podcast',
  'resources'
];

function generateSitemapXML() {
  const currentDate = new Date().toISOString();
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

  // Add static pages
  staticPages.forEach(page => {
    const url = page === '' ? SITE_URL : `${SITE_URL}/${page}`;
    const priority = page === '' ? '1.0' : '0.8';
    const changefreq = page === '' ? 'weekly' : 'monthly';
    
    sitemap += `
  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <mobile:mobile/>
  </url>`;
  });

  // Add educational sections
  educationalSections.forEach(section => {
    sitemap += `
  <url>
    <loc>${SITE_URL}/sections/${section}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <mobile:mobile/>
  </url>`;
  });

  // Add visualization pages
  visualizations.forEach(viz => {
    sitemap += `
  <url>
    <loc>${SITE_URL}/visualizations/${viz}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <mobile:mobile/>
  </url>`;
  });

  // Add podcast episodes
  for (let i = 1; i <= 8; i++) {
    sitemap += `
  <url>
    <loc>${SITE_URL}/podcast/episode-${i}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
    <mobile:mobile/>
  </url>`;
  }

  sitemap += `
</urlset>`;

  return sitemap;
}

export async function GET(request: NextRequest) {
  const sitemap = generateSitemapXML();
  
  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
    },
  });
}
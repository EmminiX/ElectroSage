import { MetadataRoute } from 'next'

const SITE_URL = 'https://electrosage.emmi.zone'

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString()

  // Educational sections
  const educationalSections = [
    'introduction-to-electrical-engineering',
    'atomic-structure-and-fundamentals', 
    'understanding-the-atom',
    'electron-shells-and-valence',
    'electrical-charge-and-interaction',
    'coulombs-law-and-quantification',
    'basic-electrical-units',
    'circuit-fundamentals'
  ]

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
  ]

  // Build sitemap entries
  const sitemapEntries: MetadataRoute.Sitemap = [
    // Main pages
    {
      url: SITE_URL,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/podcast`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/resources`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Add educational sections
  educationalSections.forEach(section => {
    sitemapEntries.push({
      url: `${SITE_URL}/sections/${section}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    })
  })

  // Add visualizations
  visualizations.forEach(viz => {
    sitemapEntries.push({
      url: `${SITE_URL}/visualizations/${viz}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  })

  // Add podcast episodes
  for (let i = 1; i <= 8; i++) {
    sitemapEntries.push({
      url: `${SITE_URL}/podcast/episode-${i}`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.6,
    })
  }

  return sitemapEntries
}
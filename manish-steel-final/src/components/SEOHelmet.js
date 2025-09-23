import { useEffect } from 'react';

const SEOHelmet = ({ 
  title = "Best Furniture in Biratnagar Nepal | Shree Manish Steel Furniture Industry",
  description = "Premium steel furniture manufacturer in Biratnagar, Nepal. Quality office furniture, household furniture, and commercial furniture. Affordable prices, fast delivery across Nepal. Call +977 982-4336371",
  keywords = "steel furniture Nepal, furniture Biratnagar, office furniture Nepal, household furniture, commercial furniture, affordable wood furniture, quality steel ,furniture Nepal, best furniture Biratnagar, steel furniture manufacturer, furniture near me Nepal, quality furniture Nepal,",
  canonical = "",
  type = "website",
  image = "/manish-steel-logo.png"
}) => {
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    }
    
    // Update canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = canonical;
    }
    
    // Update Open Graph tags
    const updateMetaProperty = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    updateMetaProperty('og:title', title);
    updateMetaProperty('og:description', description);
    updateMetaProperty('og:type', type);
    updateMetaProperty('og:image', image);
    updateMetaProperty('og:url', window.location.href);
    
    // Update Twitter Card tags
    const updateTwitterMeta = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    updateTwitterMeta('twitter:title', title);
    updateTwitterMeta('twitter:description', description);
    updateTwitterMeta('twitter:image', image);
    
  }, [title, description, keywords, canonical, type, image]);
  
  return null;
};

export default SEOHelmet;

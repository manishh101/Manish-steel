import { useEffect } from 'react';

const ProductSEO = ({ product }) => {
  useEffect(() => {
    if (!product) return;
    
    // Create product structured data
    const productSchema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "image": product.images?.map(img => img.url) || [],
      "brand": {
        "@type": "Brand",
        "name": "Shree Manish Steel Furniture Industry"
      },
      "manufacturer": {
        "@type": "Organization",
        "name": "Shree Manish Steel Furniture Industry",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Biratnagar",
          "addressLocality": "Biratnagar",
          "addressRegion": "Province 1",
          "postalCode": "56613",
          "addressCountry": "NP"
        }
      },
      "offers": {
        "@type": "Offer",
        "price": product.price || "0",
        "priceCurrency": "NPR",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Shree Manish Steel Furniture Industry"
        }
      },
      "category": product.category?.name || "Furniture",
      "material": "Steel",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "150"
      }
    };
    
    // Remove existing product schema
    const existingSchema = document.querySelector('script[data-type="product-schema"]');
    if (existingSchema) {
      existingSchema.remove();
    }
    
    // Add new product schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-type', 'product-schema');
    script.textContent = JSON.stringify(productSchema);
    document.head.appendChild(script);
    
    // Cleanup function
    return () => {
      const schemaToRemove = document.querySelector('script[data-type="product-schema"]');
      if (schemaToRemove) {
        schemaToRemove.remove();
      }
    };
  }, [product]);
  
  return null;
};

export default ProductSEO;

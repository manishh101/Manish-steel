import React, { useState, useEffect } from 'react';
import { aboutAPI } from '../services/api';
import ScrollAnimator from '../components/ScrollAnimator';
import OptimizedImage from '../components/common/OptimizedImage';

const AboutPage = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Placeholder image for fallback
  const placeholderImage = 'https://via.placeholder.com/600x400/0057A3/FFFFFF?text=About+Us';
  
  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const response = await aboutAPI.getContent();
      console.log('About page API response:', response.data); // Debug log
      if (response.data && response.data.success) {
        console.log('About data received:', response.data.data); // Debug log
        setAboutData(response.data.data);
      } else {
        setError('Failed to fetch about page content');
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
      setError('Error loading content. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAboutData();
  }, [refreshKey]);
  
  return (
    <div className="min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-4 my-10">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button 
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Enhanced Hero Section */}
          <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white py-20 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
            
            <div className="container mx-auto px-4 relative z-10">
              <ScrollAnimator animation="fadeUp">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  {aboutData?.heroTitle || "About Our Company"}
                </h1>
              </ScrollAnimator>
              <ScrollAnimator animation="fadeUp" delay={0.2}>
                <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90">
                  {aboutData?.heroDescription || 
                    "Shree Manish Steel Furnitry Industry is a leading manufacturer of high-quality steel and wooden furniture in Nepal, dedicated to providing durable and stylish solutions for homes and offices."}
                </p>
              </ScrollAnimator>
              
              {/* Temporary debug button - remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <button 
                  onClick={() => setRefreshKey(prev => prev + 1)}
                  className="mt-4 bg-white/20 text-white px-4 py-2 rounded hover:bg-white/30 text-sm"
                >
                  🔄 Refresh Data (Debug)
                </button>
              )}
            </div>
          </section>
          
          {/* Enhanced Company Introduction */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <ScrollAnimator animation="slideInLeft" className="lg:w-1/2">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl transform rotate-3"></div>
                    <OptimizedImage 
                      src={aboutData?.storyImage || placeholderImage} 
                      alt="Our Company" 
                      className="relative rounded-xl shadow-2xl w-full transform -rotate-1 hover:rotate-0 transition-transform duration-500" 
                    />
                  </div>
                </ScrollAnimator>
                
                <ScrollAnimator animation="slideInRight" className="lg:w-1/2">
                  <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      {aboutData?.storyTitle || "Our Story"}
                    </h2>
                    {aboutData?.storyContent ? (
                      aboutData.storyContent.map((paragraph, idx) => (
                        <p key={idx} className="text-gray-600 leading-relaxed text-lg">
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <div className="space-y-6">
                        <p className="text-gray-600 leading-relaxed text-lg">
                          Founded over a decade ago, Shree Manish Steel Furnitry Industry began with a simple mission: to create high-quality, affordable furniture for Nepali homes and businesses. What started as a small workshop has grown into one of the most trusted furniture manufacturers in the region.
                        </p>
                        <p className="text-gray-600 leading-relaxed text-lg">
                          Our journey has been defined by a commitment to craftsmanship, innovation, and customer satisfaction. We take pride in our Nepali heritage and continue to support local communities through employment opportunities and sustainable business practices.
                        </p>
                        <p className="text-gray-600 leading-relaxed text-lg">
                          Today, we offer a comprehensive range of steel and wooden furniture solutions, from household almirahs to complete office setups, all designed with the unique needs of our customers in mind.
                        </p>
                      </div>
                    )}
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-6 pt-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                          {aboutData?.yearsExperience || "10+"}
                        </div>
                        <div className="text-gray-600">Years Experience</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                          {aboutData?.happyCustomers || "1000+"}
                        </div>
                        <div className="text-gray-600">Happy Customers</div>
                      </div>
                    </div>
                  </div>
                </ScrollAnimator>
              </div>
            </div>
          </section>
          
          {/* Enhanced Vision & Mission */}
          <section className="py-20 bg-gradient-to-br from-gray-50 to-primary/5">
            <div className="container mx-auto px-4">
              <ScrollAnimator animation="fadeUp" className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Vision & Mission</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Driving our company forward with clear purpose and unwavering commitment to excellence.
                </p>
              </ScrollAnimator>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Vision */}
                <ScrollAnimator animation="slideInLeft">
                  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {aboutData?.vision || "To be the leading furniture manufacturer in Nepal, recognized for quality, innovation, and customer service. We envision a future where every Nepali home and office is furnished with our durable, stylish, and affordable products."}
                    </p>
                  </div>
                </ScrollAnimator>
                
                {/* Mission */}
                <ScrollAnimator animation="slideInRight">
                  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full">
                    <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {aboutData?.mission || "To create furniture that combines functionality, durability, and aesthetic appeal at competitive prices. We are committed to using quality materials, employing skilled craftsmen, and maintaining high standards of production to deliver products that exceed customer expectations."}
                    </p>
                  </div>
                </ScrollAnimator>
              </div>
            </div>
          </section>
        </>
      )}
      
      
      {/* Enhanced Core Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollAnimator animation="fadeUp" className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and shape our company culture.
            </p>
          </ScrollAnimator>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutData?.coreValues && aboutData.coreValues.length > 0 ? (
              aboutData.coreValues.map((value, idx) => (
                <ScrollAnimator key={idx} animation="fadeUp" delay={idx * 0.1}>
                  <div className="text-center p-6 group hover:bg-gray-50 rounded-2xl transition-colors duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </ScrollAnimator>
              ))
            ) : (
              // Enhanced default values
              <>
                {/* Quality */}
                <ScrollAnimator animation="fadeUp" delay={0}>
                  <div className="text-center p-6 group hover:bg-gray-50 rounded-2xl transition-colors duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Quality</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We never compromise on the quality of our materials or craftsmanship, ensuring products that last for generations.
                    </p>
                  </div>
                </ScrollAnimator>
                
                {/* Innovation */}
                <ScrollAnimator animation="fadeUp" delay={0.1}>
                  <div className="text-center p-6 group hover:bg-gray-50 rounded-2xl transition-colors duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We continuously explore new designs, technologies, and processes to improve our products and meet evolving customer needs.
                    </p>
                  </div>
                </ScrollAnimator>
                
                {/* Integrity */}
                <ScrollAnimator animation="fadeUp" delay={0.2}>
                  <div className="text-center p-6 group hover:bg-gray-50 rounded-2xl transition-colors duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Integrity</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We conduct our business with honesty, transparency, and ethical practices, building trust with customers, employees, and partners.
                    </p>
                  </div>
                </ScrollAnimator>
                
                {/* Customer Focus */}
                <ScrollAnimator animation="fadeUp" delay={0.3}>
                  <div className="text-center p-6 group hover:bg-gray-50 rounded-2xl transition-colors duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Customer Focus</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We prioritize customer satisfaction by listening to feedback, providing excellent service, and creating products that meet real needs.
                    </p>
                  </div>
                </ScrollAnimator>
              </>
            )}
          </div>
        </div>
      </section>
      
      {/* Enhanced Workshop & Team Photos */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-gray-50">
        <div className="container mx-auto px-4">
          <ScrollAnimator animation="fadeUp" className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {aboutData?.workshopTitle || "Our Workshop & Team"}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              {aboutData?.workshopDescription || 
                "Take a glimpse into our production facility and meet the skilled craftsmen behind our quality furniture."}
            </p>
          </ScrollAnimator>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {aboutData?.workshopImages && aboutData.workshopImages.length > 0 ? (
              aboutData.workshopImages.map((image, idx) => (
                <ScrollAnimator key={idx} animation="fadeUp" delay={idx * 0.1}>
                  <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <OptimizedImage 
                      src={image} 
                      alt={`Workshop and Team ${idx + 1}`} 
                      className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <p className="text-sm font-medium">Workshop & Team</p>
                    </div>
                  </div>
                </ScrollAnimator>
              ))
            ) : (
              // Enhanced default placeholders
              [1, 2, 3, 4, 5, 6].map((item) => (
                <ScrollAnimator key={item} animation="fadeUp" delay={item * 0.1}>
                  <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <OptimizedImage 
                      src={placeholderImage} 
                      alt={`Workshop and Team ${item}`} 
                      className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <p className="text-sm font-medium">Workshop & Team</p>
                    </div>
                  </div>
                </ScrollAnimator>
              ))
            )}
          </div>
          
          {/* Call to Action */}
          <ScrollAnimator animation="fadeUp" className="text-center mt-16">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Work With Us?</h3>
              <p className="text-gray-600 mb-6">
                Experience the quality and craftsmanship that sets us apart. Contact us today to discuss your furniture needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact" 
                  className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Contact Us
                </a>
                <a 
                  href="/products" 
                  className="border border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary hover:text-white transition-colors font-medium"
                >
                  View Products
                </a>
              </div>
            </div>
          </ScrollAnimator>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon,
  PhoneIcon, 
  XMarkIcon,
  MapPinIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import './FloatingContactWidget.css';

// Professional WhatsApp SVG Icon
const WhatsAppIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63"/>
  </svg>
);

// Professional Viber SVG Icon
const ViberIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm4.52 7.01l-1.93.61c-.15.05-.29.1-.43.18-.69.4-1.26.94-1.67 1.58-.18.29-.34.6-.46.93-.12.33-.18.68-.18 1.04 0 .36.06.71.18 1.04.29.82.81 1.54 1.49 2.08.34.27.72.48 1.12.63.2.07.4.12.61.15.21.03.42.04.63.04.84 0 1.64-.32 2.24-.89.3-.29.54-.63.71-1.01.17-.38.26-.78.26-1.19 0-.31-.05-.61-.16-.9-.22-.58-.62-1.08-1.15-1.43-.53-.35-1.15-.54-1.78-.54-.32 0-.63.06-.93.17z"/>
  </svg>
);

const FloatingContactWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    {
      name: 'WhatsApp',
      icon: <WhatsAppIcon />,
      color: 'bg-[#25D366] hover:bg-[#1DA851] shadow-green-200',
      action: () => window.open('https://wa.me/9779824336371?text=Hello! I am interested in your premium steel furniture products from Manish Steel. Could you please provide more information about your catalog and pricing?', '_blank'),
      label: 'Chat on WhatsApp',
      description: 'Instant messaging support'
    },
    {
      name: 'Call Us',
      icon: <PhoneIcon className="w-5 h-5" />,
      color: 'bg-[#0066CC] hover:bg-[#0052A3] shadow-blue-200',
      action: () => window.open('tel:+9779824336371', '_self'),
      label: 'Call Now',
      description: 'Speak with our experts'
    },
    {
      name: 'Viber',
      icon: <ViberIcon />,
      color: 'bg-[#665CAC] hover:bg-[#574B8C] shadow-purple-200',
      action: () => window.open('viber://chat?number=9779824336371', '_self'),
      label: 'Chat on Viber',
      description: 'Secure messaging'
    },
    {
      name: 'Location',
      icon: <MapPinIcon className="w-5 h-5" />,
      color: 'bg-[#FF6B35] hover:bg-[#E85A2B] shadow-orange-200',
      action: () => window.open('https://www.google.com/maps/dir/?api=1&destination=Dharan%20Rd%2C%20Biratnagar%2056613%2C%20Nepal', '_blank'),
      label: 'Visit Our Showroom',
      description: 'Find our location'
    },
    {
      name: 'Catalog',
      icon: <BuildingOffice2Icon className="w-5 h-5" />,
      color: 'bg-[#6366F1] hover:bg-[#5B5BD6] shadow-indigo-200',
      action: () => {
        // Navigate to products page
        window.location.href = '/products';
      },
      label: 'Browse Catalog',
      description: 'View our products'
    }
  ];

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="floating-contact-widget fixed md:bottom-6 bottom-40 right-6 md:z-50 z-[60]">
      {/* Contact Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute md:bottom-20 bottom-32 right-0 flex flex-col space-y-3 mb-4"
          >
            {contactOptions.map((option, index) => (
              <motion.button
                key={option.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.08, type: "spring", stiffness: 300 }}
                onClick={option.action}
                className={`${option.color} text-white p-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 flex items-center justify-center group relative backdrop-blur-sm border border-white/20`}
                title={option.label}
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)'
                }}
              >
                {typeof option.icon === 'string' ? (
                  <span className="text-xl font-medium">{option.icon}</span>
                ) : (
                  <div className="flex items-center justify-center">
                    {option.icon}
                  </div>
                )}
                
                {/* Enhanced Tooltip */}
                <div className="absolute right-full mr-4 bg-white/95 backdrop-blur-sm text-gray-800 text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none border border-gray-200 shadow-xl">
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{option.description}</div>
                  <div className="absolute top-1/2 left-full transform -translate-y-1/2 border-4 border-transparent border-l-white/95"></div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        onClick={toggleWidget}
        className={`w-16 h-16 md:w-16 md:h-16 w-20 h-20 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-500 transform hover:scale-110 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ 
          scale: 0.9,
          rotate: isOpen ? -360 : 360 // 1 complete turn on tap
        }}
        initial={{ scale: 0, rotate: 0 }}
        animate={{ 
          scale: 1, 
          rotate: isOpen ? 360 : 0, // 360° rotation (1 complete turn)
          transition: {
            type: "tween",
            ease: "linear",
            duration: 0.3
          }
        }}
        style={{
          boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4), 0 8px 16px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full"></div>
        
        <motion.div
          className="relative z-10"
        >
          {isOpen ? (
            <XMarkIcon className="w-8 h-8 md:w-8 md:h-8 w-10 h-10" />
          ) : (
            <div className="relative">
              <ChatBubbleLeftRightIcon className="w-8 h-8 md:w-8 md:h-8 w-10 h-10" />
              {/* Pulse ring animation */}
              <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border border-white/20 animate-pulse"></div>
            </div>
          )}
        </motion.div>
      </motion.button>

      {/* Contact Us Label - Hidden on mobile */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute md:right-20 right-28 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm text-gray-800 text-sm px-4 py-2 rounded-xl shadow-xl border border-gray-200 whitespace-nowrap pointer-events-none hidden md:block"
          >
            <div className="font-medium text-gray-900">Contact Us</div>
            <div className="text-xs text-gray-600">We're here to help!</div>
            <div className="absolute top-1/2 left-full transform -translate-y-1/2 border-4 border-transparent border-l-white/95"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating particles effect */}
      {!isOpen && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
              animate={{
                y: [-20, -40, -20],
                x: [-10 + i * 10, 10 - i * 10, -10 + i * 10],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
              style={{
                left: `${30 + i * 20}%`,
                top: '20%',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FloatingContactWidget;

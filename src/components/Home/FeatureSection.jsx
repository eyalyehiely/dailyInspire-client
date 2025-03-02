import React from 'react';
import { Quote, Bell, Zap, Heart } from 'lucide-react';

const features = [
  {
    name: 'Daily Inspiration',
    description:
      'Receive a new inspirational quote every morning to start your day with positivity and motivation.',
    icon: Quote,
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
  },
  {
    name: 'Customizable Notifications',
    description:
      'Choose when you want to receive your daily quote. Set it for your morning routine or any time that works for you.',
    icon: Bell,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    name: 'Instant Mood Boost',
    description:
      'Feeling down? Access our quote library anytime for an instant dose of inspiration and encouragement.',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-50',
  },
  {
    name: 'Save Favorites',
    description:
      'Save your favorite quotes to revisit them whenever you need that specific piece of wisdom.',
    icon: Heart,
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
  },
];

const FeatureSection = () => {
  return (
    <div id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to start your day
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our platform delivers more than just quotes - it provides daily motivation, wisdom, and positivity.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {features.map((feature) => (
              <div 
                key={feature.name} 
                className={`${feature.bgColor} rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 rounded-md bg-gradient-to-r ${feature.color} p-3 text-white shadow-lg`}>
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="ml-4 text-xl font-bold text-gray-900">{feature.name}</h3>
                  </div>
                  <p className="mt-4 text-base text-gray-600">{feature.description}</p>
                  
                  <div className="mt-6">
                    <a href="#" className={`inline-flex items-center text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r ${feature.color}`}>
                      Learn more
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
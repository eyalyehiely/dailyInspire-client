import React from "react";
import Layout from "../General/Layout";
import {
  Users,
  Heart,
  Globe,
  Award,
  BookOpen,
  MessageCircle,
} from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-xl overflow-hidden mb-12">
          <div className="px-6 py-12 sm:px-12 sm:py-16 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              About DailyInspire
            </h1>
            <p className="text-lg text-indigo-100 max-w-3xl mx-auto">
              We're on a mission to bring daily motivation and inspiration into
              people's lives, one quote at a time.
            </p>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="bg-white shadow-md rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Our Story
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-700 mb-4">
                DailyInspire was founded in 2023 with a simple idea: everyone
                deserves a moment of inspiration each day. What started as a
                personal project quickly grew into a platform helping thousands
                find daily motivation.
              </p>
              <p className="text-gray-700 mb-4">
                Our team of curators searches for meaningful quotes from diverse
                sources - from ancient philosophers to modern thought leaders,
                ensuring you receive thoughtful content that resonates with your
                day.
              </p>
              <p className="text-gray-700">
                We believe that a positive thought at the right moment can
                change the trajectory of your day, and sometimes, even your
                life. That's why we're committed to delivering inspiration
                tailored to your preferences, right when you need it most.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Team meeting"
                className="rounded-lg shadow-md max-h-80 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="bg-white shadow-md rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border border-gray-100 rounded-lg shadow-sm bg-gradient-to-br from-indigo-50 to-white">
              <div className="flex items-center mb-4">
                <Heart className="h-6 w-6 text-indigo-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Empathy</h3>
              </div>
              <p className="text-gray-700">
                We understand that everyone's journey is unique, and we strive
                to provide content that speaks to diverse experiences and
                perspectives.
              </p>
            </div>

            <div className="p-6 border border-gray-100 rounded-lg shadow-sm bg-gradient-to-br from-indigo-50 to-white">
              <div className="flex items-center mb-4">
                <Award className="h-6 w-6 text-indigo-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Quality</h3>
              </div>
              <p className="text-gray-700">
                We carefully curate our quotes to ensure they provide meaningful
                value, avoiding clichés and prioritizing authentic wisdom.
              </p>
            </div>

            <div className="p-6 border border-gray-100 rounded-lg shadow-sm bg-gradient-to-br from-indigo-50 to-white">
              <div className="flex items-center mb-4">
                <Globe className="h-6 w-6 text-indigo-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Diversity
                </h3>
              </div>
              <p className="text-gray-700">
                We source inspiration from cultures and thinkers across the
                globe, ensuring a rich variety of perspectives.
              </p>
            </div>

            <div className="p-6 border border-gray-100 rounded-lg shadow-sm bg-gradient-to-br from-indigo-50 to-white">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-indigo-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Community
                </h3>
              </div>
              <p className="text-gray-700">
                We're building a community of like-minded individuals who share
                and discuss ideas that inspire positive change.
              </p>
            </div>

            <div className="p-6 border border-gray-100 rounded-lg shadow-sm bg-gradient-to-br from-indigo-50 to-white">
              <div className="flex items-center mb-4">
                <BookOpen className="h-6 w-6 text-indigo-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Growth</h3>
              </div>
              <p className="text-gray-700">
                We believe in continuous learning and self-improvement, and our
                service is designed to support your personal growth journey.
              </p>
            </div>

            <div className="p-6 border border-gray-100 rounded-lg shadow-sm bg-gradient-to-br from-indigo-50 to-white">
              <div className="flex items-center mb-4">
                <MessageCircle className="h-6 w-6 text-indigo-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Feedback
                </h3>
              </div>
              <p className="text-gray-700">
                We actively listen to our users and continuously improve our
                platform based on your suggestions and needs.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80"
                  alt="Team member"
                  className="w-32 h-32 rounded-full mx-auto object-cover shadow-md"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                David Cohen
              </h3>
              <p className="text-indigo-600">Founder & CEO</p>
              <p className="text-gray-600 mt-2">
                Passionate about personal development and the power of positive
                thinking.
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80"
                  alt="Team member"
                  className="w-32 h-32 rounded-full mx-auto object-cover shadow-md"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Sarah Johnson
              </h3>
              <p className="text-indigo-600">Content Curator</p>
              <p className="text-gray-600 mt-2">
                Literature enthusiast with a knack for finding the perfect quote
                for any occasion.
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80"
                  alt="Team member"
                  className="w-32 h-32 rounded-full mx-auto object-cover shadow-md"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Michael Chen
              </h3>
              <p className="text-indigo-600">Lead Developer</p>
              <p className="text-gray-600 mt-2">
                Tech enthusiast committed to creating seamless, user-friendly
                experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;

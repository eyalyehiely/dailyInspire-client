import React from "react";
import Layout from "../General/Layout";
import { Calendar, Clock, Tag, ArrowRight } from "lucide-react";

const Blog = () => {
  // Mock blog post data
  const blogPosts = [
    {
      id: 1,
      title: "5 Ways Daily Quotes Can Boost Your Mental Health",
      excerpt:
        "Discover how incorporating inspirational quotes into your daily routine can have a significant positive impact on your mental wellbeing.",
      date: "August 15, 2023",
      author: "Sarah Johnson",
      category: "Mental Health",
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "The Science Behind Positive Affirmations",
      excerpt:
        "Learn about the psychological research behind positive affirmations and how they can reshape your thinking patterns over time.",
      date: "July 28, 2023",
      author: "Dr. Michael Chen",
      category: "Psychology",
      readTime: "8 min read",
      image:
        "https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Creating a Morning Routine That Sets You Up For Success",
      excerpt:
        "Explore how starting your day with intention and inspiration can lead to increased productivity and a more positive outlook.",
      date: "July 10, 2023",
      author: "David Cohen",
      category: "Productivity",
      readTime: "6 min read",
      image:
        "https://images.unsplash.com/photo-1484627147104-f5197bcd6651?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      title: "Finding Wisdom in Ancient Philosophies",
      excerpt:
        "Discover how ancient philosophical teachings from around the world can provide relevant guidance for modern challenges.",
      date: "June 22, 2023",
      author: "Emma Rodriguez",
      category: "Philosophy",
      readTime: "7 min read",
      image:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      title: "How to Personalize Your Inspirational Content",
      excerpt:
        "Tips and strategies for customizing the motivational content you consume to make it more relevant and impactful for your specific goals.",
      date: "June 5, 2023",
      author: "James Wilson",
      category: "Personal Growth",
      readTime: "4 min read",
      image:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
      title: "Overcoming Challenges: Stories of Resilience",
      excerpt:
        "Real-life stories of individuals who used daily inspiration to overcome significant challenges and transform their lives.",
      date: "May 19, 2023",
      author: "Olivia Taylor",
      category: "Inspiration",
      readTime: "9 min read",
      image:
        "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
  ];

  // Categories for the filter
  const categories = [
    "All",
    "Mental Health",
    "Psychology",
    "Productivity",
    "Philosophy",
    "Personal Growth",
    "Inspiration",
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Blog Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-xl overflow-hidden mb-12">
          <div className="px-6 py-12 sm:px-12 sm:py-16 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The DailyInspire Blog
            </h1>
            <p className="text-lg text-indigo-100 max-w-3xl mx-auto">
              Thoughts, stories, and ideas to help you live more intentionally
              and find daily inspiration.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  category === "All"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
                } transition-colors duration-200`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-12">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/2">
              <img
                className="h-96 w-full object-cover"
                src="https://images.unsplash.com/photo-1472437774355-71ab6752b434?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                alt="Featured blog post"
              />
            </div>
            <div className="p-8 md:w-1/2">
              <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold">
                Featured Post
              </div>
              <h2 className="mt-2 text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors duration-200">
                <a href="#" className="block">
                  The Power of Daily Inspiration: Transform Your Life One Quote
                  at a Time
                </a>
              </h2>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>September 2, 2023</span>
                <span className="mx-2">•</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>10 min read</span>
              </div>
              <p className="mt-4 text-gray-600">
                In this comprehensive guide, we explore how consistent exposure
                to meaningful inspiration can gradually reshape your mindset,
                habits, and ultimately your life. Drawing from psychological
                research and real-life success stories, we provide actionable
                steps to harness the transformative power of daily inspiration.
              </p>
              <div className="mt-6">
                <a
                  href="#"
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Read full article
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <img
                className="h-48 w-full object-cover"
                src={post.image}
                alt={post.title}
              />
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <Tag className="h-4 w-4 text-indigo-600 mr-1" />
                  <span className="text-xs font-medium text-indigo-600">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors duration-200">
                  <a href="#" className="block">
                    {post.title}
                  </a>
                </h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{post.readTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    By {post.author}
                  </span>
                  <a
                    href="#"
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center"
                  >
                    Read more
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <nav className="inline-flex shadow-sm rounded-md">
            <a
              href="#"
              className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-l-md"
            >
              Previous
            </a>
            <a
              href="#"
              className="px-4 py-2 border-t border-b border-gray-300 bg-indigo-600 text-sm font-medium text-white"
            >
              1
            </a>
            <a
              href="#"
              className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              2
            </a>
            <a
              href="#"
              className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              3
            </a>
            <a
              href="#"
              className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-r-md"
            >
              Next
            </a>
          </nav>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-xl overflow-hidden p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-indigo-100 mb-6">
              Get the latest articles, inspiration, and updates delivered
              directly to your inbox.
            </p>
            <form className="sm:flex justify-center">
              <div className="w-full sm:max-w-xs">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 border border-white rounded-l-md focus:ring-2 focus:ring-white focus:border-white sm:text-sm"
                />
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <button
                  type="submit"
                  className="w-full bg-white px-4 py-3 border border-transparent rounded-r-md font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white sm:text-sm"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;

import React from "react";

const testimonials = [
  {
    content:
      "Starting my day with these inspirational quotes has completely changed my outlook. I feel more motivated and positive throughout the day.",
    author: "Sarah Johnson",
    role: "Marketing Executive",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    color: "from-pink-400 to-pink-500",
  },
  {
    content:
      "As a teacher, I share the daily quote with my students every morning. It's become a ritual we all look forward to and sets a positive tone for learning.",
    author: "Michael Chen",
    role: "High School Teacher",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    color: "from-purple-400 to-purple-500",
  },
  {
    content:
      "The quotes I receive are always relevant and thought-provoking. It's like the app knows exactly what I need to hear each day.",
    author: "Emma Rodriguez",
    role: "Freelance Designer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    color: "from-indigo-400 to-indigo-500",
  },
];

const TestimonialSection = () => {
  return (
    <section
      id="testimonials"
      className="py-12 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
              What our users are saying
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Join thousands of people who have transformed their daily routine
              with our inspirational quotes.
            </p>
          </div>
          <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.author}
                className="flex flex-col rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div
                  className={`flex-1 bg-white p-6 flex flex-col justify-between border-t-4 bg-gradient-to-r ${testimonial.color}`}
                >
                  <div className="flex-1">
                    <div className="block mt-2">
                      <p className="text-xl font-semibold text-gray-900">
                        "{testimonial.content}"
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full ring-2 ring-indigo-500"
                        src={testimonial.image}
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {testimonial.author}
                      </p>
                      <div className="flex space-x-1 text-sm text-gray-800">
                        <p>{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;

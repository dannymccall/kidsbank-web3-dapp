import React from 'react'

const EmailTemplate = () => {
  return (
    <section className="py-12 px-6 md:px-12 lg:px-24 w-full">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-semibold text-center  mb-6 text-[rgb(90,191,249)]">
          Contact Us
        </h2>
        <form className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="mt-1 w-full p-3 border-2 border-gray-400 rounded-lg focus:outline-none  focus:border-blue-200 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-1 w-full p-3 border-2 border-gray-400 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none  focus:border-blue-200"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              placeholder="Write your message..."
              rows={4}
              className="mt-1 w-full p-3 border-2 border-gray-400 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none  focus:border-blue-200"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-[rgb(90,191,249)] text-white py-2 px-6 rounded-lg hover:bg-blue-700  cursor-pointer transition-all duration-300"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default EmailTemplate

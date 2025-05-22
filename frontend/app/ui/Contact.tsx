import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactUs() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl  p-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Contact Us</h2>
        <p className="text-gray-600 text-center mb-8">
          Have any questions? Reach out to us using the details below!
        </p>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <FaPhone className="text-blue-600 text-2xl" />
            <p className="text-gray-700 text-lg">+233 50 4243 525</p>
          </div>

          <div className="flex items-center space-x-4">
            <FaEnvelope className="text-blue-600 text-2xl" />
            <p className="text-gray-700 text-lg">danielpalmer419@gmail.com</p>
          </div>

          <div className="flex items-center space-x-4">
            <FaMapMarkerAlt className="text-blue-600 text-2xl" />
            <p className="text-gray-700 text-lg">Sampa Valley, Off Kasoa Road</p>
          </div>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Your Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Your Message</label>
            <textarea
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Type your message..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[rgb(90,191,249)] text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

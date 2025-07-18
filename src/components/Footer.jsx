import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className=" left-0 right-0 bg-white text-gray-800 py-10 px-6 md:px-20 shadow-inner z-50">
      <div className="max-w-6xl mx-auto">

        {/* Social Icons */}
        <div className="flex justify-center space-x-6 mb-6">
          <button className="text-gray-800 hover:text-blue-600 text-xl transition-all duration-300" aria-label="Facebook">
            <FaFacebookF />
          </button>
          <button className="text-gray-800 hover:text-pink-500 text-xl transition-all duration-300" aria-label="Instagram">
            <FaInstagram />
          </button>
          <button className="text-gray-800 hover:text-blue-400 text-xl transition-all duration-300" aria-label="Twitter">
            <FaTwitter />
          </button>
          <button className="text-gray-800 hover:text-red-600 text-xl transition-all duration-300" aria-label="YouTube">
            <FaYoutube />
          </button>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-sm text-center">
          <ul className="space-y-3">
            <li><Link to="/terms-and-conditions" className="hover:underline">Terms and Conditions</Link></li>
            <li><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link to="/contact-us" className="hover:underline">Contact Us</Link></li>
          </ul>

          <ul className="space-y-3">
            <li><Link to="/cancellation-and-refund-policy" className="hover:underline">Cancellation</Link></li>
            <li><Link to="/shipping-and-delivery-policy" className="hover:underline">Shipping</Link></li>
          <li><Link to="/media-centre" className="hover:underline">Media Centre</Link></li>
          </ul>


          <ul className="space-y-3">
            <li><Link to="/cancellation-and-refund-policy" className="hover:underline">Refund Policy</Link></li>
            <li><Link to="/media-centre" className="hover:underline">Media Centre</Link></li>
            <li><Link to="/shipping-and-delivery-policy" className="hover:underline">Delivery Policy</Link></li>
          </ul>
                    <ul className="space-y-3">
            <li><Link to="/terms-and-conditions" className="hover:underline">Terms and Conditions</Link></li>
            <li><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link to="/contact-us" className="hover:underline">Contact Us</Link></li>
          </ul>

        </div>

        {/* Service Code Button */}
        <div className="mt-6 flex justify-center">
          <button className="border border-gray-800 text-gray-800 py-2 px-4 text-sm hover:bg-gray-700 hover:text-white transition-all duration-300">
            Service Code
          </button>
        </div>

        {/* Copyright */}
        <div className="text-center mt-6 text-xs text-gray-800">
          © 2025 codeConnect. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;

import { Link } from "wouter";

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-500 text-sm">
            © {year} Employee Management System. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-6">
              <Link href="/privacy">
                <span className="text-gray-500 hover:text-primary cursor-pointer">
                  Privacy Policy
                </span>
              </Link>
              <Link href="/terms">
                <span className="text-gray-500 hover:text-primary cursor-pointer">
                  Terms of Service
                </span>
              </Link>
              <Link href="/contact">
                <span className="text-gray-500 hover:text-primary cursor-pointer">
                  Contact Us
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

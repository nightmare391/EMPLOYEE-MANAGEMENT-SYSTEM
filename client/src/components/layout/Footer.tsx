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
                <a className="text-gray-500 hover:text-primary">
                  Privacy Policy
                </a>
              </Link>
              <Link href="/terms">
                <a className="text-gray-500 hover:text-primary">
                  Terms of Service
                </a>
              </Link>
              <Link href="/contact">
                <a className="text-gray-500 hover:text-primary">
                  Contact Us
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

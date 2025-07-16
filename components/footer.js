import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const Footer = () => {
  const { data: session } = useSession()
  return (
    <div>
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                TicketVault
                </h3>
                <p className="text-slate-400">
                Your trusted marketplace for buying and selling event tickets safely and securely.
                </p>
            </div>
            <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-slate-400">
                <li>
                    <Link href="/events" className="hover:text-white transition-colors">
                    Browse Events
                    </Link>
                </li>
                {session && (
                    <li>
                    <Link href="/sell" className="hover:text-white transition-colors">
                        Sell Tickets
                    </Link>
                    </li>
                )}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-slate-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Safety Tips</li>
                </ul>
            </div>
            <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-slate-400">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Cookie Policy</li>
                </ul>
            </div>
            </div>
            <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 TicketVault. All rights reserved.</p>
            </div>
        </div>
        </footer>
    </div>
  )
}

export default Footer





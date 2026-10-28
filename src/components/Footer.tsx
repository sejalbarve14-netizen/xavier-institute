import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo light />
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              A premier institution committed to academic excellence, innovation, and shaping
              future leaders in engineering and management since 1988.
            </p>
            <div className="mt-5 flex gap-3">
              {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-colors hover:bg-brand-600 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/courses', label: 'Courses' },
                { to: '/admissions', label: 'Admissions' },
                { to: '/faculty', label: 'Faculty' },
                { to: '/notices', label: 'Notices' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-slate-400 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Departments</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {['Computer Science', 'Electronics & Comm.', 'Mechanical Eng.', 'Civil Eng.', 'Business Admin.'].map((d) => (
                <li key={d}>
                  <Link to="/departments" className="text-slate-400 transition-colors hover:text-white">
                    {d}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
                <span className="text-slate-400">123 Education City Road, Knowledge Park, New Delhi - 110001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-brand-400" />
                <span className="text-slate-400">+91 11 2345 6789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-brand-400" />
                <span className="text-slate-400">info@stxavier.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} St. Xavier's Institute of Technology. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

import {
  Home,
  ShoppingCart,
  HelpCircle,
  User,
  ListCheck
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Ordered', path: '/ordered', icon: ShoppingCart },
  { label: 'Help Center', path: '/help-center', icon: HelpCircle },
  { label: 'Scraps', path: '/order-status', icon: ListCheck, },
  { label: 'You', path: '/profile', icon: User },
];

const ResponsiveNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Nav for Large Devices */}
      <nav className="hidden md:flex justify-between text-lg items-center py-4 px-16 xl:px-30 bg-white shadow border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
        {navItems.map(({ label, path, icon: Icon }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex items-center gap-2 text-base font-semibold transition ${
              isActive(path)
                ? 'text-green-600 border-b-2 border-green-600 pb-1'
                : 'text-gray-700 hover:text-green-500'
            }`}
          >
            <Icon size={20} />
            <span className="hidden md:inline">{label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-inner">
        <div className="flex justify-between px-2">
          {navItems.map(({ label, path, icon: Icon, isCenter }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center py-2 flex-1 transition ${
                isCenter ? 'relative -mt-4' : ''
              } ${isActive(path) ? 'text-green-600' : 'text-gray-600 hover:text-green-500'}`}
            >
              <Icon size={isCenter ? 36 : 22} />
              {!isCenter && (
                <span className="text-[11px]">{label}</span>
              )}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default ResponsiveNavBar;

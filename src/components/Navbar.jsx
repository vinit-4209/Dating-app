// import { Heart } from 'lucide-react';
// import { useEffect, useMemo, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// export default function Navbar({ hideAuthButtons = false }) {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isAuthenticated, setIsAuthenticated] = useState(() => {
//     return typeof localStorage !== 'undefined' && !!localStorage.getItem('authToken');
//   });

//   useEffect(() => {
//     const syncAuth = () => {
//       setIsAuthenticated(typeof localStorage !== 'undefined' && !!localStorage.getItem('authToken'));
//     };

//     window.addEventListener('storage', syncAuth);
//     return () => window.removeEventListener('storage', syncAuth);
//   }, []);

//   useEffect(() => {
//     setIsAuthenticated(typeof localStorage !== 'undefined' && !!localStorage.getItem('authToken'));
//   }, [location.pathname]);

//   const isActive = (link) => {
//     if (link.hash) {
//       return location.pathname === link.to && location.hash === link.hash;
//     }
//     return location.pathname === link.to;
//   };

//   const links = useMemo(() => {
//     const publicLinks = [
//       { to: '/', label: 'Home' },
//       { to: '/', label: 'Features', hash: '#features' },
//       { to: '/', label: 'How It Works', hash: '#how-it-works' }
//     ];

//     if (!isAuthenticated) {
//       return publicLinks;
//     }

//     return [
//       ...publicLinks,
//       { to: '/discover', label: 'Discover' },
//       { to: '/create-profile', label: 'Create Profile' },
//       { to: '/chat', label: 'Chat' },
//       { to: '/profile', label: 'My Profile' }
//     ];
//   }, [isAuthenticated]);

//   const handleNavClick = (link) => {
//     if (link.hash) {
//       if (location.pathname === link.to) {
//         const target = document.querySelector(link.hash);
//         if (target) {
//           target.scrollIntoView({ behavior: 'smooth' });
//         }
//       } else {
//         navigate(`${link.to}${link.hash}`);
//       }
//       return;
//     }

//     navigate(link.to);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     setIsAuthenticated(false);
//     navigate('/auth?mode=login');
//   };

//   const links = useMemo(() => {
//     const publicLinks = [
//       { to: '/', label: 'Home' },
//       { to: '/discover', label: 'Discover' }
//     ];

//     if (!isAuthenticated) {
//       return publicLinks;
//     }

//     return [
//       ...publicLinks,
//       { to: '/create-profile', label: 'Create Profile' },
//       { to: '/chat', label: 'Chat' },
//       { to: '/profile', label: 'My Profile' }
//     ];
//   }, [isAuthenticated]);

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     setIsAuthenticated(false);
//     navigate('/auth?mode=login');
//   };

//   return (
//     <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-lg z-50 border-b border-pink-50 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
//         <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
//           <Heart className="w-7 h-7 text-pink-500 group-hover:scale-110 transition-transform" />
//           <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
//             LoveConnect
//           </span>
//         </button>

//         <div className="flex items-center gap-3 md:gap-8">
//           <div className="hidden md:flex items-center gap-6">
//             {links.map((link) => (
//               <button
//                 key={link.to}
//                 onClick={() => handleNavClick(link)}
//                 className={`text-sm font-semibold transition-colors ${
//                   isActive(link) ? 'text-pink-600' : 'text-gray-600 hover:text-pink-500'
//                 }`}
//               >
//                 {link.label}
//               </button>
//             ))}
//           </div>

//           {!hideAuthButtons && (
//             <div className="flex items-center gap-3">
//               {isAuthenticated ? (
//                 <button
//                   onClick={handleLogout}
//                   className="px-4 py-2 text-sm font-semibold text-pink-600 hover:text-pink-700"
//                 >
//                   Log out
//                 </button>
//               ) : (
//                 <>
//                   <button
//                     onClick={() => navigate('/auth?mode=login')}
//                     className="px-4 py-2 text-sm font-semibold text-pink-600 hover:text-pink-700"
//                   >
//                     Log in
//                   </button>
//                   <button
//                     onClick={() => navigate('/auth?mode=signup')}
//                     className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg"
//                   >
//                     Sign up
//                   </button>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }


import { Heart } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Navbar({ hideAuthButtons = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return typeof localStorage !== 'undefined' && !!localStorage.getItem('authToken');
  });
  const [hasProfile, setHasProfile] = useState(() => {
    return typeof localStorage !== 'undefined' && localStorage.getItem('profileComplete') === 'true';
  });

  useEffect(() => {
    const syncAuth = () => {
      setIsAuthenticated(typeof localStorage !== 'undefined' && !!localStorage.getItem('authToken'));
      setHasProfile(typeof localStorage !== 'undefined' && localStorage.getItem('profileComplete') === 'true');
    };

    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  useEffect(() => {
    setIsAuthenticated(typeof localStorage !== 'undefined' && !!localStorage.getItem('authToken'));
    setHasProfile(typeof localStorage !== 'undefined' && localStorage.getItem('profileComplete') === 'true');
  }, [location.pathname]);

  const isActive = (link) => {
    if (link.hash) {
      return location.pathname === link.to && location.hash === link.hash;
    }
    return location.pathname === link.to;
  };

  // ✅ SINGLE links declaration
  const links = useMemo(() => {
    const publicLinks = [
      { to: '/', label: 'Home' },
      { to: '/', label: 'Features', hash: '#features' },
      { to: '/', label: 'How It Works', hash: '#how-it-works' }
    ];

    if (!isAuthenticated) {
      return publicLinks;
    }

    if (!hasProfile) {
      return [...publicLinks, { to: '/create-profile', label: 'Create Profile' }];
    }

    return [
      ...publicLinks,
      { to: '/discover', label: 'Discover' },
      { to: '/chat', label: 'Chat' },
      { to: '/profile', label: 'My Profile' }
    ];
  }, [hasProfile, isAuthenticated]);

  const handleNavClick = (link) => {
    if (link.hash) {
      if (location.pathname === link.to) {
        const target = document.querySelector(link.hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate(`${link.to}${link.hash}`);
      }
      return;
    }

    navigate(link.to);
  };

  // ✅ SINGLE handleLogout declaration
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('profileComplete');
    localStorage.removeItem('profileData');
    setIsAuthenticated(false);
    setHasProfile(false);
    navigate('/auth?mode=login');
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-lg z-50 border-b border-pink-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
          <Heart className="w-7 h-7 text-pink-500 group-hover:scale-110 transition-transform" />
          <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            LoveConnect
          </span>
        </button>

        <div className="flex items-center gap-3 md:gap-8">
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <button
                key={`${link.to}${link.hash ?? ''}`}
                onClick={() => handleNavClick(link)}
                className={`text-sm font-semibold transition-colors ${
                  isActive(link) ? 'text-pink-600' : 'text-gray-600 hover:text-pink-500'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {!hideAuthButtons && (
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold text-pink-600 hover:text-pink-700"
                >
                  Log out
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/auth?mode=login')}
                    className="px-4 py-2 text-sm font-semibold text-pink-600 hover:text-pink-700"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => navigate('/auth?mode=signup')}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

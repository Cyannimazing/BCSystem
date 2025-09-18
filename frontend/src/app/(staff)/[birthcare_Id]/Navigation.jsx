"use client";

import { useState, useEffect } from "react";
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/auth.jsx";
import { Menu, X } from "lucide-react";
import IconLogo from "@/components/IconLogo.jsx";

const Navigation = ({ user }) => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { birthcare_Id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
      if (window.innerWidth >= 1024) {
        setIsOpen(true); // Sidebar always open at lg and above
      } else {
        setIsOpen(false); // Sidebar closed by default on mobile
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = () => {
    if (isMobile) setIsOpen(false); // Close sidebar on link click in mobile view
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleSubMenu = (itemLabel) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [itemLabel]: !prev[itemLabel]
    }));
  };

  // Define all navigation links with required permissions
  const allNavLinks = [
    {
      href: `/${birthcare_Id}/dashboard`,
      label: "Dashboard",
      permission: null,
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      href: `/${birthcare_Id}/patients`,
      label: "Patient",
      permission: "manage_appointment",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      hasSubItems: true,
      subItems: [
        {
          href: `/${birthcare_Id}/patients/add`,
          label: "Registration",
          icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
        },
        {
          href: `/${birthcare_Id}/patients`,
          label: "List",
          icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
        },
        {
          href: `/${birthcare_Id}/patient-documents`,
          label: "Documents",
          icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        },
        {
          href: `/${birthcare_Id}/patient-admission`,
          label: "Admission",
          icon: "M19 14l-7 7m0 0l-7-7m7 7V3m0 18a2 2 0 01-2-2V5a2 2 0 012-2h4a2 2 0 012 2v14a2 2 0 01-2 2h-4z",
        },
      ],
    },
    {
      href: `/${birthcare_Id}/prenatal`,
      label: "Pre-natal",
      permission: "manage_appointment",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      hasSubItems: true,
      subItems: [
        {
          href: `/${birthcare_Id}/prenatal`,
          label: "Schedule",
          icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        },
        {
          href: `/${birthcare_Id}/prenatal-chart`,
          label: "Chart",
          icon: "M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v6h6v-6M8 11V8a2 2 0 012-2h4a2 2 0 012 2v3",
        },
        {
          href: `/${birthcare_Id}/prenatal-forms`,
          label: "Forms",
          icon: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h0a2 2 0 012 2m-6 9l2 2 4-4",
        },
      ],
    },
    {
      href: `/${birthcare_Id}/rooms`,
      label: "Room Management",
      permission: "manage_appointment",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v2a1 1 0 001 1h4a1 1 0 001-1v-2a1 1 0 00-1-1h-4a1 1 0 00-1 1z",
    },
    {
      href: `/${birthcare_Id}/labor-monitoring`,
      label: "Labor Monitoring",
      permission: "manage_appointment",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      href: `/${birthcare_Id}/newborn-records`,
      label: "Newborn Records",
      permission: "manage_appointment",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      hasSubItems: true,
      subItems: [
        {
          href: `/${birthcare_Id}/newborn-records/birth-details`,
          label: "Birth Details",
          icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
        },
        {
          href: `/${birthcare_Id}/newborn-records/apgar-score`,
          label: "Apgar Score Sheet",
          icon: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h0a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
        },
        {
          href: `/${birthcare_Id}/newborn-records/medications-vaccinations`,
          label: "Medications & Vaccinations",
          icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
        },
        {
          href: `/${birthcare_Id}/newborn-records/screening-results`,
          label: "Newborn Screening Results",
          icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        },
        {
          href: `/${birthcare_Id}/newborn-records/discharge-notes`,
          label: "Discharge Notes",
          icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
        },
        {
          href: `/${birthcare_Id}/newborn-records/certificate-live-birth`,
          label: "Certificate of Live Birth",
          icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        },
      ],
    },
    {
      href: `/${birthcare_Id}/referrals`,
      label: "Referrals",
      permission: "manage_appointment",
      icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
    },
    {
      href: `/${birthcare_Id}/billing`,
      label: "Patient Charges",
      permission: "manage_billing",
      icon: "M9 7h6m0 0l-3-3 3-3m-3 3l3 3m2 8H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2z",
    },
    {
      href: `/${birthcare_Id}/payments`,
      label: "Payments",
      permission: "manage_billing",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      href: `/${birthcare_Id}/soa-bill`,
      label: "SOA/Bill",
      permission: "manage_billing",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
    {
      href: `/${birthcare_Id}/role`,
      label: "Role",
      permission: "manage_role",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
    },
    {
      href: `/${birthcare_Id}/staff`,
      label: "Staff",
      permission: "manage_staff",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    },
  ];

  // Filter nav links: owners (system_role_id === 2) get all links, staff (system_role_id === 3) get permission-based links
  const navLinks =
    user.system_role_id === 2
      ? allNavLinks // Owners see all links
      : allNavLinks.filter((link) => {
          if (!link.permission) return true; // Show links with no permission requirement
          return user.permissions.includes(link.permission); // Check permissions for staff
        });

  return (
    <>
      {/* Top Navigation Bar - Only on mobile (<1024px) */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-800 shadow-lg h-16 flex items-center justify-between px-4">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-slate-700 transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <X size={24} className="text-white" />
              ) : (
                <Menu size={24} className="text-white" />
              )}
            </button>
          </div>

          {/* User Profile in Top Bar */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full flex items-center justify-center font-medium bg-slate-600 text-white">
                  {user?.firstname?.charAt(0) || "U"}
                </div>
              </div>
            </button>

            {/* Dropdown - Triggered by click */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 rounded-lg shadow-lg overflow-hidden z-50 bg-white w-48">
                <div className="py-1">
                  <div className="px-4 py-2 text-xs text-gray-500">
                    Signed in as{" "}
                    <span className="font-medium">{user?.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false); // Close dropdown on logout
                    }}
                    className="flex items-center cursor-pointer w-full px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-red-600"
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-slate-800 drop-shadow-lg transition-transform duration-300 ease-in-out ${
          isMobile
            ? isOpen
              ? "translate-x-0 w-72"
              : "-translate-x-full w-72"
            : "translate-x-0 w-72" // Always visible at lg and above
        } ${isMobile ? "mt-16" : "mt-0"}`} // Adjust for top bar height in mobile
      >
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <div className="bg-slate-800 border-b border-slate-700 p-6">
            <div className="flex items-center justify-center space-x-3">
              <IconLogo size="h-10 w-10" iconSize="h-6 w-6" />
              <div>
                <h1 className="text-lg font-semibold text-white">
                  {user.system_role_id === 2 ? "Owner Panel" : "Staff Panel"}
                </h1>
                <p className="text-xs text-slate-300 font-medium">
                  Birthcare Management
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navLinks.map((item) => (
                <li key={item.label}>
                  {item.hasSubItems ? (
                    <div>
                      {/* Parent item with dropdown */}
                      <button
                        onClick={() => toggleSubMenu(item.label)}
                        className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors ${
                          pathname.startsWith(item.href)
                            ? "bg-slate-700 text-white font-medium"
                            : "text-slate-300 hover:bg-slate-700 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d={item.icon}
                            />
                          </svg>
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${
                            openSubMenus[item.label] ? "rotate-90" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                      
                      {/* Sub-navigation items */}
                      {openSubMenus[item.label] && (
                        <ul className="mt-2 ml-4 space-y-1 border-l border-slate-600 pl-4">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.label}>
                              <Link
                                href={subItem.href}
                                onClick={handleNavClick}
                                className={`flex items-center px-3 py-2 rounded-md transition-colors text-sm ${
                                  pathname === subItem.href
                                    ? "bg-slate-600 text-white font-medium"
                                    : "text-slate-400 hover:bg-slate-600 hover:text-white"
                                }`}
                              >
                                <svg
                                  className="w-4 h-4 mr-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={subItem.icon}
                                  />
                                </svg>
                                <span className="font-medium">{subItem.label}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    // Regular navigation item without sub-items
                    <Link
                      href={item.href}
                      onClick={handleNavClick}
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        pathname === item.href
                          ? "bg-slate-700 text-white font-medium"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={item.icon}
                        />
                      </svg>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile - Only at lg and above */}
          {!isMobile && (
            <div className="px-4 py-4 border-t border-slate-700">
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center w-full p-2 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center font-medium bg-slate-100 text-slate-700">
                      {user?.firstname?.charAt(0) || "U"}
                    </div>
                  </div>
                  <div className="ml-3 text-left">
                    <p className="text-sm font-medium text-white">
                      {user?.firstname}
                    </p>
                    <p className="text-xs text-slate-300">
                      {user.system_role_id === 2 ? "Owner" : "Staff Member"}
                    </p>
                  </div>
                  <svg
                    className={`ml-auto h-5 w-5 text-slate-400 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown - Triggered by click */}
                {isDropdownOpen && (
                  <div className="absolute bottom-full left-0 right-0 rounded-lg shadow-lg overflow-hidden z-50 bg-white">
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs text-gray-500">
                        Signed in as{" "}
                        <span className="font-medium">{user?.email}</span>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false); // Close dropdown on logout
                        }}
                        className="flex items-center cursor-pointer w-full px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-red-600"
                      >
                        <svg
                          className="w-5 h-5 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay - Only on mobile when sidebar is open */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;

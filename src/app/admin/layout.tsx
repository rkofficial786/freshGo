"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { BsGraphUpArrow } from "react-icons/bs";
import {
  FaShoppingCart,
  FaList,
  FaPlus,
  FaTag,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { LuUsers2 } from "react-icons/lu";
import { IoMdLogOut } from "react-icons/io";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useDispatch, useSelector } from "react-redux";
import { logoutApi } from "@/lib/features/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function AdminLayout({ children }) {
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(true);
  const dispatch = useDispatch<any>();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLogout = async () => {
    try {
      const { payload } = await dispatch(logoutApi());
      if (payload.success) {
        router.push("/login/admin");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const allAdminCards = [
    {
      href: "/admin/dashboard",
      title: "Dashboard",
      icon: <BsGraphUpArrow size={20} />,
      roles: ["Admin"],
    },
    {
      href: "/admin/get-orders",
      title: "Orders",
      icon: <FaShoppingCart size={20} />,
      roles: ["Admin", "SuperAdmin"],
    },
    {
      href: "/admin/customers",
      title: "Customers",
      icon: <LuUsers2 size={20} />,
      roles: ["SuperAdmin", "Admin"],
    },
    {
      href: "/admin/addProduct",
      title: "Add Product",
      icon: <FaPlus size={20} />,
      roles: ["SuperAdmin", "Admin", "Sales person"],
    },
    {
      href: "/admin/products",
      title: "Products",
      icon: <FaList size={20} />,
      roles: ["SuperAdmin", "Admin", "Sales person"],
    },
    {
      href: "/admin/coupan",
      title: "Coupons",
      icon: <FaTag size={20} />,
      roles: ["SuperAdmin", "Admin"],
    },
  ];

  const filteredAdminCards = useMemo(() => {
    return allAdminCards.filter((card) => card.roles.includes(user.role));
  }, [user.role]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Hide navbar and footer */}
      <style jsx global>{`
        .navbar-main,
        .footer-main {
          display: none;
        }
      `}</style>

      {/* Mobile Toggle Button */}
      {isMobile && (
        <div
          className={`fixed top-4 ${
            showSidebar ? "left-[240px]" : "left-4"
          } z-50`}
        >
          <Button
            onClick={() => setShowSidebar(!showSidebar)}
            variant="outline"
            size="icon"
            className="rounded-full shadow-md"
          >
            {showSidebar ? <FaTimes size={18} /> : <FaBars size={18} />}
          </Button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }  bg-white shadow-lg`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center">
              <div className="mr-2">
                {/* Replace with your actual logo */}
                <div
                  onClick={() => router.push("/")}
                  className="flex  items-center cursor-pointer"
                >
                  <div className="relative w-16 h-16 mr-2 overflow-hidden">
                    <img
                      src="/assets/images/logo.png"
                      alt="logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
              <h1 className="text-xl font-bold text-gray-800">FreshGo Admin</h1>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4 mt-10">
            <nav className="px-3 space-y-1">
              {filteredAdminCards.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    pathname === item.href
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  <span
                    className={`mr-3 ${
                      pathname === item.href
                        ? "text-green-600"
                        : "text-gray-500 group-hover:text-green-600"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-700 font-semibold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
            <Button
              onClick={() => setShowLogoutModal(true)}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-white hover:bg-red-600 border-red-200"
            >
              <IoMdLogOut size={18} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
      />

      {/* Main Content */}
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
          showSidebar ? "md:ml-64" : ""
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            {!isMobile && (
              <Button
                onClick={() => setShowSidebar(!showSidebar)}
                variant="ghost"
                size="icon"
                className="text-gray-500"
              >
                <FaBars size={18} />
              </Button>
            )}
            <div className="flex-1 md:flex-initial">
              <h1 className="text-lg font-semibold text-gray-800 ml-4 md:ml-0">
                {pathname.split("/").pop()?.charAt(0).toUpperCase() +
                  pathname.split("/").pop()?.slice(1) || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <p className="hidden md:block text-sm text-gray-600">
                Welcome,{" "}
                <span className="font-medium text-green-600">{user.name}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="px-6 py-6">{children}</div>
      </main>
    </div>
  );
}

export default AdminLayout;

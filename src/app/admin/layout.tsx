"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { BsGraphUpArrow } from "react-icons/bs";
import {
  FaShoppingCart,
  FaList,
  FaPlus,
  FaImage,
  FaTag,
  FaCog,
  FaSalesforce,
  FaHamburger,
  FaInstagram,
} from "react-icons/fa";
import { SiSublimetext } from "react-icons/si";
import { FcRules } from "react-icons/fc";
import { LuUsers2 } from "react-icons/lu";
import { RiAdminLine } from "react-icons/ri";
import { IoMdLogOut } from "react-icons/io";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useDispatch, useSelector } from "react-redux";
import { logoutApi } from "@/lib/features/auth";
import { Button } from "@/components/ui/button";

function AdminLayout({ children }) {
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(true);
  const dispatch = useDispatch<any>();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);

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
      title: "Dashboards",
      icon: (
        <BsGraphUpArrow size={24} className="text-black hover:text-white" />
      ),
      roles: ["Admin"],
    },
    {
      href: "/admin/get-orders",
      title: "All Orders",
      icon: (
        <FaShoppingCart size={24} className="text-black hover:text-white" />
      ),
      roles: ["Admin","SuperAdmin"],
    },
    {
      href: "/admin/customers",
      title: "All Customers",
      icon: <LuUsers2 size={24} className="text-black hover:text-white" />,
      roles: ["SuperAdmin", "Admin"],
    },


    {
      href: "/admin/addProduct",
      title: "Add Product",
      icon: <FaPlus size={24} className="text-black hover:text-white" />,
      roles: ["SuperAdmin", "Admin", "Sales person"],
    },
    {
      href: "/admin/products",
      title: "All Products",
      icon: <FaList size={24} className="text-black hover:text-white" />,
      roles: ["SuperAdmin", "Admin", "Sales person"],
    },

    {
      href: "/admin/coupan",
      title: "Coupons",
      icon: <FaTag size={24} className="text-black hover:text-white" />,
      roles: ["SuperAdmin", "Admin"],
    },
  ];

  const filteredAdminCards = useMemo(() => {
    return allAdminCards.filter((card) => card.roles.includes(user.role));
  }, [user.role]);

  return (
    <div className="flex h-screen ">
      <style jsx global>{`
        .navbar-main,
        .footer-main {
          display: none;
        }
      `}</style>
      {!showSidebar && (
        <div className="absolute top-4 left-[200px] cursor-pointer">
          <FaHamburger
            color="black"
            onClick={() => setShowSidebar(true)}
            size={24}
          />
        </div>
      )}
      {showSidebar && (
        <aside className="w-64 bg-[#FAFAFA] text-white fixed left-0 h-screen">
          <div
            onClick={() => setShowSidebar(false)}
            className="p-4 flex justify-between cursor-pointer"
          >
            <h2 className="text-2xl font-semibold text-black">Admin Panel</h2>
            <FaHamburger className="text-black z-10" color="black" size={24} />
          </div>
          <nav className="mt-4">
            {filteredAdminCards.map((card, index) => (
              <Link
                key={index}
                href={card.href}
                className={`flex items-center px-4 py-3 text-sm ${
                  pathname === card.href
                    ? "bg-[#fe1d28] text-white"
                    : "text-gray-600 hover:bg-[#fe1d28] hover:text-white"
                }`}
              >
                <span className="mr-3 hover:text-white">{card.icon}</span>
                {card.title}
              </Link>
            ))}
          </nav>
        </aside>
      )}

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
      />
      <main
        className={`flex-1 transition-all ease-in-out duration-300 p-8 ${
          showSidebar ? "pl-[300px]" : "pl-8"
        }`}
      >
        <div className="flex justify-end items-center gap-6">
          <h2 className="text-xl ">
            Welcome{" "}
            <span className="font-bold cursor-pointer text-[#FE1D28]">
              {user.name}
            </span>
          </h2>
          <Button onClick={() => setShowLogoutModal(true)}>Logout</Button>
        </div>
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;

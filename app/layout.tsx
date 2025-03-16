"use client";
import { useState, useEffect } from "react";
import { usePathname, useParams } from "next/navigation";
import { Compass, Users, Folder, User, Search, RotateCw } from "lucide-react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RefreshCw } from 'react-feather';

// Font Setup
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Page Titles
const pageTitles: Record<string, string> = {
  "/explore": "Explore",
  "/contractors": "Contractors",
  "/projects": "Projects",
  "/users": "Users",
};

// Search Options
const searchOptions = ["location", "user", "project", "contractor"];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { id } = useParams(); // Get project ID

  const [pageTitle, setPageTitle] = useState(pageTitles[pathname] || "Dashboard");

  // Fetch project name dynamically if in /projects/:id
  useEffect(() => {
    if (pathname.startsWith("/projects/") && id) {
      fetch("/projects.json")
        .then((res) => res.json())
        .then((data) => {
          const project = data.find((proj: { id: number }) => proj.id.toString() === id);
          if (project) setPageTitle(project.name);
        })
        .catch(() => setPageTitle("Project Details"));
    } else {
      setPageTitle(pageTitles[pathname] || "Dashboard");
    }
  }, [pathname, id]);

  // Typing effect for search
  const [staticText, setStaticText] = useState(""); // "Search by"
  const [dynamicText, setDynamicText] = useState(""); // "location", "user", etc.
  const [optionIndex, setOptionIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAnimationStopped, setIsAnimationStopped] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false); // Track search bar focus

  useEffect(() => {
    if (isAnimationStopped) return;

    const currentOption = searchOptions[optionIndex];
    const speed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (staticText.length < "Search by ".length) {
        // Typing "Search by"
        setStaticText((prev) => prev + "Search by "[prev.length]);
      } else if (!isDeleting && charIndex < currentOption.length) {
        // Typing the dynamic word (e.g., "location")
        setDynamicText((prev) => prev + currentOption[charIndex]);
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        // Deleting the dynamic word
        setDynamicText((prev) => prev.slice(0, -1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === currentOption.length) {
        // Wait before deleting the dynamic word
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && charIndex === 0) {
        // Move to the next option
        setIsDeleting(false);
        setOptionIndex((prev) => (prev + 1) % searchOptions.length);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [staticText, dynamicText, charIndex, isDeleting, optionIndex, isAnimationStopped]);

  // Handle search bar focus
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setIsAnimationStopped(true);
  };

  // Handle search bar blur
  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    setIsAnimationStopped(false);
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white overflow-hidden`}>
        <div className="flex h-screen w-screen p-2 overflow-hidden">
          <div className="flex w-full h-full bg-white rounded-3xl overflow-hidden">
            {/* Sidebar */}
            <aside className="w-24 bg-[#0B083E] text-white p-4 flex flex-col items-center rounded-r-3xl rounded-l-3xl overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img alt="ZedeXeL Logo" src="/images/logo.webp" className="w-full h-full object-cover" />
              </div>
              <nav className="mt-6 flex-1 overflow-hidden">
                <ul className="space-y-0">
                  {[
                    { href: "/explore", icon: Compass, label: "Explore" },
                    { href: "/contractors", icon: Users, label: "Contractors" },
                    { href: "/projects", icon: Folder, label: "Projects" },
                    { href: "/users", icon: User, label: "Users" },
                  ].map(({ href, icon: Icon, label }) => (
                    <li key={href} className="flex flex-col items-center">
                      <a href={href} className="flex flex-col items-center p-2 transition-all">
                        <div className={`p-3 rounded-md transition-all duration-300 hover:bg-[#8B8BA2] ${pathname.startsWith(href) ? "bg-[#8B8BA2]" : ""}`}>
                          <Icon className="w-4 h-4 transition-colors duration-300 hover:text-white" />
                        </div>
                        <span className="mt-1 text-xs">{label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 bg-white p-3 flex flex-col rounded-r-3xl overflow-hidden">
              {/* Header */}
              <header className="bg-white p-2 mb-0 rounded-lg">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-[#0B083E]">{pageTitle}</h1>

                  {/* Search Bar */}
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                      type="text"
                      placeholder={isSearchFocused ? "" : `${staticText}${dynamicText}`} // Hide placeholder when focused
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                      className="w-full p-2 pl-10 border border-gray-300 rounded-full text-sm focus:border-[#8B8BA2] focus:ring-2 focus:ring-[#8B8BA2] transition-all duration-300 hover:border-gray-400 placeholder-[#8B8BA2]"
                    />
                  </div>
                </div>

                {/* Conditional Section (Only for project routes) */}
                {pathname.startsWith("/projects/") && (
                  <div className="mt-1 flex items-center">
                    {/* Tabs with Improved Underline Logic */}
                    <div className="flex space-x-4">
                      {["Details", "Contractor", "Quotations"].map((tab, index) => (
                        <button
                          key={tab}
                          className={`px-4 py-2 relative transition-all ${
                            index === 0 ? "border-b-4 border-black" : "text-gray-600 hover:border-b-4 hover:border-black"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Improved Sync Button */}
                    <button className="ml-auto bg-black text-white px-4 py-2 flex items-center space-x-2 rounded-full hover:bg-gray-800 transition-all duration-300">
                      <span className="text-sm">Sync</span>  <RefreshCw className="w-4 h-4 text-sm font-extralight text-white" />
                    </button>
                  </div>
                )}
              </header>

              {/* Render Dynamic Page Content */}
              <main className="bg-white rounded-lg flex-1 overflow-hidden">
                {children}
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
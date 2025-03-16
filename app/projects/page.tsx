"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Venue = {
  name: string;
};

type Project = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  venue: Venue;
};

const randomColors = [
  "bg-green-200 text-green-900",
  "bg-yellow-200 text-yellow-900",
  "bg-red-200 text-red-900",
  "bg-pink-200 text-pink-900",
  "bg-purple-200 text-purple-900",
  "bg-orange-200 text-orange-900",
  "bg-teal-200 text-teal-900",
  "bg-blue-200 text-blue-900",
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9;

  useEffect(() => {
    fetch("/projects.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load projects.json");
        }
        return response.json();
      })
      .then((data) => {
        const sortedProjects = data.sort(
          (a: Project, b: Project) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        setProjects(sortedProjects);
      })
      .catch((error) => console.error("Error loading projects:", error));
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const offset = currentPage * itemsPerPage;
  const currentProjects = projects.slice(offset, offset + itemsPerPage);
  const totalEntries = projects.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="h-screen flex flex-col bg-white border-none">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F7F7F9] text-[#BDBCCA] text-left text-xs font-semibold">
                <th className="p-3 rounded-l-lg text-[#BDBCCA]">Name</th>
                <th className="p-3 text-[#BDBCCA]">Start Date</th>
                <th className="p-3 text-[#BDBCCA]">End Date</th>
                <th className="p-3 text-[#BDBCCA]">Status</th>
                <th className="p-3 rounded-r-lg text-[#BDBCCA]">Venue</th>
              </tr>
            </thead>
            <tbody>
              {currentProjects.map((project, index) => {
                const randomColor = randomColors[index % randomColors.length];
                return (
                  <tr
                    key={project.id}
                    className="transition-all duration-300 border-b border-gray-300 hover:bg-gray-100"
                  >
                    <td className="p-2 font-semibold text-[#12112C] text-xs">
                      <Link href={`/projects/${project.id}`} className="no-underline hover:no-underline">
                        {project.name}
                      </Link>
                    </td>
                    <td className="p-2 text-xs text-gray-700">
                      {formatDate(project.startDate)}
                    </td>
                    <td className="p-2 text-xs text-gray-700">
                      {formatDate(project.endDate)}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${randomColor}`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="p-2 pb-5 text-xs text-gray-800">{project.venue.name}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="text-gray-700 font-medium text-sm">
                      Showing{" "}
                      <span className="px-3 py-1 bg-slate-100 text-gray-800 rounded-full">
                        {currentProjects.length}
                      </span>{" "}
                      of {totalEntries} entries
                    </div>

                    {/* Pagination Buttons */}
                    <div className="flex space-x-2">
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handlePageClick(index)}
                          className={`px-3 py-1 rounded-full text-gray-800 border border-gray-300 hover:bg-gray-200 cursor-pointer ${
                            index === currentPage ? "bg-black text-white font-bold" : ""
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

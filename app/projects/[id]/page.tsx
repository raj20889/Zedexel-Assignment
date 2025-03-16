"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

type Venue = {
  name: string;
  city: string;
  country: string;
  hall_number: string;
  stand_number: string;
  total_sq_mtr: number;
};

type ImageData = {
  type: string;
  path: string;
};

type Project = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  venue: Venue;
  logo: ImageData; // ✅ Fix: Define logo properly
  images: ImageData[]; // ✅ Fix: Ensure images have path & type
};

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch("/projects.json")
      .then((response) => response.json())
      .then((data) => {
        const foundProject = data.find((proj: Project) => proj.id.toString() === id);
        setProject(foundProject);
      })
      .catch((error) => console.error("Error fetching project:", error));
  }, [id]);

  if (!project) return <p className="text-center text-gray-600">Loading...</p>;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="justify-center items-start bg-white overflow-hidden">
      {/* Parent div with flex-row layout */}
      <div className="flex flex-row w-full mb-2 bg-white mt-2 h-[120px] p-1 border border-gray-100 rounded-lg">
        {/* Left Section: Project Logo and Details */}
        <div className="flex flex-row gap-x-6 ml-5 pt-2 items-start">
          {/* Circular Logo Image */}
          <img
            src={project.logo.path} // ✅ Fixed to access logo path
            alt="Logo"
            className="w-[90px] h-[90px] bg-gray-200 rounded-full object-contain"
          />

          {/* Project Details */}
          <div className="flex flex-wrap gap-x-12  gap-y-2 w-full">
            {/* Start Date */}
            <div className="w-[130px] flex flex-col justify-start items-start">
              <p className="text-[#8B8BA2] text-sm p-1">Start Date</p>
              <p className="font-semibold ml-1 text-sm">{formatDate(project.startDate)}</p>
            </div>

            {/* End Date */}
            <div className="w-[130px]">
              <p className="text-[#8B8BA2] text-sm p-1">End Date</p>
              <p className="font-semibold ml-1 text-sm">{formatDate(project.endDate)}</p>
            </div>

            {/* Venue Name */}
            <div className="w-[160px]">
              <p className="text-[#8B8BA2] text-sm p-1">Venue</p>
              <p className="font-semibold ml-1 text-sm">{project.venue.name}</p>
            </div>

            {/* Venue City */}
            <div className="w-[120px]">
              <p className="text-[#8B8BA2] text-sm p-1">City</p>
              <p className="font-semibold ml-1 text-sm ">{project.venue.city}</p>
            </div>

            {/* Bottom Section for Country, Hall, Stand, and Total Sq. Mtr */}
            <div className="w-full flex flex-wrap gap-x-13 gap-y-3">
              {/* Country */}
              <div className="w-[120px] mr-1">
                <p className="text-[#8B8BA2] text-sm p-1">Country</p>
                <p className="font-semibold ml-1 text-sm">{project.venue.country}</p>
              </div>

              {/* Hall Number */}
              <div className="w-[120px] ml-1">
                <p className="text-[#8B8BA2] text-sm p-1">Hall</p>
                <p className="font-semibold ml-1 text-sm">{project.venue.hall_number}</p>
              </div>

              {/* Stand Number */}
              <div className="w-[120px]  mr-2">
                <p className="text-[#8B8BA2] ml-0 text-sm p-1">Stand</p>
                <p className="font-semibold ml-1 text-sm">{project.venue.stand_number}</p>
              </div>

              {/* Total Sq. Mtr */}
              <div className="w-[120px] ml-7">
                <p className="text-[#8B8BA2] text-sm p-1">Total Sq. Mtr</p>
                <p className="font-semibold ml-1 text-sm">{project.venue.total_sq_mtr} sqm</p>
              </div>
            </div>
          </div>
        </div>
      </div>

   {/* Image Grid Section */}
<div className="grid grid-cols-3 grid-rows-2 gap-2 h-auto bg-white border-[1px] border-gray-100 rounded-lg p-3">
  {/* Dynamic Images */}
  {project.images.map((img, index) => (
    <img
      key={index}
      src={img.path} // ✅ Fixed to access image path
      alt={`Image ${index + 1}`}
      className="w-[220px] h-[160px] rounded-[4px] object-cover mx-auto "
    />
  ))}
</div>

    </div>
  );
}

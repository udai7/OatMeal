"use client";

import React from "react";
import { useFormContext } from "@/lib/context/FormProvider";
import { format } from "date-fns";
import { themeColors } from "@/lib/utils";

const ProjectsPreview = () => {
  const { formData } = useFormContext();

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      return format(date, "MMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  if (!formData?.projects || formData.projects.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <h2 
        className="text-center font-bold text-sm mb-2"
        style={{
          color: formData?.themeColor || themeColors[0],
        }}
      >
        Projects
      </h2>
      <hr
        style={{
          borderColor: formData?.themeColor || themeColors[0],
        }}
      />
      {formData.projects.map((project: any, index: number) => (
        <div key={index} className="my-5">
          <h3 
            className="text-sm font-bold"
            style={{
              color: formData?.themeColor || themeColors[0],
            }}
          >
            {project.name}
          </h3>
          <div className="text-xs flex justify-between">
            {project.technologies && (
              <span className="italic">{project.technologies}</span>
            )}
            <span>
              {formatDate(project.startDate)}
              {project.current
                ? " - Present"
                : project.endDate
                ? ` - ${formatDate(project.endDate)}`
                : ""}
            </span>
          </div>

          {project.description && (
            <p className="text-xs text-justify my-2">{project.description}</p>
          )}

          {project.link && (
            <p className="text-xs break-all">
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: formData?.themeColor || themeColors[0],
                }}
              >
                {project.link}
              </a>
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectsPreview; 
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "@/lib/context/FormProvider";
import { z } from "zod";
import { Plus, Trash, RefreshCcw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { addProjectsToResume } from "@/lib/actions/resume.actions";

const ProjectsForm = ({ params }: { params: { id: string } }) => {
  const { formData, setFormData } = useFormContext();
  const [projects, setProjects] = useState<any[]>([]);
  const [isDateSupported, setIsDateSupported] = useState(true);
  const [isGenerating, setIsGenerating] = useState<Record<number, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    try {
      const input = document.createElement("input");
      input.type = "date";
      const notADateValue = "not-a-date";
      input.value = notADateValue;
      setIsDateSupported(input.value !== notADateValue);
    } catch (e) {
      setIsDateSupported(false);
    }

    if (formData?.projects && formData?.projects.length > 0) {
      setProjects(formData.projects);
    } else {
      setProjects([
        {
          name: "",
          description: "",
          link: "",
          technologies: "",
          startDate: "",
          endDate: "",
          current: false,
        },
      ]);
    }
  }, [formData?.projects]);

  // Add a new project
  const addProject = () => {
    const newProject = {
      name: "",
      description: "",
      link: "",
      technologies: "",
      startDate: "",
      endDate: "",
      current: false,
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    updateFormData(updatedProjects);
  };

  // Remove a project
  const removeProject = (index: number) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    setProjects(updatedProjects);
    updateFormData(updatedProjects);
  };

  // Update project field
  const updateProjectField = (index: number, field: string, value: any) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setProjects(updatedProjects);
    updateFormData(updatedProjects);
  };

  // Update formData with the latest projects
  const updateFormData = (updatedProjects: any[]) => {
    setFormData({
      ...formData,
      projects: updatedProjects
    });

    // Autosave after a delay
    autoSaveProjects(updatedProjects);
  };

  // Debounce function for autosave
  let saveTimeout: any = null;
  const autoSaveProjects = (projectsToSave: any[]) => {
    if (saveTimeout) clearTimeout(saveTimeout);

    saveTimeout = setTimeout(async () => {
      if (!isSaving && params.id) {
        setIsSaving(true);
        try {
          await addProjectsToResume(params.id, projectsToSave);
          console.log("Projects auto-saved successfully");
        } catch (error) {
          console.error("Error auto-saving projects:", error);
        } finally {
          setIsSaving(false);
        }
      }
    }, 1500); // Save after 1.5 seconds of inactivity
  };

  // Generate project details from GitHub link
  const generateProjectDetails = async (index: number, githubLink: string) => {
    if (!githubLink || !githubLink.includes('github.com')) {
      toast({
        title: "Invalid GitHub URL",
        description: "Please enter a valid GitHub repository URL",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating({ ...isGenerating, [index]: true });

    try {
      const response = await fetch('/api/generate-project-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ githubUrl: githubLink }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate project details');
      }

      // Update the project fields
      const updatedProjects = [...projects];
      updatedProjects[index] = {
        ...updatedProjects[index],
        description: result.data.description,
        technologies: result.data.technologies
      };
      setProjects(updatedProjects);
      updateFormData(updatedProjects);

      toast({
        title: "Project Details Generated",
        description: "Description and technologies have been filled automatically",
        className: "bg-green-50 border-green-200",
      });
    } catch (error) {
      console.error("Error generating project details:", error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate project details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating({ ...isGenerating, [index]: false });
    }
  };

  return (
    <div className="mb-20">
      <Card className="bg-neutral-900 shadow-lg border border-neutral-800">
        <CardHeader className="bg-neutral-900 rounded-t-lg border-b border-neutral-800">
          <div className="flex flex-col gap-2">
            <div>
              <CardTitle className="text-white font-semibold">Projects</CardTitle>
              <CardDescription className="text-neutral-400">
                Add your projects to showcase your skills and achievements
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="border border-neutral-700 rounded-lg p-5 mb-5 relative bg-neutral-900/50"
            >
              <div className="absolute right-3 top-3">
                {projects.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProject(index)}
                    className="size-8 rounded-full text-neutral-500 hover:text-red-500 hover:bg-neutral-800"
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </div>

              <div className="mb-5">
                <Label htmlFor={`project-${index}-name`} className="mb-2 block font-medium text-neutral-300">
                  Project Name*
                </Label>
                <Input
                  id={`project-${index}-name`}
                  placeholder="Enter project name"
                  value={project.name}
                  onChange={(e) =>
                    updateProjectField(index, "name", e.target.value)
                  }
                  className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <Label
                    htmlFor={`project-${index}-date-start`}
                    className="mb-2 block font-medium text-neutral-300"
                  >
                    Start Date
                  </Label>
                  <Input
                    id={`project-${index}-date-start`}
                    type={isDateSupported ? "date" : "text"}
                    placeholder={isDateSupported ? "" : "MM/YYYY"}
                    value={project.startDate}
                    onChange={(e) =>
                      updateProjectField(index, "startDate", e.target.value)
                    }
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <Label
                    htmlFor={`project-${index}-date-end`}
                    className="mb-2 block font-medium text-neutral-300"
                  >
                    End Date
                  </Label>
                  <Input
                    id={`project-${index}-date-end`}
                    type={isDateSupported ? "date" : "text"}
                    placeholder={isDateSupported ? "" : "MM/YYYY"}
                    value={project.endDate}
                    onChange={(e) =>
                      updateProjectField(index, "endDate", e.target.value)
                    }
                    disabled={project.current}
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:ring-primary-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="mb-5">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`project-${index}-current`}
                    checked={project.current}
                    onCheckedChange={(checked: boolean) =>
                      updateProjectField(index, "current", checked)
                    }
                    className="border-neutral-600 data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                  />
                  <label
                    htmlFor={`project-${index}-current`}
                    className="text-sm font-medium text-neutral-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    This is an ongoing project
                  </label>
                </div>
              </div>

              <div className="mb-5">
                <Label htmlFor={`project-${index}-link`} className="mb-2 block font-medium text-neutral-300">
                  Project Link
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={`project-${index}-link`}
                    placeholder="https://github.com/yourusername/project"
                    value={project.link}
                    onChange={(e) =>
                      updateProjectField(index, "link", e.target.value)
                    }
                    className="flex-1 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:ring-primary-500"
                  />
                  {project.link && project.link.includes('github.com') && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => generateProjectDetails(index, project.link)}
                      disabled={isGenerating[index]}
                      className="whitespace-nowrap bg-primary-600 hover:bg-primary-700 text-white"
                    >
                      {isGenerating[index] ? (
                        <>
                          <RefreshCcw size={16} className="mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Details"
                      )}
                    </Button>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Add GitHub link and click "Generate Details" to auto-fill description and technologies
                </p>
              </div>

              <div className="mb-5">
                <Label
                  htmlFor={`project-${index}-technologies`}
                  className="mb-2 block font-medium text-neutral-300"
                >
                  Technologies Used
                </Label>
                <Input
                  id={`project-${index}-technologies`}
                  placeholder="E.g., React, Node.js, MongoDB"
                  value={project.technologies}
                  onChange={(e) =>
                    updateProjectField(index, "technologies", e.target.value)
                  }
                  className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:ring-primary-500"
                />
              </div>

              <div className="mb-5">
                <Label
                  htmlFor={`project-${index}-description`}
                  className="mb-2 block font-medium text-neutral-300"
                >
                  Description
                </Label>
                <Textarea
                  id={`project-${index}-description`}
                  placeholder="Describe your project and your role"
                  className="h-24 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:ring-primary-500"
                  value={project.description}
                  onChange={(e) =>
                    updateProjectField(index, "description", e.target.value)
                  }
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full mt-4 border-primary-700 text-primary-400 hover:bg-primary-900/20 bg-transparent"
            onClick={addProject}
          >
            <Plus size={16} className="mr-2" /> Add Another Project
          </Button>

          {isSaving && (
            <p className="text-xs text-neutral-500 text-center mt-2">
              Saving your changes...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsForm;
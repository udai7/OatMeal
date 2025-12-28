"use client";

import PageWrapper from "@/components/common/PageWrapper";
import Header from "@/components/layout/Header";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { fetchUserResumes } from "@/lib/actions/resume.actions";
import { useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { analyzeATS } from "@/lib/actions/ats.actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  Search,
  Sparkles,
  Check,
  AlertCircle,
  FileCheck2,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";
import { useToast } from "@/components/ui/use-toast";

const ATSTest = () => {
  const user = useUser();
  const userId = user?.user?.id;
  const [resumeList, setResumeList] = useState<any[]>([]);
  const [selectedResume, setSelectedResume] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const { toast } = useToast();

  const loadResumeData = async () => {
    try {
      const resumeData = await fetchUserResumes(userId || "");
      setResumeList(JSON.parse(resumeData as any));
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  useEffect(() => {
    if (user?.isSignedIn) {
      loadResumeData();
    }
  }, [user?.isLoaded]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedResume(e.target.files[0]);

      // Reading the file content
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          setResumeText(event.target.result as string);
        }
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to use ATS checker.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedResume && !uploadedResume) {
      toast({
        title: "Resume required",
        description: "Please provide a resume.",
        variant: "destructive",
      });
      return;
    }

    if (!jobDescription || jobDescription.trim().length < 50) {
      toast({
        title: "Job description required",
        description:
          "Please paste the job description (at least 50 characters).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let resumeData;

      if (selectedResume) {
        const selectedResumeObj = resumeList.find(
          (resume) => resume.resumeId === selectedResume
        );
        resumeData = selectedResumeObj;
      } else if (resumeText) {
        resumeData = { content: resumeText };
      }

      const analysisResult = await analyzeATS({
        resumeData,
        jobDescription,
        userId,
      });

      setResult(analysisResult);
    } catch (error: any) {
      console.error("Error analyzing resume:", error);
      if (error.message?.startsWith("RATE_LIMIT_EXCEEDED:")) {
        toast({
          title: "Daily Quota Exhausted",
          description: error.message.replace("RATE_LIMIT_EXCEEDED:", ""),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Analysis failed",
          description:
            error.message ||
            "An error occurred during analysis. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
            <div className="p-2 sm:p-3 bg-primary-700/20 border border-primary-700/30 rounded-xl">
              <FileCheck2 className="h-5 w-5 sm:h-7 sm:w-7 text-primary-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              ATS Resume Checker
            </h2>
          </div>
          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto px-4">
            Optimize your resume for Applicant Tracking Systems to increase your
            chances of getting hired.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          <div className="lg:col-span-5 space-y-6">
            <Card className="shadow-sm border border-gray-200 dark:border-gray-800">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-primary-700/20 border border-primary-700/30 rounded-lg">
                    <Search className="h-5 w-5 text-primary-500" />
                  </div>
                  Resume Selection
                </CardTitle>
                <CardDescription>
                  Choose an existing resume or upload a new one
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {resumeList.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="resume-select">Select your resume</Label>
                    <Select
                      value={selectedResume}
                      onValueChange={setSelectedResume}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a resume" />
                      </SelectTrigger>
                      <SelectContent>
                        {resumeList.map((resume) => (
                          <SelectItem
                            key={resume.resumeId}
                            value={resume.resumeId}
                          >
                            {resume.title || "Untitled Resume"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="resume-upload">
                    Or upload a resume (PDF or TXT)
                  </Label>
                  <Input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileUpload}
                    disabled={!!selectedResume}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-gray-200 dark:border-gray-800">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-primary-700/20 border border-primary-700/30 rounded-lg">
                    <Briefcase className="h-5 w-5 text-primary-500" />
                  </div>
                  Job Details
                </CardTitle>
                <CardDescription>
                  Paste the job description to analyze
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="job-description">
                    Job Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="job-description"
                    placeholder="Copy and paste the full job description from LinkedIn, Indeed, or any job posting..."
                    className="min-h-[200px]"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-2 pb-6 px-6">
                <Button
                  className="w-full h-12 text-lg font-bold shadow-xl shadow-primary/20 bg-primary-700 hover:bg-primary-800 text-white transition-all hover:scale-[1.02]"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⌛</span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analyze Resume
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="lg:col-span-7 h-full">
            {isLoading ? (
              <Card className="h-full flex flex-col items-center justify-center shadow-sm border border-gray-200 dark:border-gray-800 min-h-[500px]">
                <CardContent className="pt-6 text-center max-w-md mx-auto">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75"></div>
                    <div className="bg-primary/10 p-6 rounded-full w-24 h-24 flex items-center justify-center relative z-10">
                      <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    Analyzing your resume...
                  </h3>
                  <Progress value={50} className="w-full h-2 mb-4" />
                  <p className="text-gray-500 animate-pulse">
                    Comparing your resume against the job requirements...
                  </p>
                </CardContent>
              </Card>
            ) : result ? (
              <Card className="shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col h-auto lg:h-[840px]">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4 shrink-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        Analysis Results
                      </CardTitle>
                      <CardDescription>
                        Here's how your resume performed
                      </CardDescription>
                    </div>
                    <Badge
                      className={cn(
                        "px-4 py-1.5 text-sm font-medium rounded-full",
                        result.match_percentage > 70
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : result.match_percentage > 40
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      )}
                      variant="outline"
                    >
                      {result.match_percentage > 70
                        ? "Good Match"
                        : result.match_percentage > 40
                        ? "Average Match"
                        : "Poor Match"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 flex-grow overflow-y-auto no-scrollbar">
                  {/* Score and Assessment Row */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0">
                      <CircularProgressbar
                        value={result.match_percentage}
                        text={`${result.match_percentage}%`}
                        styles={buildStyles({
                          textSize: "24px",
                          pathColor:
                            result.match_percentage > 70
                              ? "#22c55e"
                              : result.match_percentage > 40
                              ? "#f59e0b"
                              : "#ef4444",
                          textColor: "currentColor",
                          trailColor: "#374151",
                          pathTransitionDuration: 0.5,
                        })}
                        className="font-bold text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {result.overall_assessment}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Based on keyword matching and skill alignment
                      </p>
                    </div>
                  </div>

                  {/* Skills Section - Horizontal Layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold flex items-center gap-2 text-green-600 dark:text-green-400">
                        <Check className="h-4 w-4" />
                        Matched ({result.matched_skills.length})
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {result.matched_skills.map(
                          (skill: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-md border border-green-500/30"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        Missing ({result.missing_skills.length})
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {result.missing_skills.map(
                          (skill: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-md border border-red-500/30"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Suggestions Section */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Sparkles className="h-4 w-4" />
                      Improvement Suggestions
                    </h4>
                    <ul className="space-y-2">
                      {result.improvement_suggestions.map(
                        (suggestion: string, index: number) => (
                          <li
                            key={index}
                            className="flex gap-2 text-sm text-gray-300 pl-2 border-l-2 border-blue-500/50"
                          >
                            <span>{suggestion}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-100 dark:border-gray-800 p-4 flex justify-end shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setResult(null)}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Test Another Resume
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start w-full mx-auto p-4 relative h-full min-h-[500px]">
                <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
                <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
                <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
                <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

                <EvervaultCard text="ATS" />

                <h2 className="dark:text-white text-black mt-4 text-sm font-light">
                  Hover over this card to reveal the hidden patterns in your
                  resume. Our AI analyzes your resume against job descriptions
                  to ensure you pass the ATS.
                </h2>
                <p className="text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5">
                  AI-Powered Analysis
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ATSTest;

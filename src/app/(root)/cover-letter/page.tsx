"use client";

import PageWrapper from "@/components/common/PageWrapper";
import Header from "@/components/layout/Header";
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { fetchUserResumes } from "@/lib/actions/resume.actions";
import { generateCoverLetter } from "@/lib/actions/cover-letter.actions";
import { useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  Briefcase,
  Pencil,
  Mail,
} from "lucide-react";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";
import { toast } from "@/components/ui/use-toast";

const CoverLetterPage = () => {
  const user = useUser();
  const userId = user?.user?.id;
  const [resumeList, setResumeList] = useState<any[]>([]);
  const [selectedResume, setSelectedResume] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>("");
  const [additionalDetails, setAdditionalDetails] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const coverLetterRef = useRef<HTMLDivElement>(null);

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

  const handleGenerate = async () => {
    if (!selectedResume) {
      toast({
        title: "No resume selected",
        description: "Please select a resume to generate a cover letter.",
        variant: "destructive",
      });
      return;
    }

    if (!jobDescription) {
      toast({
        title: "No job description",
        description: "Please provide a job description.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCoverLetter("");

    try {
      const selectedResumeObj = resumeList.find(
        (resume) => resume.resumeId === selectedResume
      );

      const result = await generateCoverLetter({
        resumeData: selectedResumeObj,
        jobDescription,
        additionalDetails,
        companyName,
        jobTitle,
      });

      if (result.success) {
        setCoverLetter(result.coverLetter);
        setIsEditing(false);
        toast({
          title: "Cover letter generated!",
          description: "You can now edit and download your cover letter.",
        });
      }
    } catch (error: any) {
      console.error("Error generating cover letter:", error);
      toast({
        title: "Generation failed",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Cover letter copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!coverLetter) return;

    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "in",
      format: "letter",
    });

    // Set font and styling
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Page dimensions (letter size: 8.5 x 11 inches)
    const pageWidth = 8.5;
    const pageHeight = 11;
    const marginLeft = 1;
    const marginRight = 1;
    const marginTop = 1;
    const marginBottom = 1;
    const usableWidth = pageWidth - marginLeft - marginRight;
    const lineHeight = 0.25; // Line height in inches

    // Split the cover letter into lines that fit the page width
    const lines = doc.splitTextToSize(coverLetter, usableWidth);

    let y = marginTop;
    const maxY = pageHeight - marginBottom;

    for (let i = 0; i < lines.length; i++) {
      if (y + lineHeight > maxY) {
        doc.addPage();
        y = marginTop;
      }
      doc.text(lines[i], marginLeft, y);
      y += lineHeight;
    }

    doc.save(`cover-letter-${companyName || "download"}.pdf`);

    toast({
      title: "Download started",
      description: "Your cover letter is being downloaded as PDF.",
    });
  };

  const handleReset = () => {
    setCoverLetter("");
    setIsEditing(false);
  };

  return (
    <PageWrapper>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary-700/20 border border-primary-700/30 rounded-xl">
              <Mail className="h-7 w-7 text-primary-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Cover Letter Generator
            </h2>
          </div>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Create personalized, professional cover letters tailored to your
            dream job using AI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel - Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="shadow-sm border border-gray-200 dark:border-gray-800">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-primary-700/20 border border-primary-700/30 rounded-lg">
                    <FileText className="h-5 w-5 text-primary-500" />
                  </div>
                  Resume Selection
                </CardTitle>
                <CardDescription>
                  Choose the resume to base your cover letter on
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {resumeList.length > 0 ? (
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
                ) : (
                  <p className="text-sm text-gray-500">
                    No resumes found. Create a resume first.
                  </p>
                )}
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
                  Provide information about the job
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      placeholder="e.g., Google"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="job-title">Job Title</Label>
                    <Input
                      id="job-title"
                      placeholder="e.g., Software Engineer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job-description">
                    Job Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="job-description"
                    placeholder="Copy and paste the full job description from the job posting page (LinkedIn, Indeed, etc.)..."
                    className="min-h-[150px]"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                  <p className="text-xs text-neutral-500">
                    Note: Job sites block automated access. Please copy and
                    paste the description manually.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional-details">
                    Additional Details (Optional)
                  </Label>
                  <Textarea
                    id="additional-details"
                    placeholder="Add any specific points you want to highlight, tone preferences, or additional context..."
                    className="min-h-[100px]"
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-2 pb-6 px-6">
                <Button
                  className="w-full h-12 text-lg font-bold shadow-xl shadow-primary/20 bg-primary-700 hover:bg-primary-800 text-white transition-all hover:scale-[1.02]"
                  onClick={handleGenerate}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⌛</span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Cover Letter
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Panel - Output */}
          <div className="lg:col-span-7 h-full">
            {isLoading ? (
              <Card className="h-full flex flex-col items-center justify-center shadow-sm border border-gray-200 dark:border-gray-800 min-h-[500px]">
                <CardContent className="pt-6 text-center max-w-md mx-auto">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75"></div>
                    <div className="bg-primary/10 p-6 rounded-full w-24 h-24 flex items-center justify-center relative z-10 mx-auto">
                      <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    Crafting your cover letter...
                  </h3>
                  <Progress value={66} className="w-full h-2 mb-4" />
                  <p className="text-gray-500 animate-pulse">
                    Analyzing your resume and job requirements...
                  </p>
                </CardContent>
              </Card>
            ) : coverLetter ? (
              <Card className="shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col h-[840px]">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4 shrink-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        Your Cover Letter
                      </CardTitle>
                      <CardDescription>
                        {companyName && jobTitle
                          ? `For ${jobTitle} at ${companyName}`
                          : "Edit and download when ready"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                        className={isEditing ? "bg-primary/10" : ""}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        {isEditing ? "Preview" : "Edit"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        {copied ? (
                          <Check className="h-4 w-4 mr-1" />
                        ) : (
                          <Copy className="h-4 w-4 mr-1" />
                        )}
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleDownload}
                        className="bg-primary-700 hover:bg-primary-800"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 flex-grow overflow-y-auto no-scrollbar">
                  {isEditing ? (
                    <Textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="min-h-[600px] font-serif text-base leading-relaxed resize-none"
                      placeholder="Your cover letter content..."
                    />
                  ) : (
                    <div
                      ref={coverLetterRef}
                      className="prose prose-sm dark:prose-invert max-w-none font-serif text-base leading-relaxed whitespace-pre-wrap bg-white dark:bg-gray-900 p-8 rounded-lg border border-gray-100 dark:border-gray-800"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {coverLetter}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t border-gray-100 dark:border-gray-800 p-4 flex justify-between shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Generate New
                  </Button>
                  <p className="text-xs text-gray-500">
                    Tip: Click Edit to make changes before downloading
                  </p>
                </CardFooter>
              </Card>
            ) : (
              <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start w-full mx-auto p-4 relative h-full min-h-[500px]">
                <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
                <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
                <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
                <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

                <EvervaultCard text="COVER" />

                <h2 className="dark:text-white text-black mt-4 text-sm font-light">
                  Hover over this card to preview the magic. Our AI crafts
                  personalized cover letters that highlight your unique
                  qualifications and match the job requirements perfectly.
                </h2>
                <p className="text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5">
                  Powered by Gemini 2.5 Flash
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CoverLetterPage;

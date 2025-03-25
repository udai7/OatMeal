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
  SelectValue
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { analyzeATS } from "@/lib/actions/ats.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Search, Sparkles, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const ATSTest = () => {
  const user = useUser();
  const userId = user?.user?.id;
  const [resumeList, setResumeList] = useState<any[]>([]);
  const [selectedResume, setSelectedResume] = useState<string>("");
  const [jobLink, setJobLink] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  
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
    if ((!selectedResume && !uploadedResume) || (!jobLink && !jobDescription)) {
      alert("Please provide both a resume and job details");
      return;
    }

    setIsLoading(true);
    
    try {
      let resumeData;
      
      if (selectedResume) {
        const selectedResumeObj = resumeList.find(resume => resume.resumeId === selectedResume);
        resumeData = selectedResumeObj;
      } else if (resumeText) {
        resumeData = { content: resumeText };
      }

      const analysisResult = await analyzeATS({
        resumeData,
        jobLink,
        jobDescription
      });
      
      setResult(analysisResult);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      alert("An error occurred during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Header />
      <div className="my-10 !mb-0 mx-10 md:mx-20 lg:mx-36">
        <h2 className="text-center text-2xl font-bold">
          Resume Optimization Center
        </h2>
        <p className="text-center text-gray-600">
          Test your resume against ATS systems
        </p>
      </div>
      
      <div className="p-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="shadow-md border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="bg-muted/50 border-b border-border/70">
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Resume Selection
                </CardTitle>
                <CardDescription>Choose an existing resume or upload a new one</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {resumeList.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="resume-select">Select your resume</Label>
                    <Select value={selectedResume} onValueChange={setSelectedResume}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a resume" />
                      </SelectTrigger>
                      <SelectContent>
                        {resumeList.map((resume) => (
                          <SelectItem key={resume.resumeId} value={resume.resumeId}>
                            {resume.title || "Untitled Resume"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="resume-upload">Or upload a resume (PDF or TXT)</Label>
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
            
            <Card className="shadow-md border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="bg-muted/50 border-b border-border/70">
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Job Details
                </CardTitle>
                <CardDescription>Provide job link or description</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="job-link">Job Link (LinkedIn)</Label>
                  <Input 
                    id="job-link" 
                    placeholder="https://www.linkedin.com/jobs/view/..." 
                    value={jobLink}
                    onChange={(e) => setJobLink(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="job-description">Or paste job description</Label>
                  <Textarea 
                    id="job-description" 
                    placeholder="Paste the full job description here..."
                    className="min-h-[200px]"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 border-t border-border/70 p-4">
                <Button 
                  className="w-full" 
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
          
          <div>
            {isLoading ? (
              <Card className="h-full flex flex-col items-center justify-center shadow-md">
                <CardContent className="pt-6 text-center">
                  <div className="bg-primary/10 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Analyzing your resume...</h3>
                  <Progress value={50} className="w-2/3 mx-auto h-2" />
                  <p className="text-sm text-gray-500 mt-4">
                    This may take a minute. We're comparing your resume against the job requirements.
                  </p>
                </CardContent>
              </Card>
            ) : result ? (
              <Card className="h-full shadow-md border-primary/20">
                <CardHeader className="bg-muted/50 border-b border-border/70">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        ATS Analysis Results
                      </CardTitle>
                      <CardDescription>How well your resume matches the job requirements</CardDescription>
                    </div>
                    <Badge variant={result.match_percentage > 70 ? "default" : result.match_percentage > 40 ? "secondary" : "destructive"}>
                      {result.match_percentage > 70 ? "Good Match" : result.match_percentage > 40 ? "Average Match" : "Poor Match"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center mb-6">
                    <div style={{ width: 200, height: 200 }}>
                      <CircularProgressbar
                        value={result.match_percentage}
                        text={`${result.match_percentage}%`}
                        styles={buildStyles({
                          textSize: '16px',
                          pathColor: result.match_percentage > 70 ? '#22c55e' : result.match_percentage > 40 ? '#f59e0b' : '#ef4444',
                          textColor: '#1f2937',
                          trailColor: '#e5e7eb',
                          pathTransition: 'stroke-dashoffset 0.5s ease 0s',
                        })}
                      />
                    </div>
                    <h3 className="text-xl font-bold mt-4">{result.overall_assessment}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        Key Skills Matched
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.matched_skills.map((skill: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-green-100 text-green-800 hover:bg-green-200"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        Missing Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.missing_skills.map((skill: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-red-50 text-red-800 border-red-200 hover:bg-red-100"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Improvement Suggestions
                    </h4>
                    <Card className="bg-muted/30 border-border/50">
                      <CardContent className="pt-4">
                        <ul className="space-y-3">
                          {result.improvement_suggestions.map((suggestion: string, index: number) => (
                            <li key={index} className="flex gap-2 text-gray-700">
                              <span className="text-primary mt-0.5">•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 border-t border-border/70 flex justify-end">
                  <Button variant="outline" onClick={() => setResult(null)}>
                    Test Another Resume
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="h-full flex flex-col items-center justify-center bg-muted/10 shadow-md">
                <CardContent className="pt-6 text-center">
                  <div className="bg-primary/10 rounded-full p-5 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Search className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Ready to test your resume</h3>
                  <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                    Select or upload your resume and provide job details to see how well your resume matches the job requirements
                  </p>
                  <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>AI-powered analysis</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>Instant results</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>Improvement tips</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ATSTest; 
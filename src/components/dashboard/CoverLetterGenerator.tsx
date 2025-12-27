"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { fetchUserResumes } from "@/lib/actions/resume.actions";
import { useUser } from "@clerk/nextjs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const CoverLetterGenerator = () => {
    const { user } = useUser();
    const [resumes, setResumes] = useState<any[]>([]);
    const [selectedResume, setSelectedResume] = useState<string>("");
    const [prompt, setPrompt] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadResumes = async () => {
            if (user?.id) {
                try {
                    const data = await fetchUserResumes(user.id);
                    setResumes(JSON.parse(data));
                } catch (error) {
                    console.error("Error loading resumes:", error);
                }
            }
        };
        loadResumes();
    }, [user?.id]);

    const handleGenerate = async () => {
        if (!selectedResume) {
            toast({
                title: "No resume selected",
                description: "Please select a resume to generate a cover letter.",
                variant: "destructive",
                className: "bg-neutral-900 text-white border-neutral-800",
            });
            return;
        }
        if (!prompt) {
            toast({
                title: "No prompt provided",
                description: "Please enter a job description or prompt.",
                variant: "destructive",
                className: "bg-neutral-900 text-white border-neutral-800",
            });
            return;
        }

        setIsLoading(true);
        // Simulate generation for now or call API
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Feature coming soon!",
                description: "We will be using Gemini 2.5 Flash for this.",
                className: "bg-neutral-900 text-white border-neutral-800",
            });
        }, 1000);
    };

    return (
        <div className="w-full h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 p-8 shadow-2xl"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-emerald-500/10" />

                <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Sparkles className="h-6 w-6 text-violet-400" />
                                Cover Letter Generator
                            </h2>
                            <p className="text-neutral-400 mt-1">
                                Generate tailored cover letters using Gemini 2.5 Flash.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 flex flex-col gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">
                                    Select Resume
                                </label>
                                <Select onValueChange={setSelectedResume} value={selectedResume}>
                                    <SelectTrigger className="w-full bg-neutral-800 border-neutral-700 text-white focus:ring-violet-500">
                                        <SelectValue placeholder="Choose a resume..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                                        {resumes.map((resume) => (
                                            <SelectItem key={resume.resumeId} value={resume.resumeId}>
                                                {resume.title || "Untitled Resume"}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="md:col-span-2 flex flex-col gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">
                                    Job Description / Prompt
                                </label>
                                <Textarea
                                    placeholder="Paste the job description or enter a prompt here..."
                                    className="min-h-[120px] bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:ring-violet-500 resize-none"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    onClick={handleGenerate}
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 shadow-lg shadow-violet-500/20"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            Generate Cover Letter
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CoverLetterGenerator;

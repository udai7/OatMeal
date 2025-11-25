"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchUserResumes } from "@/lib/actions/resume.actions";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CoverLetterGenerator = () => {
    const user = useUser();
    const router = useRouter();
    const [resumes, setResumes] = useState<any[]>([]);
    const [selectedResumeId, setSelectedResumeId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadResumes = async () => {
            if (user?.user?.id) {
                try {
                    const data = await fetchUserResumes(user.user.id);
                    setResumes(JSON.parse(data as any));
                } catch (error) {
                    console.error("Error loading resumes:", error);
                }
            }
        };
        loadResumes();
    }, [user?.user?.id]);

    const handleGenerate = async () => {
        if (!selectedResumeId) return;
        setIsLoading(true);
        // In a real app, we would generate here, but for now we redirect to the generation page
        // passing the resume ID to fetch context there.
        router.push(`/cover-letter/${selectedResumeId}`);
        setIsLoading(false);
    };

    return (
        <Card className="bg-neutral-900 border-neutral-800 h-full">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    AI Cover Letter Generator
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Select a resume to generate a tailored cover letter.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Select Resume</label>
                    <Select onValueChange={setSelectedResumeId} value={selectedResumeId}>
                        <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                            <SelectValue placeholder="Choose a resume..." />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                            {resumes.map((resume) => (
                                <SelectItem key={resume.resumeId} value={resume.resumeId}>
                                    {resume.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button
                    onClick={handleGenerate}
                    disabled={!selectedResumeId || isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        "Generate Cover Letter"
                    )}
                </Button>
            </CardContent>
        </Card>
    );
};

export default CoverLetterGenerator;

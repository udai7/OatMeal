"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageWrapper from "@/components/common/PageWrapper";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Download, ArrowLeft, Sparkles } from "lucide-react";
import { generateCoverLetter } from "@/lib/actions/ai.actions";
import { fetchUserResumes } from "@/lib/actions/resume.actions";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import html2pdf from "html2pdf.js";

const CoverLetterPage = () => {
    const params = useParams();
    const user = useUser();
    const [coverLetter, setCoverLetter] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [resumeData, setResumeData] = useState<any>(null);

    useEffect(() => {
        const loadResume = async () => {
            if (user?.user?.id && params.id) {
                try {
                    const data = await fetchUserResumes(user.user.id);
                    const resumes = JSON.parse(data as any);
                    const currentResume = resumes.find((r: any) => r.resumeId === params.id);
                    if (currentResume) {
                        setResumeData(currentResume);
                        // Auto-generate on first load if empty
                        if (!coverLetter) {
                            generate(currentResume);
                        }
                    }
                } catch (error) {
                    console.error("Error loading resume:", error);
                }
            }
        };
        loadResume();
    }, [user?.user?.id, params.id]);

    const generate = async (resume: any) => {
        setIsGenerating(true);
        try {
            // In a real app, we'd parse the resume JSON to a readable string
            // For now, we'll just pass the title and some mock skills if available
            const resumeContent = `Title: ${resume.title}\n\n(Full resume content would be parsed here)`;

            const result = await generateCoverLetter(resumeContent);
            if (result.success) {
                setCoverLetter(result.data || "");
                toast({
                    title: "Cover Letter Generated",
                    description: "You can now edit and download it.",
                    className: "bg-green-50 border-green-200",
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to generate cover letter.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Generation error:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = () => {
        const element = document.createElement("div");
        element.innerHTML = coverLetter.replace(/\n/g, "<br>");
        element.style.padding = "40px";
        element.style.fontFamily = "Arial, sans-serif";

        const opt = {
            margin: 1,
            filename: `Cover_Letter_${resumeData?.title || "Generated"}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <PageWrapper>
            <Header />
            <div className="pt-24 px-10 md:px-20 lg:px-36 pb-20 min-h-screen">
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Link>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => generate(resumeData)}
                            disabled={isGenerating}
                            variant="outline"
                            className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                        >
                            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                            Regenerate
                        </Button>
                        <Button onClick={handleDownload} className="bg-white text-black hover:bg-gray-200">
                            <Download className="h-4 w-4 mr-2" /> Download PDF
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg p-8 shadow-xl min-h-[600px] text-black">
                            {isGenerating ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <Loader2 className="h-12 w-12 animate-spin mb-4 text-purple-500" />
                                    <p>Crafting your cover letter...</p>
                                </div>
                            ) : (
                                <Textarea
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    className="w-full h-full min-h-[600px] border-none resize-none focus-visible:ring-0 text-lg leading-relaxed p-0"
                                    placeholder="Your cover letter will appear here..."
                                />
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                            <h3 className="text-white font-semibold mb-4">Job Details (Optional)</h3>
                            <p className="text-sm text-gray-400 mb-4">
                                Paste the job description here to tailor the cover letter specifically for the role.
                            </p>
                            <Textarea
                                placeholder="Paste job description..."
                                className="bg-neutral-800 border-neutral-700 text-white min-h-[200px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default CoverLetterPage;

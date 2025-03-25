"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Check, Star, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Template categories
const CATEGORIES = ["Professional", "Creative", "Simple", "Modern"];

// Resume template data
const RESUME_TEMPLATES = [
  {
    id: "harvard",
    name: "Harvard",
    category: "Professional",
    description: "Classic professional layout with a timeless design",
    popular: true,
    atsScore: 95,
    color: "#1e40af",
    image: "/templates/harvard.png",
  },
  {
    id: "modern",
    name: "Modern",
    category: "Modern",
    description: "Contemporary design with a fresh layout",
    atsScore: 89,
    popular: true,
    color: "#4f46e5",
    image: "/templates/modern.png",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    category: "Simple",
    description: "Clean and simple design focused on content",
    atsScore: 92,
    color: "#0284c7",
    image: "/templates/minimalist.png",
  }
];

interface TemplateGalleryProps {
  onSelectTemplate: (templateId: string) => void;
  resumeData?: any;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelectTemplate, resumeData }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const filteredTemplates = selectedCategory === "All"
    ? RESUME_TEMPLATES
    : RESUME_TEMPLATES.filter(template => template.category === selectedCategory);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowPreview(true);
  };

  const handleConfirmTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      setShowPreview(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Choose Your Resume Template</h2>
        <p className="text-muted-foreground text-center max-w-2xl">
          Select from our professionally designed templates optimized for ATS systems and hiring managers
        </p>
      </div>

      <Tabs defaultValue="All" className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 gap-1">
            <TabsTrigger value="All" onClick={() => setSelectedCategory("All")}>
              All
            </TabsTrigger>
            {CATEGORIES.map(category => (
              <TabsTrigger 
                key={category} 
                value={category} 
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={selectedCategory} className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTemplates.map(template => (
              <Card 
                key={template.id} 
                className={cn(
                  "overflow-hidden cursor-pointer transition-all duration-200 group hover:shadow-lg border-2",
                  selectedTemplate === template.id ? "border-primary" : "border-transparent"
                )}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="relative aspect-[3/4] bg-muted/30 overflow-hidden">
                  {template.popular && (
                    <div className="absolute top-2 left-2 z-10">
                      <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                        <Star className="h-3 w-3 mr-1" /> Popular
                      </Badge>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className="bg-primary/90 hover:bg-primary">{template.atsScore}% ATS</Badge>
                  </div>
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6"
                  >
                    <Button size="sm" variant="secondary" className="shadow-md">
                      <Check className="h-4 w-4 mr-1" /> Select
                    </Button>
                  </div>
                  <img 
                    src={template.image} 
                    alt={template.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback for missing images
                      const target = e.target as HTMLImageElement;
                      target.src = "/icons/document-scan.svg";
                      target.style.padding = "20%";
                      target.style.opacity = "0.2";
                      target.className = "w-full h-full object-contain";
                      // Add a background color based on the template's color
                      target.parentElement!.style.backgroundColor = template.color + "10";
                      target.parentElement!.style.border = `1px solid ${template.color}30`;
                    }}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </CardContent>
                <CardFooter className="bg-muted/30 p-3 border-t">
                  <div className="flex items-center justify-between w-full">
                    <Badge variant="outline">{template.category}</Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover:text-primary/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplateSelect(template.id);
                      }}
                    >
                      Preview
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-5xl w-full">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate && RESUME_TEMPLATES.find(t => t.id === selectedTemplate)?.name} Template
            </DialogTitle>
            <DialogDescription>
              Preview how your resume will look with this template
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
            <div className="aspect-[3/4] rounded-md overflow-hidden border shadow-sm">
              {selectedTemplate && (
                <img 
                  src={RESUME_TEMPLATES.find(t => t.id === selectedTemplate)?.image}
                  alt="Template Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback for missing images
                    const selected = RESUME_TEMPLATES.find(t => t.id === selectedTemplate);
                    const target = e.target as HTMLImageElement;
                    target.src = "/icons/document-scan.svg";
                    target.style.padding = "20%";
                    target.style.opacity = "0.2";
                    target.className = "w-full h-full object-contain";
                    target.parentElement!.style.backgroundColor = (selected?.color || "#1e293b") + "10";
                    target.parentElement!.style.border = `1px solid ${selected?.color || "#1e293b"}30`;
                  }}
                />
              )}
            </div>
            
            <div className="flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Template Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>ATS-optimized layout and formatting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Professional typography and spacing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Custom sections for skills and projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Multiple export options (PDF, DOCX)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Editable color schemes</span>
                  </li>
                </ul>

                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-2">Why This Works</h3>
                  <p className="text-muted-foreground">
                    This template has been tested against major ATS systems and has a proven 
                    {selectedTemplate && ` ${RESUME_TEMPLATES.find(t => t.id === selectedTemplate)?.atsScore}%`} success rate. 
                    It balances professional appearance with optimal machine readability.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex flex-col space-y-2">
                  <Badge variant="outline" className="w-fit">
                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                    ATS Compatibility Score: 
                    {selectedTemplate && ` ${RESUME_TEMPLATES.find(t => t.id === selectedTemplate)?.atsScore}%`}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Your resume content will be formatted according to this template
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmTemplate} className="gap-2">
              Use This Template <ArrowRight className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateGallery; 
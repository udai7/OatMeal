"use client";

import { useFormContext } from "@/lib/context/FormProvider";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Check, LayoutGrid } from "lucide-react";
import { themeColors, fontOptions } from "@/lib/utils";
import { updateResume } from "@/lib/actions/resume.actions";
import { useToast } from "../ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

const ThemeOptions = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();
  const { formData, handleInputChange } = useFormContext();
  const [selectedColor, setSelectedColor] = useState(themeColors[0]);
  const [selectedFont, setSelectedFont] = useState(fontOptions[0]);

  useEffect(() => {
    setSelectedColor(formData.themeColor);
    if (formData.fontFamily) {
      setSelectedFont(formData.fontFamily);
    }
  }, [formData.themeColor, formData.fontFamily]);

  const onColorSelect = async (color: any) => {
    setSelectedColor(color);

    handleInputChange({
      target: {
        name: "themeColor",
        value: color,
      },
    });

    const result = await updateResume({
      resumeId: params.id,
      updates: {
        themeColor: color,
      },
    });

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Theme color updated successfully.",
        className: "bg-neutral-900 text-white border-neutral-800",
      });
    } else {
      toast({
        title: "Uh Oh! Something went wrong.",
        description: result?.error,
        variant: "destructive",
      });
    }
  };

  const onFontSelect = async (font: string) => {
    setSelectedFont(font);

    handleInputChange({
      target: {
        name: "fontFamily",
        value: font,
      },
    });

    const result = await updateResume({
      resumeId: params.id,
      updates: {
        fontFamily: font,
      },
    });

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Font updated successfully.",
        className: "bg-neutral-900 text-white border-neutral-800",
      });
    } else {
      toast({
        title: "Uh Oh! Something went wrong.",
        description: result?.error,
        variant: "destructive",
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          className="flex gap-2 bg-primary-700 hover:bg-primary-800 text-white"
        >
          <LayoutGrid className="h-4 w-4" /> Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 bg-black border-neutral-800 text-white p-4"
        align="start"
      >
        <div className="space-y-4">
          <div>
            <h2 className="mb-2 text-sm font-medium text-white">Theme Color</h2>
            <div className="grid grid-cols-5 gap-2">
              {themeColors.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onColorSelect(item)}
                  className="flex justify-center items-center h-8 w-8 rounded-md cursor-pointer hover:scale-110 transition-transform duration-150 ring-2 ring-transparent hover:ring-white/30"
                  style={{
                    background: item,
                  }}
                >
                  {selectedColor == item && (
                    <Check
                      color="#ffffff"
                      strokeWidth={3}
                      width={16}
                      height={16}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-4">
            <h2 className="mb-2 text-sm font-medium text-white">Font Family</h2>
            <Select value={selectedFont} onValueChange={onFontSelect}>
              <SelectTrigger className="w-full bg-neutral-900 border-neutral-700 text-white h-9">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-700 text-white">
                {fontOptions.map((font, index) => (
                  <SelectItem
                    key={index}
                    value={font}
                    className="focus:bg-neutral-800 focus:text-white"
                  >
                    <span style={{ fontFamily: font }}>
                      {font.split(",")[0]}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeOptions;

import { useFormContext } from "@/lib/context/FormProvider";
import { themeColors } from "@/lib/utils";
import React from "react";

function PersonalDetailsPreview() {
  const { formData } = useFormContext();

  return (
    <div>
      <h2
        className="font-bold text-xl text-center"
        style={{
          color: formData?.themeColor || themeColors[0],
        }}
      >
        {formData?.firstName} {formData?.lastName}
      </h2>

      <h2 className="text-center text-sm font-medium text-black">
        {formData?.jobTitle}
      </h2>

      <h2
        className="text-center font-normal text-xs"
        style={{
          color: formData?.themeColor || themeColors[0],
        }}
      >
        {formData?.address}
      </h2>

      <div className="flex justify-between">
        {formData?.phone && (
          <h2
            className="font-normal text-xs"
            style={{
              color: formData?.themeColor || themeColors[0],
            }}
          >
            {formData?.phone}
          </h2>
        )}

        {formData?.portfolio && (
          <a
            href={formData?.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="font-normal text-xs cursor-pointer"
            style={{
              color: formData?.themeColor || themeColors[0],
            }}
          >
            {formData?.portfolio}
          </a>
        )}

        {formData?.linkedin && (
          <a
            href={formData?.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-normal text-xs cursor-pointer"
            style={{
              color: formData?.themeColor || themeColors[0],
            }}
          >
            {formData?.linkedin}
          </a>
        )}

        {formData?.email && (
          <h2
            className="font-normal text-xs"
            style={{
              color: formData?.themeColor || themeColors[0],
            }}
          >
            {formData?.email}
          </h2>
        )}
      </div>

      <hr
        className="border-[1.5px] my-2 mb-5"
        style={{
          borderColor: formData?.themeColor || themeColors[0],
        }}
      />
    </div>
  );
}

export default PersonalDetailsPreview;

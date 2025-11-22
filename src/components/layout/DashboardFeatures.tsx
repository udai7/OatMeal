import { cn } from "@/lib/utils";
import {
    IconSparkles,
    IconPalette,
    IconFileText,
    IconRobot,
    IconDownload,
    IconShare,
    IconDeviceFloppy,
    IconRefresh,
} from "@tabler/icons-react";

export default function DashboardFeatures() {
    const features = [
        {
            title: "AI Writer",
            description:
                "Let our AI assist you in crafting professional resume content with intelligent suggestions.",
            icon: <IconRobot />,
        },
        {
            title: "Resume Score",
            description:
                "Get instant feedback on your resume's strength and tips for improvement.",
            icon: <IconSparkles />,
        },
        {
            title: "Job Match",
            description:
                "See how well your resume matches specific job descriptions.",
            icon: <IconFileText />,
        },
        {
            title: "Cover Letter",
            description:
                "Generate a tailored cover letter to accompany your resume.",
            icon: <IconFileText />,
        },
    ];
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
            {features.map((feature, index) => (
                <Feature key={feature.title} {...feature} index={index} />
            ))}
        </div>
    );
}

const Feature = ({
    title,
    description,
    icon,
    index,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    index: number;
}) => {
    return (
        <div
            className={cn(
                "flex flex-col lg:border-r border-neutral-800/50 py-10 relative group/feature",
                (index === 0 || index === 4) && "lg:border-l border-neutral-800/80",
                index < 4 && "lg:border-b border-neutral-800/80"
            )}
        >
            {index < 4 && (
                <div className="opacity-0 group-hover/feature:opacity-90 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
            )}
            {index >= 4 && (
                <div className="opacity-0 group-hover/feature:opacity-90 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
            )}
            <div className="mb-4 relative z-10 px-10 text-white">{icon}</div>
            <div className="text-lg font-bold mb-2 relative z-10 px-10">
                <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
                <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-white">
                    {title}
                </span>
            </div>
            <p className="text-sm text-white max-w-xs relative z-10 px-10">
                {description}
            </p>
        </div>
    );
};

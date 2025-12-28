"use client";

import Link from "next/link";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FileText, Loader2, MoreVertical } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { deleteResume } from "@/lib/actions/resume.actions";
import { useToast } from "../ui/use-toast";
import { usePathname } from "next/navigation";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";
import { motion } from "motion/react";

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

const ResumeCard = ({
  resume,
  refreshResumes,
}: {
  resume: any;
  refreshResumes: () => void;
}) => {
  if (!resume) {
    return (
      <div className="relative w-full h-[280px] sm:h-[300px] lg:w-[240px] lg:h-[340px] rounded-xl overflow-hidden bg-neutral-900 border border-white/10">
        {/* Skeleton content */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/50 via-neutral-900 to-neutral-800/50">
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
        {/* Document lines skeleton */}
        <div className="p-6 space-y-3">
          <div className="h-3 bg-white/10 rounded w-3/4" />
          <div className="h-3 bg-white/10 rounded w-full" />
          <div className="h-3 bg-white/10 rounded w-5/6" />
          <div className="h-3 bg-white/10 rounded w-2/3" />
          <div className="mt-6 space-y-2">
            <div className="h-2 bg-white/5 rounded w-full" />
            <div className="h-2 bg-white/5 rounded w-full" />
            <div className="h-2 bg-white/5 rounded w-4/5" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-2 bg-white/5 rounded w-full" />
            <div className="h-2 bg-white/5 rounded w-3/4" />
          </div>
        </div>
        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 backdrop-blur-sm border-t border-white/5">
          <div className="h-4 bg-white/10 rounded w-1/2" />
        </div>
      </div>
    );
  }

  const router = useRouter();
  const pathname = usePathname();
  const myResume = JSON.parse(resume);
  const [openAlert, setOpenAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onDelete = async () => {
    setIsLoading(true);

    const result = await deleteResume(myResume.resumeId, pathname);

    setIsLoading(false);
    setOpenAlert(false);

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Resume deleted successfully.",
        className: "bg-black text-white border-neutral-800",
      });

      refreshResumes();
    } else {
      toast({
        title: "Uh Oh! Something went wrong.",
        description: result?.error,
        variant: "destructive",
        className: "bg-black text-white border-neutral-800",
      });
    }
  };

  return (
    <>
      <motion.div
        whileHover="animate"
        className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-neutral-900 dark:border-white/[0.2] border-black/[0.1] w-full h-[280px] sm:h-[300px] lg:w-[240px] lg:h-[340px] rounded-xl p-4 sm:p-6 border flex-shrink-0 flex flex-col overflow-hidden"
      >
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start gap-3 mb-1">
            <div className="p-2 bg-primary-700/20 border border-primary-700/30 rounded-lg shrink-0">
              <FileText className="h-4 w-4 text-primary-500" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-bold text-neutral-600 dark:text-white truncate">
                {myResume.title}
              </div>
              <p className="text-neutral-500 text-xs dark:text-neutral-400">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="w-full mt-3 sm:mt-4 flex-1">
            <Link href={"/my-resume/" + myResume.resumeId + "/view"}>
              <div
                className="bg-gradient-to-b from-pink-100 via-purple-200 to-blue-200 rounded-xl h-28 sm:h-32 lg:h-40 w-full flex items-center justify-center group-hover/card:shadow-xl"
                style={{
                  borderColor: myResume?.themeColor,
                }}
              >
                <img
                  src="/img/blank-cv.png"
                  width={60}
                  height={60}
                  alt="resume thumbnail"
                  className="w-[50px] sm:w-[60px] lg:w-[80px] h-auto"
                />
              </div>
            </Link>
          </div>
          <div className="flex justify-between items-center mt-auto">
            <Link
              href={"/my-resume/" + myResume.resumeId + "/edit"}
              className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white hover:bg-neutral-800 transition-colors inline-block"
            >
              Edit Resume →
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical className="h-4 w-4 cursor-pointer text-white" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() =>
                    router.push("/my-resume/" + myResume.resumeId + "/edit")
                  }
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    router.push("/my-resume/" + myResume.resumeId + "/view")
                  }
                >
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenAlert(true)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>

      <AlertDialog open={openAlert}>
        <AlertDialogContent className="bg-black border-neutral-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              This action cannot be undone. This will permanently delete your
              account and remove your data from our server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setOpenAlert(false)}
              disabled={isLoading}
              className="no-focus bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white border-neutral-700"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white border-none"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp; Deleting
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ResumeCard;

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
import { Loader2, MoreVertical } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { deleteResume } from "@/lib/actions/resume.actions";
import { useToast } from "../ui/use-toast";
import { usePathname } from "next/navigation";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";

const ResumeCard = ({
  resume,
  refreshResumes,
}: {
  resume: any;
  refreshResumes: () => void;
}) => {
  if (!resume) {
    return (
      <div className="!bg-slate-200/30 relative w-[240px] h-[340px] rounded-lg shadow-lg flex flex-col hover:scale-105 transition-all skeleton">
        <div className="flex-1"></div>
        <div className="border-0 p-3 flex justify-between bg-white/40 rounded-b-lg">
          ‎{" "}
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
        className: "bg-white",
      });

      refreshResumes();
    } else {
      toast({
        title: "Uh Oh! Something went wrong.",
        description: result?.error,
        variant: "destructive",
        className: "bg-white",
      });
    }
  };

  return (
    <>
      <div className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-neutral-900 dark:border-white/[0.2] border-black/[0.1] w-[240px] h-[340px] rounded-xl p-6 border flex-shrink-0 flex flex-col">
        <div className="text-xl font-bold text-neutral-600 dark:text-white truncate w-full">
          {myResume.title}
        </div>
        <p className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <div className="w-full mt-4">
          <Link href={"/my-resume/" + myResume.resumeId + "/view"}>
            <div
              className="bg-gradient-to-b from-pink-100 via-purple-200 to-blue-200 rounded-xl h-40 w-full flex items-center justify-center group-hover/card:shadow-xl"
              style={{
                borderColor: myResume?.themeColor,
              }}
            >
              <img
                src="/img/blank-cv.png"
                width={80}
                height={80}
                alt="resume thumbnail"
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

      <AlertDialog open={openAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setOpenAlert(false)}
              disabled={isLoading}
              className="no-focus"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} disabled={isLoading}>
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

"use client";

import { MessageCircle, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { cn } from "@/lib/utils";

const ProductComment = ({
  handleComment,
  handleDeleteComment,
  comments,
  submitted,
}: {
  handleComment: (commentValue: string) => void;
  handleDeleteComment: (commentId: number) => void;
  comments: { comment: string; id: number }[] | undefined;
  submitted: boolean;
}) => {
  const t = useTranslations("Product");
  const [commentValue, setCommentValue] = useState("");

  useEffect(() => {
    setCommentValue("");
  }, [submitted]);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="rounded-sm lg:px-2 px-1 py-1 bg-primary cursor-pointer flex items-center gap-2 border border-white shadow-[0px_0px_0px01px_var(--primary)] hover:shadow-[0px_0px_10px_1px_var(--primary)] duration-300 transition-all">
            <span className="lg:block hidden text-white font-semibold">
              {t("Comment")}
            </span>
            <MessageCircle
              size={18}
              color="white"
              fill={comments && comments.length > 0 ? "white" : "transparent"}
            />
          </div>
        </DialogTrigger>
        <DialogContent
          aria-describedby="comment modal"
          aria-description="comment modal"
          className="!w-[80vw] !max-w-[600px] p-4 flex flex-col gap-2 items-start"
        >
          <DialogTitle className="text-xl">{t("Comment section")}</DialogTitle>
          <div className="w-full">
            <textarea
              name="comment"
              id="comment"
              className="w-full h-40 border border-primary/50 rounded-sm p-2 text-sm sm:text-[16px] "
              placeholder={t("type your comment here")}
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
            ></textarea>
          </div>
          <div
            className={cn(
              "w-full flex items-center gap-2 justify-between",
              comments && comments.length > 0
                ? "justify-between"
                : "justify-end"
            )}
          >
            {comments && comments.length > 0 ? (
              <Dialog>
                <DialogTrigger asChild>
                  <button className="px-2 py-0.5 rounded-sm bg-primary text-white font-semibold cursor-pointer">
                    {t("My comments on this project")}
                  </button>
                </DialogTrigger>
                <DialogContent aria-describedby="my comments" className="">
                  <DialogTitle>My comments</DialogTitle>
                  <div className="flex flex-col gap-2 items-start justify-start">
                    {comments.map((comment, index) => {
                      return (
                        <div
                          key={index}
                          className="relative w-full flex items-center gap-2 justify-between"
                        >
                          <div className="rounded-sm flex-1 border border-primary px-2.5 py-1.5">
                            {comment.comment}
                          </div>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="absolute -top-2 -right-2 p-1 cursor-pointer scale-90 hover:scale-100 bg-red-500 rounded-sm transition-scale duration-200"
                          >
                            <Trash2 className="w-5 h-5 text-white" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </DialogContent>
              </Dialog>
            ) : null}
            <DialogClose asChild className="relative">
              <button
                disabled={commentValue.length <= 0}
                onClick={() => {
                  handleComment(commentValue);
                }}
                className={cn(
                  "px-2 py-0.5 rounded-sm bg-primary text-white font-semibold group",
                  commentValue.length <= 0
                    ? "bg-primary/50 text-white/50 cursor-default"
                    : "bg-primary cursor-pointer"
                )}
              >
                {t("Submit")}

                <div
                  className={cn(
                    "absolute left-0 top-[115%] px-2 py-1 min-w-[250px] group-hover:scale-[1] group-hover:opacity-100 opacity-0 scale-[0] text-foreground text-start text-[13px] rounded-sm bg-background border border-foreground/20 transition-opacity duration-200",
                    commentValue.length <= 0 ? "flex" : "hidden"
                  )}
                >
                  {t("please type your comment to submit")}
                </div>
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductComment;

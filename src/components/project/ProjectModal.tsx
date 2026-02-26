"use client";

import { AppDispatch, RootState } from "@/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Session } from "next-auth";
import { fetchProjects, toggleModal } from "@/store/projectSlice";
import { makeHttpReq } from "@/lib/helper/makeHttpReq";
import { BaseModal } from "../general/BaseModal";
import { Input } from "../ui/input";
import { EmojiPickerInput } from "./EmojiPickerInput";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { showError, showSuccess } from "@/lib/utils";

const emojiRegex = /\p{Extended_Pictographic}/u;

const formSchema = z.object({
  name: z
    .string()
    .min(5, "Text must be at least 5 characters")
    .max(50, "Text too long"),
  emoji: z.string().refine(
    (value) => {
      if (!value) return false;

      const segmenter = new Intl.Segmenter("en", {
        granularity: "grapheme",
      });

      const graphemes = [...segmenter.segment(value)];

      return graphemes.length === 1 && emojiRegex.test(graphemes[0].segment);
    },
    {
      message: "Please select exactly one emoji",
    },
  ),
});

type FormSchemaType = z.infer<typeof formSchema>;

export const ProjectModal = ({ session }: { session: Session | null }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { modal, currentProject } = useSelector(
    (state: RootState) => state.project,
  );

  const userId = session?.user?.id;

  const {
    setValue,
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const emojiValue = useWatch({ control, name: "emoji" });

  useEffect(() => {
    if (currentProject?.edit) {
      setValue("name", currentProject.name || "");
      if (currentProject.emoji) {
        setValue("emoji", currentProject.emoji, { shouldValidate: true });
      }
    } else {
      reset({ name: "", emoji: "" });
    }
  }, [currentProject, setValue, reset]);

  function refreshProjectPage() {
    dispatch(fetchProjects({ page: 1, search: "" }));
    dispatch(toggleModal());
  }

  const onSubmit = async (data: FormSchemaType) => {
    try {
      let res: { message: string };

      if (currentProject?.edit && currentProject?.id) {
        res = (await makeHttpReq<{ name: string; emoji: string }>(
          "PATCH",
          `projects/${currentProject.id}`,
          { name: data.name, emoji: data.emoji },
        )) as { message: string };
      } else {
        res = (await makeHttpReq<{
          name: string;
          userId: string;
          emoji: string;
        }>("POST", "projects", {
          userId: userId ?? "",
          name: data.name,
          emoji: data.emoji,
        })) as { message: string };
      }

      reset();
      refreshProjectPage();
      showSuccess(res.message);
    } catch (error) {
      let message = "something went wrong!";
      if ((error as Error)?.message) message = (error as Error).message;
      console.log(message);
      showError(message);
    }
  };
  return (
    <div>
      <BaseModal
        open={modal}
        onOpenChange={() => dispatch(toggleModal())}
        title={currentProject?.edit ? "Update Project" : "Create Project"}
        description=""
        width={500}
        height={280}
        footer={<></>}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-3 p-3">
            <Input
              {...register("name")}
              className="placeholder:text-xs"
              id="name-1"
              name="name"
              placeholder="Project..."
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-3 p-3">
            <EmojiPickerInput
              value={emojiValue || ""}
              onChange={(val) =>
                setValue("emoji", val, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
              placeholder="Project with Emojis"
              id="emoji-name"
              name="emoji=name"
            />
            {errors.emoji && (
              <p className="text-red-500 text-xs">{errors.emoji.message}</p>
            )}
          </div>

          <div className="flex justify-between">
            <div></div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => dispatch(toggleModal())}>
                Cancel
              </Button>
              <Button
                className="cursor-pointer"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>{currentProject?.edit ? "Update" : "Create"}</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </BaseModal>
    </div>
  );
};

import { useState } from "react";
import { Form, useNavigate } from "react-router";
import { z } from "zod";
import { twMerge } from "tailwind-merge";
import { DottedGlowBackground } from "components/ui/dotted-glow-background";
import { motion } from "motion/react";

export default function EmailForm({
  className,
  isusedInDialog = false,
}: {
  className?: string;
  isusedInDialog?: boolean;
}) {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = FormSchema.safeParse(Object.fromEntries(formData));
    if (!data.success) {
      setError(data.error.errors[0].message);
      return;
    }
    navigate(`/inbox/${data.data.email}`);
  };
  const FormSchema = z.object({
    email: z.string().min(1, "Email placeholder is required"),
  });

  return (
    <div
      className={twMerge(
        "rounded-[20px] flex items-center  gap-4 w-full h-full",
        className,
        isusedInDialog && "rounded-md"
      )}
    >
      <Form
        onSubmit={handleSubmit}
        className={twMerge(
          "flex flex-col  justify-center rounded-3xl h-full w-full gap-4 text-[#f8f4ec]",
          isusedInDialog && "bg-neutral-900 rounded-md"
        )}
        method="post"
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full "
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-semibold text-neutral-200">
              Generate your own temp{" "}
              <span className="font-playwrite text-5xl align-baseline">
                Email
              </span>
              <span className="text-neutral-400"> fast and easy</span>
            </h1>
            <p className="text-sm text-neutral-400 leading-relaxed">
              enter the slug of your required email and hit enter to start
              receiving emails on the mail, your id will be example@maailit.com
            </p>
            <p className="text-xs text-neutral-500 italic">
              We dont care about mobile users get a bigger screen or dont use
              our app :)
            </p>
          </div>
          <div className="flex flex-col mt-4 gap-2 mb-2">
            <label
              className={twMerge("text-xs font-medium text-neutral-200")}
              htmlFor="email"
            >
              Email Placeholder
            </label>
            <div className="flex flex-col gap-1">
              <motion.input
                autoFocus
                placeholder="Enter email placeholder, eg. jhon"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                id="email"
                name="email"
                className={twMerge(
                  "min-w-[300px] rounded-lg px-3 font-medium bg-neutral-900/70 border border-neutral-800 text-neutral-50 placeholder:text-neutral-500 text-sm h-12 focus:outline-none focus:ring-2 focus:ring-[#B97FD4] transition-shadow"
                )}
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <motion.button
              type="submit"
              className={twMerge(
                "text-neutral-50 w-full bg-neutral-900 text-sm font-semibold hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#e7c5f7]/80 h-12 rounded-md justify-center flex items-center gap-2 hover:bg-neutral-800 transition-colors group",
                isusedInDialog &&
                  "bg-slate-100 text-neutral-900 hover:bg-neutral-600"
              )}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              Go to Inbox
              <span className="inline-flex items-center justify-center">
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                  initial={false}
                  animate={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <path
                    fillRule="evenodd"
                    d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </motion.svg>
              </span>
            </motion.button>
          </div>
        </motion.div>
      </Form>
      <div
        className={twMerge(
          "w-full relative rounded-3xl  h-full flex items-center justify-center",
          isusedInDialog && "hidden"
        )}
      >
        <img
          src="/email-1.svg"
          alt="email-image"
          className="size-[30%] object-cover"
        />
        <DottedGlowBackground
          className="pointer-events-none mask-radial-to-90% mask-radial-at-center opacity-40 "
          opacity={1}
          gap={10}
          radius={1.6}
          colorLightVar="--color-neutral-500"
          glowColorLightVar="--color-neutral-600"
          colorDarkVar="--color-neutral-500"
          glowColorDarkVar="--color-sky-800"
          backgroundOpacity={0}
          speedMin={0.3}
          speedMax={1.6}
          speedScale={1}
        />
      </div>
    </div>
  );
}

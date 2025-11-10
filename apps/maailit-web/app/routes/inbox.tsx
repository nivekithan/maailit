import usePartySocket from "partysocket/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { twMerge } from "tailwind-merge";
import { useHotkeys } from "react-hotkeys-hook";
import NewMailDialog from "~/components/NewMailDailog";
import { motion } from "motion/react";

export type EmailType = {
  id: number;
  to: string;
  from: string;
  subject: string;
  body: string;
  createdAt: string;
  ctaType: "NONE" | "BUTTON" | "LINK";
  ctaContent: string | null;
};

export default function Inbox() {
  const [selectedEmail, setSelectedEmail] = useState<EmailType | null>(null);
  const [mailData, setMailData] = useState<Array<EmailType>>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isNewEmailDialogOpen, setIsNewEmailDialogOpen] =
    useState<boolean>(false);

  const { slug } = useParams<{ slug: "1" }>();

  const socket = usePartySocket({
    host: "maailit-backend.nivekithan.workers.dev",
    room: slug,
    party: "realtime-emails",

    onOpen() {
      console.log("Connected to the party!");
    },
    onMessage(evt) {
      console.log("Received a message:", evt.data);
      const message = JSON.parse(evt.data as string) as EmailType[];
      console.log(message, "message");
      setMailData((prevMessages) => [...message, ...prevMessages]);
    },
    onError(err) {
      console.log(err);
    },
  });

  useHotkeys(
    ["ctrl+down", "meta+down"],
    () => {
      if (!mailData.length) return;
      // If nothing is open, open the first email; otherwise go to next
      setSelectedIndex((prev) => {
        if (selectedEmail === null) {
          setSelectedEmail(mailData[0]);
          return 0;
        }
        const next = Math.min(prev + 1, mailData.length - 1);
        setSelectedEmail(mailData[next]);
        return next;
      });
    },
    {},
    [mailData, selectedEmail]
  );

  useHotkeys(
    ["ctrl+up", "meta+up"],
    () => {
      if (!mailData.length) return;
      setSelectedIndex((prev) => {
        const prevIdx = Math.max(prev - 1, 0);
        setSelectedEmail(mailData[prevIdx]);
        return prevIdx;
      });
    },
    {},
    [mailData]
  );

  useHotkeys(
    ["ctrl+c", "meta+c"],
    () => {
      if (selectedEmail?.ctaContent) {
        navigator.clipboard.writeText(selectedEmail.ctaContent);
      }
    },
    {},
    [selectedEmail]
  );

  useHotkeys(["ctrl+k", "meta+k"], (e) => {
    e.preventDefault();
    setIsNewEmailDialogOpen(!isNewEmailDialogOpen);
  });

  useEffect(() => {
    if (!mailData.length) return;
    const safeIndex = Math.min(selectedIndex, mailData.length - 1);
    if (selectedEmail !== mailData[safeIndex]) {
      setSelectedEmail(mailData[safeIndex]);
    }
  }, [mailData, selectedIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full p-2 bg-neutral-800 bg rounded-lg flex flex-1 overflow-y-auto max-h-[calc(100vh-180px)] gap-2 h-full text-neutral-200"
    >
      <NewMailDialog
        isOpen={isNewEmailDialogOpen}
        setIsOpen={setIsNewEmailDialogOpen}
      />
      <div className="w-[25%] p-1 bg-neutral-900/60 border border-neutral-800 sticky top-0 overflow-y-auto h-full rounded-lg no-scrollbar backdrop-blur">
        {mailData.map((mail) => (
          <motion.button
            onClick={() => setSelectedEmail(mail)}
            key={mail.id}
            className={twMerge(
              "flex flex-col cursor-pointer gap-2 w-full p-2 text-left transition-colors border-b border-neutral-800",
              selectedEmail?.id === mail.id
                ? "bg-neutral-800"
                : "hover:bg-neutral-800/60"
            )}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            <p className="text-sm font-semibold text-neutral-100">
              {mail.from}
            </p>
            <p className="text-xs text-neutral-400 line-clamp-1">
              {mail.subject}
            </p>
          </motion.button>
        ))}
      </div>
      {/* Email display */}
      <div className="w-[80%] h-full overflow-y-auto no-scrollbar flex flex-col gap-2">
        {selectedEmail && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="w-full h-full bg-neutral-900/60 text-neutral-100 border border-neutral-800 rounded-lg p-3">
              <motion.button
                onClick={() =>
                  navigator.clipboard.writeText(selectedEmail.from)
                }
                className="cursor-pointer"
                whileTap={{ scale: 0.97 }}
              >
                <p className="px-2 py-1 text-xs rounded-full bg-[#16a34a] w-fit text-white">
                  {selectedEmail.from}
                </p>
              </motion.button>
              <div className="flex flex-col gap-2 mt-4">
                <p className="text-base font-semibold w-min text-neutral-100">
                  {selectedEmail.subject}
                </p>
                <div
                  className="w-full h-full text-neutral-200"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

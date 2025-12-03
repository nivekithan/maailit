"use client";
import { EmailType } from "@/lib/queryHooks";
import { ArrowDownUp, Ban, Copy, Pointer } from "lucide-react";
import { useParams } from "next/navigation";
import usePartySocket from "partysocket/react";
import React, { useEffect, useState } from "react";

function MailWrapper() {
  const [selectedEmail, setSelectedEmail] = useState<EmailType | null>(null);
  const [mailData, setMailData] = useState<Array<EmailType>>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const { slug } = useParams<{ slug: "1" }>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" && selectedIndex > 0) {
        setSelectedIndex((prevIndex) => prevIndex - 1);
      } else if (
        event.key === "ArrowDown" &&
        selectedIndex < mailData.length - 1
      ) {
        setSelectedIndex((prevIndex) => prevIndex + 1);
      } else if ((event.ctrlKey || event.metaKey) && event.key === "c") {
        if (selectedEmail?.ctaContent)
          navigator.clipboard.writeText(selectedEmail.ctaContent);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, mailData, selectedEmail?.ctaContent]);

  useEffect(() => {
    if (mailData.length > 0) {
      setSelectedEmail(mailData[selectedIndex]);
    }
  }, [selectedIndex, mailData]);

  useEffect(() => {
    if (mailData.length > 0 && !selectedEmail) {
      setSelectedEmail(mailData[0]);
      setSelectedIndex(0);
    }
  }, [mailData, selectedEmail]);
  console.log(selectedIndex);
  return (
    <div className="flex space-x-6 height-nav">
      <div className="w-1/4 bg-white p-2 rounded-xl">
        {mailData?.length === 0 ? (
          <div className="flex h-full justify-center items-center">
            <p className="flex text-gray-500">
              <span>
                <Ban className="mr-4" />
              </span>
              No emails yet
            </p>
          </div>
        ) : (
          mailData?.map((email, index) => (
            <div
              key={email.id}
              className={`p-2 mb-2 cursor-pointer rounded-xl ${
                selectedEmail?.id === email.id
                  ? "bg-blue-primary text-white antialiased"
                  : ""
              }`}
              onClick={() => {
                setSelectedEmail(email);
                setSelectedIndex(index);
              }}
            >
              <p className="font-semibold text-lg antialiased">
                {email.subject}
              </p>
              <p
                className={`text-xs text-gray-200 ${
                  selectedEmail?.id === email.id
                    ? "text-gray-100"
                    : "text-gray-800 "
                }`}
              >
                {new Date(email.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="w-full h-full p-4 bg-white rounded-xl">
        {selectedEmail ? (
          <div>
            <h2 className="text-xl font-bold mb-4">{selectedEmail.subject}</h2>
            <div
              className="email-body"
              dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
            />
          </div>
        ) : (
          <div className="text-gray-500 flex items-center justify-center h-full">
            <div className="flex flex-col space-y-4">
              <p className="flex">
                <span>
                  <Pointer className="mr-4" />
                </span>{" "}
                Select an email to view its content
              </p>
              <p className="flex">
                <span>
                  <Copy className="mr-4" />
                </span>
                ctr + c or cmd + c to copy otp/link
              </p>
              <p className="flex">
                <span>
                  <ArrowDownUp className="mr-4" />
                </span>
                use arrow keys to navigate between mails
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MailWrapper;

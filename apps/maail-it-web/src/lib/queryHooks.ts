import { useQuery } from "@tanstack/react-query";
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

export function useFetchMails({ slug }: { slug: string }) {
  const fetchMails = async () => {
    const response = await fetch(
      `https://maailit-backend.nivekithan.workers.dev/email/${slug}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch chats");
    }
    return (await response.json()) as EmailType[];
  };
  const { data, isFetching } = useQuery({
    queryKey: ["getMails"],
    queryFn: fetchMails,
  });
  console.log(data);
  return { data, isFetching };
}

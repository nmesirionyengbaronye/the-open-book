import { createFileRoute } from "@tanstack/react-router";
import WaitlistPage from "@/components/WaitlistPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Join the Waitlist — The book that learns you" },
      {
        name: "description",
        content:
          "An EdTech experience for students who've felt lost in the textbook. Join the waitlist.",
      },
    ],
  }),
  component: WaitlistPage,
});

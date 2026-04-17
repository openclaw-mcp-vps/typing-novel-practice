import Link from "next/link";
import { Check, Clock, Keyboard, Trophy } from "lucide-react";

import { CheckoutButton } from "@/components/CheckoutButton";
import { FadeIn } from "@/components/FadeIn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCheckoutUrl } from "@/lib/lemonsqueezy";

const faqs = [
  {
    question: "How is this better than random typing drills?",
    answer:
      "You train on coherent, engaging prose from classic novels. That keeps your attention high, so you sustain focused practice longer and improve faster."
  },
  {
    question: "Do I need to finish a whole book?",
    answer:
      "No. You progress chapter by chapter and can stop anytime. Your progress is saved so every session picks up where you left off."
  },
  {
    question: "Is this good for work performance?",
    answer:
      "Yes. The app emphasizes mistake-free typing under realistic sentence structure, which transfers directly to emails, docs, and chat-heavy jobs."
  }
];

export default function Home() {
  const checkoutUrl = getCheckoutUrl();

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-10">
      <FadeIn><section className="relative overflow-hidden rounded-2xl border bg-[var(--surface)] p-8 md:p-12">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#1f6feb26] blur-3xl" />
        <Badge className="mb-4 w-fit">Typing practice for serious professionals</Badge>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">Learn typing by retyping classic novels</h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
          Stop grinding meaningless drills. Build typing speed and precision on literature that holds your attention, tracks your improvement, and turns daily practice into a habit you enjoy.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/practice">
            <Button size="lg">Start Practicing</Button>
          </Link>
          <a href="#pricing">
            <Button size="lg" variant="outline">
              See Pricing
            </Button>
          </a>
        </div>
      </section></FadeIn>

      <FadeIn delay={0.06}><section className="mt-12 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Clock className="h-5 w-5 text-[#9ec3ff]" />
            <CardTitle className="text-base">The problem</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[var(--muted)]">
            Most typists plateau at 40 to 60 WPM because practice is boring and inconsistent. Slow typing steals hours every week in remote work.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Keyboard className="h-5 w-5 text-[#9ec3ff]" />
            <CardTitle className="text-base">The solution</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[var(--muted)]">
            Type chapter excerpts from enduring novels while seeing real-time net WPM, gross WPM, and accuracy. Every session builds practical fluency.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Trophy className="h-5 w-5 text-[#9ec3ff]" />
            <CardTitle className="text-base">The outcome</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[var(--muted)]">
            Better typing rhythm, fewer mistakes, and measurable progress that translates directly to faster communication and output at work.
          </CardContent>
        </Card>
      </section></FadeIn>

      <FadeIn delay={0.12}><section className="mt-12">
        <h2 className="text-2xl font-bold">Who this is for</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {["Remote workers typing 4+ hours/day", "Students writing papers and notes", "Literature lovers building a practical skill"].map((item) => (
            <div className="rounded-lg border bg-[var(--surface)] p-4 text-sm" key={item}>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#8ce99a]" />
                {item}
              </div>
            </div>
          ))}
        </div>
      </section></FadeIn>

      <FadeIn delay={0.18}><section className="mt-12" id="pricing">
        <Card className="mx-auto max-w-xl border-[#1f6feb55]">
          <CardHeader>
            <CardTitle className="text-3xl">$5/month</CardTitle>
            <CardDescription>Unlimited chapter practice, saved progress, and performance dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li>Real-time net WPM, gross WPM, and accuracy feedback</li>
              <li>Chapter progression across multiple classic novels</li>
              <li>Personal dashboard with rolling performance trends</li>
              <li>Cookie-based instant access after checkout</li>
            </ul>
            <CheckoutButton checkoutUrl={checkoutUrl} />
          </CardContent>
        </Card>
      </section></FadeIn>

      <FadeIn delay={0.12}><section className="mt-12">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <div className="mt-4 space-y-3">
          {faqs.map((faq) => (
            <Card key={faq.question}>
              <CardHeader>
                <CardTitle className="text-base">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-[var(--muted)]">{faq.answer}</CardContent>
            </Card>
          ))}
        </div>
      </section></FadeIn>
    </main>
  );
}

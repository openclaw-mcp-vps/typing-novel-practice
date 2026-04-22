"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookText, BriefcaseBusiness, CheckCircle2, Gauge, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";

interface LandingPageProps {
  hasAccess: boolean;
}

const painPoints = [
  {
    title: "Repetitive drills waste attention",
    description:
      "Most typing tools recycle random words and disconnected sentences. Motivation drops before speed improves.",
  },
  {
    title: "Remote work rewards fast output",
    description:
      "Docs, chat, tickets, and email all depend on typing. At 45 WPM, routine communication can burn hours each week.",
  },
  {
    title: "Plateaus feel permanent",
    description:
      "Without feedback on accuracy and pace, many people stall in the 40 to 60 WPM range for years.",
  },
];

const solutionPoints = [
  "Retype memorable passages from classic novels instead of random drills.",
  "Track live WPM and accuracy while every character is checked in real time.",
  "Progress chapter by chapter, unlock books, and build momentum with visible streaks.",
  "Review performance history on a personal dashboard to break plateaus intentionally.",
];

const faq = [
  {
    question: "Who is this for?",
    answer:
      "Typing Novel Practice is built for people who type several hours per day: remote professionals, students, and anyone who writes for work.",
  },
  {
    question: "What happens after I purchase?",
    answer:
      "You complete checkout on Stripe, then visit the unlock page and confirm your purchase email. Access is stored in a secure cookie for ongoing use.",
  },
  {
    question: "Do you track both speed and accuracy?",
    answer:
      "Yes. WPM, accuracy, mistakes, and chapter-level bests are tracked on every completed attempt.",
  },
  {
    question: "Can I use it on mobile?",
    answer:
      "Yes. The interface is responsive for phones and tablets, and gives the full chapter progression and progress stats experience.",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export function LandingPage({ hasAccess }: LandingPageProps) {
  return (
    <main className="relative overflow-hidden pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-56 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute right-0 top-72 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 sm:p-10"
        >
          <p className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium tracking-wider text-emerald-200 uppercase">
            Learn typing by retyping classic novels
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-100 sm:text-5xl">
            Increase speed and accuracy with literature that keeps you engaged.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Train with chapter-based passages from timeless books, not random word lists. Build a faster, cleaner typing rhythm you can feel during real work.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK}>
              <Button size="lg">Start for $5/month</Button>
            </a>
            <Link href="/unlock">
              <Button size="lg" variant="outline">
                I already purchased
              </Button>
            </Link>
            {hasAccess ? (
              <Link href="/practice">
                <Button size="lg" variant="secondary">
                  Continue Practice
                </Button>
              </Link>
            ) : null}
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-100">
                <Gauge className="h-4 w-4 text-emerald-300" aria-hidden />
                <p className="font-medium">Real-time WPM</p>
              </div>
              <p className="text-sm text-slate-400">
                Watch your speed update while you type each sentence.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-100">
                <BookText className="h-4 w-4 text-emerald-300" aria-hidden />
                <p className="font-medium">Chapter Progression</p>
              </div>
              <p className="text-sm text-slate-400">
                Unlock chapters by completing your current one with confidence.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-100">
                <Trophy className="h-4 w-4 text-emerald-300" aria-hidden />
                <p className="font-medium">Performance Dashboard</p>
              </div>
              <p className="text-sm text-slate-400">
                Spot trends in speed and accuracy to break your plateau.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="problem" className="mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
        >
          <div className="mb-6 flex items-center gap-2 text-slate-300">
            <BriefcaseBusiness className="h-4 w-4 text-emerald-300" aria-hidden />
            <h2 className="text-2xl font-semibold text-slate-100">The Problem</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {painPoints.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
              >
                <h3 className="text-lg font-semibold text-slate-100">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
              </article>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="solution" className="mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 sm:p-10"
        >
          <h2 className="text-2xl font-semibold text-slate-100">The Solution</h2>
          <p className="mt-3 max-w-3xl text-slate-300">
            Typing Novel Practice turns a daily career skill into a reading habit you can stick with. You train consistency and speed while moving through books you actually want to finish.
          </p>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {solutionPoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-200"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      <section id="pricing" className="mx-auto mt-14 max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="rounded-3xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500/15 to-slate-950 p-6 sm:p-10"
        >
          <p className="text-sm uppercase tracking-wider text-emerald-200">Pricing</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-100">$5 / month</h2>
          <p className="mt-3 text-slate-300">
            Unlimited chapter practice, live typing analytics, and progress tracking designed for people who type for a living.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK}>
              <Button size="lg">Buy Access</Button>
            </a>
            <Link href="/unlock">
              <Button size="lg" variant="outline">
                Unlock Existing Purchase
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <section id="faq" className="mx-auto mt-14 max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="text-2xl font-semibold text-slate-100">FAQ</h2>
          <div className="mt-4 space-y-3">
            {faq.map((item) => (
              <article
                key={item.question}
                className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
              >
                <h3 className="text-base font-semibold text-slate-100">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.answer}</p>
              </article>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}

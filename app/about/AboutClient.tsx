'use client';

import { motion } from "framer-motion";
import { BookOpen, Target, Users, Lightbulb, Award } from "lucide-react";

const SECTIONS = [
  { icon: BookOpen, title: "University Uploaded Intelligence", body: "A new kind of AI study companion that works from your actual course materials." },
  { icon: Target, title: "Precision Answers", body: "No generic answers. Every response cites your exact slides, notes, or textbook page." },
  { icon: Users, title: "Community Driven", body: "Built by students, for students. Your classmates' uploads make your answers better." },
  { icon: Lightbulb, title: "Multi-Lingual", body: "We speak Pidgin, Igbo, Yoruba, Hausa, and English. Ask how you learn." },
  { icon: Award, title: "Earn While You Learn", body: "Upload notes, earn credits. The more you contribute, the more you get back." },
];

export default function AboutClient() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-gold">
            About Uni UI
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Built by a student in Owerri who was tired of failing and scavenging for materials.
          </p>
        </div>
        
        <div className="space-y-8">
          {SECTIONS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.1 }}
              className="glass-strong rounded-2xl p-8 flex gap-6 items-start"
            >
              <div className="w-14 h-14 rounded-xl bg-gold/15 grid place-items-center shrink-0">
                <s.icon className="w-7 h-7 text-gold" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-semibold">{s.title}</h2>
                <p className="mt-2 text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
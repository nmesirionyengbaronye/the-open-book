'use client';

import { motion } from "framer-motion";
import { Users, BookOpen, Sparkles, Flag } from "lucide-react";

export default function AboutClient() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-gold">
            About Uni UI
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Built in a FUTO hostel room by a student who refused to fail.
          </p>
        </div>
        
        <div className="relative pl-4 sm:pl-8">
          {/* Timeline line */}
          <div className="absolute left-0 sm:left-4 top-0 bottom-0 w-0.5 bg-gold/30" />
          
          {/* Timeline items */}
          <div className="space-y-12">
            {/* The Problem */}
            <motion.div
              key="problem"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.1 }}
              className="relative flex items-start"
            >
              <div className="absolute left-0 sm:left-4 top-2.5 -translate-x-1/2 flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/60 flex items-center justify-center">
                  <Users className="w-4 h-4 text-gold" />
                </div>
              </div>
              <div className="ml-4 sm:ml-6 w-full">
                <h2 className="text-2xl font-display font-semibold text-gold">
                  THE PROBLEM
                </h2>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Lectures move fast. Notes are scattered. Past questions are hard to find. 
                  Tutors are expensive and often give generic answers that don't match your syllabus. 
                  You're left guessing, wasting time, and risking failure—especially when resources 
                  are scarce and the system feels stacked against you.
                </p>
              </div>
            </motion.div>
            
            {/* The Solution */}
            <motion.div
              key="solution"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.2 }}
              className="relative flex items-start"
            >
              <div className="absolute left-0 sm:left-4 top-2.5 -translate-x-1/2 flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/60 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-gold" />
                </div>
              </div>
              <div className="ml-4 sm:ml-6 w-full">
                <h2 className="text-2xl font-display font-semibold text-gold">
                  THE SOLUTION
                </h2>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Uni UI flips the script: YOU upload your course materials, and our AI structures 
                  them into a personal, searchable knowledge base. Ask any question in plain English 
                  (or Pidgin), and get answers traced back to YOUR notes, slides, or past papers—no 
                  internet noise, no hallucinations. It's like having your lecturer's brain, tuned 
                  to your exact course, in your pocket.
                </p>
              </div>
            </motion.div>
            
            {/* The Name */}
            <motion.div
              key="name"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.3 }}
              className="relative flex items-start"
            >
              <div className="absolute left-0 sm:left-4 top-2.5 -translate-x-1/2 flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/60 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-gold" />
                </div>
              </div>
              <div className="ml-4 sm:ml-6 w-full">
                <h2 className="text-2xl font-display font-semibold text-gold">
                  THE NAME
                </h2>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Uni UI stands for <strong>University Uploaded Intelligence</strong>. 
                  It's a declaration: your university's knowledge—uploaded by you and your 
                  classmates—becomes the intelligent foundation for your success. 
                  No external AI. No generic datasets. Just YOUR materials, elevated.
                </p>
              </div>
            </motion.div>
            
            {/* The Goal */}
            <motion.div
              key="goal"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.4 }}
              className="relative flex items-start"
            >
              <div className="absolute left-0 sm:left-4 top-2.5 -translate-x-1/2 flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/60 flex items-center justify-center">
                  <Flag className="w-4 h-4 text-gold" />
                </div>
              </div>
              <div className="ml-4 sm:ml-6 w-full">
                <h2 className="text-2xl font-display font-semibold text-gold">
                  THE GOAL
                </h2>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  To make every West African student feel equipped, not overwhelmed. 
                  To turn the struggle for resources into a collective advantage—where 
                  one student's upload helps another's understanding. 
                  We start with FUTO, but the vision is clear: no student should fail 
                  for lack of access to the right explanations. Education is a right, 
                  and Uni UI is here to defend it.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
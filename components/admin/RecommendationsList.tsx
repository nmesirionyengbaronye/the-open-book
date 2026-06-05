'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Calendar, User } from 'lucide-react';

interface Recommendation {
  full_name: string;
  recommendation: string;
  created_at: string;
}

export function RecommendationsList({ recommendations }: { recommendations: Recommendation[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-gold" />
          Student Recommendations
        </h2>
        <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-medium border border-gold/20">
          {recommendations.length} Total
        </span>
      </div>

      {recommendations.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {recommendations.map((rec, i) => (
            <motion.div
              key={`${rec.full_name}-${rec.created_at}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 glass rounded-xl border border-gold/10 hover:border-gold/30 transition-all flex flex-col gap-4 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-white group-hover:text-gold transition-colors">{rec.full_name}</p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(rec.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "{rec.recommendation}"
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-xl p-12 text-center border border-dashed border-gold/20">
          <MessageSquare className="w-12 h-12 text-gold/20 mx-auto mb-4" />
          <p className="text-muted-foreground">No recommendations have been submitted yet.</p>
        </div>
      )}
    </div>
  );
}

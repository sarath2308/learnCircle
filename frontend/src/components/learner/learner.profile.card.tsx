import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileProps {
  instructorId: string;
  name: string;
  title: string;
  rating: number;
  profileUrl: string;
}

const ProfessionalProfileCard = ({ name, title, rating, profileUrl }: ProfileProps) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Card className="relative group overflow-hidden transition-all duration-300 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm">
      <CardContent className="p-4 flex flex-col items-center">
        {/* Smaller Avatar for 4-col compatibility */}
        <div className="relative mb-3">
          <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-300" />
          <Avatar className="h-16 w-16 border-2 border-white dark:border-slate-800 shadow-md">
            <AvatarImage src={profileUrl ?? "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" } alt={name} className="object-cover" />
            <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="text-center w-full space-y-0.5">
          <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-50 truncate w-full">
            {name}
          </h3>
          <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-tight truncate w-full">
            {title}
          </p>
        </div>

        <div className="mt-3 flex items-center gap-1 px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
            {rating.toFixed(1)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalProfileCard;
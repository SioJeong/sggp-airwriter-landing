import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export default function StatCard({ title, description, icon }: StatCardProps) {
  return (
    <div className="bg-zinc-800 p-8 rounded-2xl flex items-center">
      <div className="bg-zinc-700 w-16 h-16 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-3xl md:text-4xl font-bold mb-2">{title}</h3>
        <p className="text-gray-300 break-keep">{description}</p>
      </div>
    </div>
  );
}

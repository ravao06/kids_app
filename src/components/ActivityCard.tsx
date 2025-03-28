
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';

interface ActivityCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ title, description, icon, color, route }) => {
  return (
    <Link to={route}>
      <Card className={`activity-card cursor-pointer overflow-hidden border-2 border-${color} hover:border-${color}`}>
        <div className={`h-2 w-full bg-${color}`}></div>
        <CardHeader className="pt-6">
          <div className={`w-16 h-16 rounded-full bg-${color} bg-opacity-20 flex items-center justify-center mb-4 mx-auto`}>
            <span className="text-4xl">{icon}</span>
          </div>
          <CardTitle className="text-xl text-center font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center">{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ActivityCard;

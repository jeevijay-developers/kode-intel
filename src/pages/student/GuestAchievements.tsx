import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Star,
  Lock,
  Rocket,
  BookOpen,
  Target,
  Flame,
  Award,
  UserPlus,
} from "lucide-react";

const lockedAchievements = [
  {
    id: 1,
    name: "First Steps",
    description: "Complete your first lesson",
    icon: BookOpen,
    points: 10,
    progress: 0,
    target: 1,
    color: "turquoise",
  },
  {
    id: 2,
    name: "Quiz Master",
    description: "Score 100% on any quiz",
    icon: Target,
    points: 25,
    progress: 0,
    target: 1,
    color: "sunny",
  },
  {
    id: 3,
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: Flame,
    points: 50,
    progress: 0,
    target: 7,
    color: "coral",
  },
  {
    id: 4,
    name: "Course Champion",
    description: "Complete an entire course",
    icon: Trophy,
    points: 100,
    progress: 0,
    target: 1,
    color: "primary",
  },
  {
    id: 5,
    name: "Star Collector",
    description: "Earn 500 XP points",
    icon: Star,
    points: 75,
    progress: 0,
    target: 500,
    color: "sunny",
  },
  {
    id: 6,
    name: "Code Explorer",
    description: "Run 10 programs in Code Lab",
    icon: Rocket,
    points: 40,
    progress: 0,
    target: 10,
    color: "secondary",
  },
];

const lockedBadges = [
  { name: "Beginner", icon: Award, color: "turquoise", points: 0 },
  { name: "Explorer", icon: Rocket, color: "primary", points: 100 },
  { name: "Achiever", icon: Star, color: "sunny", points: 250 },
  { name: "Champion", icon: Trophy, color: "coral", points: 500 },
];

export default function GuestAchievements() {
  const navigate = useNavigate();

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      turquoise: "text-turquoise bg-turquoise/20",
      sunny: "text-sunny bg-sunny/20",
      coral: "text-coral bg-coral/20",
      primary: "text-primary bg-primary/20",
      secondary: "text-secondary bg-secondary/20",
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Achievements
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Sign up to start earning achievements and badges!
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 bg-gradient-to-r from-primary to-secondary text-xs sm:text-sm"
          onClick={() => navigate("/student/signup")}
        >
          <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Sign Up to Earn
        </Button>
      </div>

      {/* Stats Preview */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-2.5 sm:p-3 lg:p-4 text-center">
            <Trophy className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-primary mx-auto mb-1" />
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">0</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Achievements</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-sunny/10 to-sunny/5 border-sunny/20">
          <CardContent className="p-2.5 sm:p-3 lg:p-4 text-center">
            <Star className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-sunny mx-auto mb-1" />
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-sunny">0</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Total XP</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-coral/10 to-coral/5 border-coral/20">
          <CardContent className="p-2.5 sm:p-3 lg:p-4 text-center">
            <Award className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-coral mx-auto mb-1" />
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-coral">0</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Badges</p>
          </CardContent>
        </Card>
      </div>

      {/* Badges Preview */}
      <Card>
        <CardHeader className="p-3 sm:p-4 lg:p-6 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
            <Award className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Badges to Unlock
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {lockedBadges.map((badge) => {
              const IconComponent = badge.icon;
              return (
                <div
                  key={badge.name}
                  className="relative p-3 sm:p-4 rounded-xl bg-muted/50 border border-border/50 text-center opacity-50"
                >
                  <Lock className="h-3 w-3 sm:h-4 sm:w-4 absolute top-2 right-2 text-muted-foreground" />
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${getColorClass(
                      badge.color
                    )}`}
                  >
                    <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <p className="font-medium text-xs sm:text-sm">{badge.name}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {badge.points} XP needed
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements Preview */}
      <Card>
        <CardHeader className="p-3 sm:p-4 lg:p-6 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Achievements to Earn
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {lockedAchievements.map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className="relative flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-muted/30 border border-border/50 opacity-50"
                >
                  <Lock className="h-3 w-3 absolute top-2 right-2 text-muted-foreground" />
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${getColorClass(
                      achievement.color
                    )}`}
                  >
                    <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-medium text-xs sm:text-sm truncate">
                        {achievement.name}
                      </h3>
                      <Badge variant="outline" className="text-[10px] sm:text-xs shrink-0 ml-2">
                        +{achievement.points} XP
                      </Badge>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 truncate">
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Progress value={0} className="flex-1 h-1.5" />
                      <span className="text-[10px] text-muted-foreground">
                        0/{achievement.target}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-primary/20">
        <CardContent className="p-4 sm:p-6 text-center">
          <Rocket className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3" />
          <h3 className="font-bold text-base sm:text-lg mb-1">
            Ready to Start Your Journey?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4">
            Sign up now to track progress, earn achievements, and unlock badges!
          </p>
          <Button
            className="gap-1.5 bg-gradient-to-r from-primary to-secondary"
            onClick={() => navigate("/student/signup")}
          >
            <UserPlus className="h-4 w-4" />
            Sign Up Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

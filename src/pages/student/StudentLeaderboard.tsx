import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedCounter } from "@/components/dashboard/AnimatedCounter";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import {
  Trophy,
  Star,
  Flame,
  Medal,
  Crown,
  Award,
  TrendingUp,
  Users,
  Sparkles,
  ArrowLeft,
  Filter,
} from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";

interface StudentWithPoints {
  id: string;
  student_name: string;
  class: string;
  section: string | null;
  total_points: number;
  current_level: number;
  streak_days: number;
  badge_count: number;
}

interface OutletContext {
  student: {
    id: string;
    student_name: string;
  };
}

export default function StudentLeaderboard() {
  const navigate = useNavigate();
  const { student } = useOutletContext<OutletContext>();
  const [activeTab, setActiveTab] = useState("xp");
  const [classFilter, setClassFilter] = useState<string | null>(null);

  // Fetch leaderboard data
  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ["leaderboard", activeTab, classFilter],
    queryFn: async () => {
      // Get all students with their points
      const { data: students, error: studentsError } = await supabase
        .from("students")
        .select("id, student_name, class, section")
        .eq("is_active", true);

      if (studentsError) throw studentsError;

      // Get points for all students
      const { data: points, error: pointsError } = await supabase
        .from("student_points")
        .select("student_id, total_points, current_level, streak_days");

      if (pointsError) throw pointsError;

      // Get badge counts
      const { data: badges, error: badgesError } = await supabase
        .from("student_badges")
        .select("student_id");

      if (badgesError) throw badgesError;

      // Combine data
      const studentMap = new Map<string, StudentWithPoints>();
      
      students?.forEach((s) => {
        const studentPoints = points?.find((p) => p.student_id === s.id);
        const badgeCount = badges?.filter((b) => b.student_id === s.id).length || 0;
        
        studentMap.set(s.id, {
          id: s.id,
          student_name: s.student_name,
          class: s.class,
          section: s.section,
          total_points: studentPoints?.total_points || 0,
          current_level: studentPoints?.current_level || 1,
          streak_days: studentPoints?.streak_days || 0,
          badge_count: badgeCount,
        });
      });

      let result = Array.from(studentMap.values());

      // Apply class filter
      if (classFilter) {
        result = result.filter((s) => s.class === classFilter);
      }

      // Sort based on active tab
      if (activeTab === "xp") {
        result.sort((a, b) => b.total_points - a.total_points);
      } else if (activeTab === "badges") {
        result.sort((a, b) => b.badge_count - a.badge_count);
      } else if (activeTab === "streak") {
        result.sort((a, b) => b.streak_days - a.streak_days);
      }

      return result.slice(0, 50); // Top 50
    },
  });

  // Get unique classes for filter
  const classes = [...new Set(leaderboardData?.map((s) => s.class) || [])].sort();

  // Find current user's rank
  const currentUserRank = leaderboardData?.findIndex((s) => s.id === student?.id) ?? -1;
  const currentUserData = leaderboardData?.find((s) => s.id === student?.id);

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Crown className="h-5 w-5 text-sunny fill-sunny" />;
    if (rank === 1) return <Medal className="h-5 w-5 text-muted-foreground" />;
    if (rank === 2) return <Award className="h-5 w-5 text-coral" />;
    return <span className="text-sm font-bold text-muted-foreground">#{rank + 1}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 0) return "bg-gradient-to-r from-sunny/20 to-sunny/5 border-sunny/30";
    if (rank === 1) return "bg-gradient-to-r from-muted/40 to-muted/20 border-muted-foreground/30";
    if (rank === 2) return "bg-gradient-to-r from-coral/20 to-coral/5 border-coral/30";
    return "bg-card hover:bg-muted/30";
  };

  const getMetricValue = (entry: StudentWithPoints) => {
    if (activeTab === "xp") return entry.total_points;
    if (activeTab === "badges") return entry.badge_count;
    return entry.streak_days;
  };

  const getMetricLabel = () => {
    if (activeTab === "xp") return "XP";
    if (activeTab === "badges") return "Badges";
    return "Days";
  };

  const getMetricIcon = () => {
    if (activeTab === "xp") return <Star className="h-3.5 w-3.5 text-sunny fill-sunny" />;
    if (activeTab === "badges") return <Trophy className="h-3.5 w-3.5 text-purple" />;
    return <Flame className="h-3.5 w-3.5 text-coral" />;
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-display flex items-center gap-2">
              <Trophy className="h-6 w-6 text-sunny" />
              Leaderboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Top performers this week
            </p>
          </div>
        </div>
      </div>

      {/* Current User Position */}
      {currentUserData && currentUserRank >= 0 && (
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl font-bold text-white shadow-lg">
                  #{currentUserRank + 1}
                </div>
                <div>
                  <p className="font-bold text-foreground">Your Position</p>
                  <p className="text-sm text-muted-foreground">
                    Class {currentUserData.class}{currentUserData.section && `-${currentUserData.section}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    <AnimatedCounter value={getMetricValue(currentUserData)} />
                  </p>
                  <p className="text-xs text-muted-foreground">{getMetricLabel()}</p>
                </div>
                {currentUserRank > 0 && (
                  <Badge variant="outline" className="bg-lime/10 text-lime border-lime/30">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Keep going!
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs for different rankings */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <TabsList className="grid grid-cols-3 w-full sm:w-auto">
            <TabsTrigger value="xp" className="gap-1.5">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">XP</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="gap-1.5">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Badges</span>
            </TabsTrigger>
            <TabsTrigger value="streak" className="gap-1.5">
              <Flame className="h-4 w-4" />
              <span className="hidden sm:inline">Streak</span>
            </TabsTrigger>
          </TabsList>

          {/* Class Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <Button
              variant={classFilter === null ? "secondary" : "ghost"}
              size="sm"
              className="text-xs h-7 shrink-0"
              onClick={() => setClassFilter(null)}
            >
              All
            </Button>
            {classes.map((cls) => (
              <Button
                key={cls}
                variant={classFilter === cls ? "secondary" : "ghost"}
                size="sm"
                className="text-xs h-7 shrink-0"
                onClick={() => setClassFilter(cls)}
              >
                Class {cls}
              </Button>
            ))}
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          {/* Top 3 Podium */}
          {leaderboardData && leaderboardData.length >= 3 && (
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
              {/* Second Place */}
              <Card className="bg-gradient-to-br from-muted/40 to-muted/20 border-muted-foreground/30 order-1">
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-muted-foreground/30 to-muted-foreground/10 flex items-center justify-center mx-auto mb-2">
                    <Medal className="h-5 w-5 sm:h-7 sm:w-7 text-muted-foreground" />
                  </div>
                  <p className="font-bold text-xs sm:text-sm truncate">{leaderboardData[1]?.student_name}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Class {leaderboardData[1]?.class}</p>
                  <Badge className="mt-2 bg-muted text-muted-foreground text-xs">
                    {getMetricValue(leaderboardData[1])} {getMetricLabel()}
                  </Badge>
                </CardContent>
              </Card>

              {/* First Place */}
              <Card className="bg-gradient-to-br from-sunny/20 to-sunny/5 border-sunny/30 order-0 sm:order-1 -mt-2 sm:-mt-4">
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-sunny to-coral flex items-center justify-center mx-auto mb-2 shadow-lg animate-pulse-glow">
                    <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <p className="font-bold text-sm sm:text-base truncate">{leaderboardData[0]?.student_name}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Class {leaderboardData[0]?.class}</p>
                  <Badge className="mt-2 bg-gradient-to-r from-sunny to-coral text-foreground text-xs sm:text-sm">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {getMetricValue(leaderboardData[0])} {getMetricLabel()}
                  </Badge>
                </CardContent>
              </Card>

              {/* Third Place */}
              <Card className="bg-gradient-to-br from-coral/20 to-coral/5 border-coral/30 order-2">
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-coral/30 to-coral/10 flex items-center justify-center mx-auto mb-2">
                    <Award className="h-5 w-5 sm:h-7 sm:w-7 text-coral" />
                  </div>
                  <p className="font-bold text-xs sm:text-sm truncate">{leaderboardData[2]?.student_name}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Class {leaderboardData[2]?.class}</p>
                  <Badge className="mt-2 bg-coral/20 text-coral border-coral/30 text-xs">
                    {getMetricValue(leaderboardData[2])} {getMetricLabel()}
                  </Badge>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Full Leaderboard */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                All Rankings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted/30 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : leaderboardData?.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No data yet</p>
                  <p className="text-sm text-muted-foreground">Start learning to appear on the leaderboard!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboardData?.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border transition-all",
                        getRankBg(index),
                        entry.id === student?.id && "ring-2 ring-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {/* Rank */}
                        <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                          {getRankIcon(index)}
                        </div>

                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-white shrink-0">
                          {entry.student_name.charAt(0).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="min-w-0">
                          <p className={cn(
                            "font-medium text-sm truncate",
                            entry.id === student?.id && "text-primary"
                          )}>
                            {entry.student_name}
                            {entry.id === student?.id && " (You)"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Class {entry.class}{entry.section && `-${entry.section}`} • Lv.{entry.current_level}
                          </p>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs px-2",
                            activeTab === "xp" && "bg-sunny/10 border-sunny/30",
                            activeTab === "badges" && "bg-purple/10 border-purple/30",
                            activeTab === "streak" && "bg-coral/10 border-coral/30"
                          )}
                        >
                          {getMetricIcon()}
                          <span className="ml-1 font-bold">{getMetricValue(entry)}</span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

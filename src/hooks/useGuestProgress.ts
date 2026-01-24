import { useState, useEffect, useCallback } from "react";

export interface GuestProgress {
  watchedVideos: string[];
  completedQuizzes: { quizId: string; score: number; passed: boolean }[];
  viewedEbooks: string[];
  lastActivity: string;
}

const STORAGE_KEY = "guestProgress";

const getInitialProgress = (): GuestProgress => ({
  watchedVideos: [],
  completedQuizzes: [],
  viewedEbooks: [],
  lastActivity: new Date().toISOString(),
});

export function useGuestProgress() {
  const [progress, setProgress] = useState<GuestProgress>(getInitialProgress);

  // Load progress from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProgress(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback((newProgress: GuestProgress) => {
    const updated = { ...newProgress, lastActivity: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setProgress(updated);
  }, []);

  // Mark video as watched
  const markVideoWatched = useCallback((videoId: string) => {
    setProgress(prev => {
      if (prev.watchedVideos.includes(videoId)) return prev;
      const updated: GuestProgress = {
        ...prev,
        watchedVideos: [...prev.watchedVideos, videoId],
        lastActivity: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Mark quiz as completed
  const markQuizCompleted = useCallback((quizId: string, score: number, passed: boolean) => {
    setProgress(prev => {
      // Update existing or add new
      const existingIndex = prev.completedQuizzes.findIndex(q => q.quizId === quizId);
      let newQuizzes = [...prev.completedQuizzes];
      
      if (existingIndex >= 0) {
        // Only update if new score is higher
        if (score > newQuizzes[existingIndex].score) {
          newQuizzes[existingIndex] = { quizId, score, passed };
        }
      } else {
        newQuizzes.push({ quizId, score, passed });
      }
      
      const updated: GuestProgress = {
        ...prev,
        completedQuizzes: newQuizzes,
        lastActivity: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Mark ebook as viewed
  const markEbookViewed = useCallback((ebookId: string) => {
    setProgress(prev => {
      if (prev.viewedEbooks.includes(ebookId)) return prev;
      const updated: GuestProgress = {
        ...prev,
        viewedEbooks: [...prev.viewedEbooks, ebookId],
        lastActivity: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Check if video is watched
  const isVideoWatched = useCallback((videoId: string) => {
    return progress.watchedVideos.includes(videoId);
  }, [progress.watchedVideos]);

  // Check if quiz is completed
  const isQuizCompleted = useCallback((quizId: string) => {
    return progress.completedQuizzes.some(q => q.quizId === quizId);
  }, [progress.completedQuizzes]);

  // Get quiz score
  const getQuizScore = useCallback((quizId: string) => {
    return progress.completedQuizzes.find(q => q.quizId === quizId);
  }, [progress.completedQuizzes]);

  // Check if ebook is viewed
  const isEbookViewed = useCallback((ebookId: string) => {
    return progress.viewedEbooks.includes(ebookId);
  }, [progress.viewedEbooks]);

  // Get progress stats
  const getStats = useCallback(() => ({
    videosWatched: progress.watchedVideos.length,
    quizzesCompleted: progress.completedQuizzes.length,
    quizzesPassed: progress.completedQuizzes.filter(q => q.passed).length,
    ebooksViewed: progress.viewedEbooks.length,
  }), [progress]);

  // Clear all progress
  const clearProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress(getInitialProgress());
  }, []);

  return {
    progress,
    markVideoWatched,
    markQuizCompleted,
    markEbookViewed,
    isVideoWatched,
    isQuizCompleted,
    getQuizScore,
    isEbookViewed,
    getStats,
    clearProgress,
  };
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_type: string
          created_at: string
          description: string | null
          icon: string
          id: string
          name: string
          points_reward: number
          target_value: number
        }
        Insert: {
          achievement_type: string
          created_at?: string
          description?: string | null
          icon: string
          id?: string
          name: string
          points_reward?: number
          target_value?: number
        }
        Update: {
          achievement_type?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name?: string
          points_reward?: number
          target_value?: number
        }
        Relationships: []
      }
      badges: {
        Row: {
          badge_type: string
          color: string
          created_at: string
          description: string | null
          icon: string
          id: string
          name: string
          points_required: number
        }
        Insert: {
          badge_type?: string
          color?: string
          created_at?: string
          description?: string | null
          icon: string
          id?: string
          name: string
          points_required?: number
        }
        Update: {
          badge_type?: string
          color?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name?: string
          points_required?: number
        }
        Relationships: []
      }
      block_categories: {
        Row: {
          blocks_json: Json
          color: string
          created_at: string
          icon: string | null
          id: string
          is_active: boolean
          max_class_level: number
          min_class_level: number
          name: string
          order_index: number
        }
        Insert: {
          blocks_json?: Json
          color?: string
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          max_class_level?: number
          min_class_level?: number
          name: string
          order_index?: number
        }
        Update: {
          blocks_json?: Json
          color?: string
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          max_class_level?: number
          min_class_level?: number
          name?: string
          order_index?: number
        }
        Relationships: []
      }
      book_pages: {
        Row: {
          created_at: string | null
          digital_book_id: string
          id: string
          is_published: boolean | null
          order_index: number | null
          page_number: number
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          digital_book_id: string
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          page_number: number
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          digital_book_id?: string
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          page_number?: number
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "book_pages_digital_book_id_fkey"
            columns: ["digital_book_id"]
            isOneToOne: false
            referencedRelation: "digital_books"
            referencedColumns: ["id"]
          },
        ]
      }
      book_reading_progress: {
        Row: {
          completed_at: string | null
          completed_pages: number[] | null
          created_at: string | null
          current_page: number | null
          digital_book_id: string
          id: string
          reading_time_minutes: number | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          completed_pages?: number[] | null
          created_at?: string | null
          current_page?: number | null
          digital_book_id: string
          id?: string
          reading_time_minutes?: number | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          completed_pages?: number[] | null
          created_at?: string | null
          current_page?: number | null
          digital_book_id?: string
          id?: string
          reading_time_minutes?: number | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "book_reading_progress_digital_book_id_fkey"
            columns: ["digital_book_id"]
            isOneToOne: false
            referencedRelation: "digital_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_reading_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      chapter_ebooks: {
        Row: {
          chapter_id: string
          created_at: string
          description: string | null
          file_url: string
          id: string
          is_published: boolean
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          chapter_id: string
          created_at?: string
          description?: string | null
          file_url: string
          id?: string
          is_published?: boolean
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          chapter_id?: string
          created_at?: string
          description?: string | null
          file_url?: string
          id?: string
          is_published?: boolean
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapter_ebooks_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      chapter_quizzes: {
        Row: {
          chapter_id: string | null
          course_id: string | null
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          order_index: number
          passing_score: number
          title: string
          updated_at: string
        }
        Insert: {
          chapter_id?: string | null
          course_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          order_index?: number
          passing_score?: number
          title: string
          updated_at?: string
        }
        Update: {
          chapter_id?: string | null
          course_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          order_index?: number
          passing_score?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapter_quizzes_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapter_quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      chapter_videos: {
        Row: {
          chapter_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean
          order_index: number
          title: string
          updated_at: string
          youtube_url: string
        }
        Insert: {
          chapter_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          order_index?: number
          title: string
          updated_at?: string
          youtube_url: string
        }
        Update: {
          chapter_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          order_index?: number
          title?: string
          updated_at?: string
          youtube_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapter_videos_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      coding_modules: {
        Row: {
          chapter_id: string | null
          class_level: number
          created_at: string
          description: string | null
          difficulty_level: string
          id: string
          initial_blocks_xml: string | null
          is_published: boolean
          objective_text: string | null
          order_index: number
          title: string
          updated_at: string
          validation_rules: Json | null
          xp_reward: number
        }
        Insert: {
          chapter_id?: string | null
          class_level?: number
          created_at?: string
          description?: string | null
          difficulty_level?: string
          id?: string
          initial_blocks_xml?: string | null
          is_published?: boolean
          objective_text?: string | null
          order_index?: number
          title: string
          updated_at?: string
          validation_rules?: Json | null
          xp_reward?: number
        }
        Update: {
          chapter_id?: string | null
          class_level?: number
          created_at?: string
          description?: string | null
          difficulty_level?: string
          id?: string
          initial_blocks_xml?: string | null
          is_published?: boolean
          objective_text?: string | null
          order_index?: number
          title?: string
          updated_at?: string
          validation_rules?: Json | null
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "coding_modules_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      coding_progress: {
        Row: {
          attempts: number
          best_score: number | null
          completed_at: string | null
          created_at: string
          id: string
          module_id: string
          student_id: string
          xp_earned: number
        }
        Insert: {
          attempts?: number
          best_score?: number | null
          completed_at?: string | null
          created_at?: string
          id?: string
          module_id: string
          student_id: string
          xp_earned?: number
        }
        Update: {
          attempts?: number
          best_score?: number | null
          completed_at?: string | null
          created_at?: string
          id?: string
          module_id?: string
          student_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "coding_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "coding_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coding_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      coding_projects: {
        Row: {
          blocks_xml: string
          class_level: number
          created_at: string
          id: string
          module_id: string | null
          project_type: string
          student_id: string
          thumbnail_data: string | null
          title: string
          updated_at: string
        }
        Insert: {
          blocks_xml: string
          class_level?: number
          created_at?: string
          id?: string
          module_id?: string | null
          project_type?: string
          student_id: string
          thumbnail_data?: string | null
          title?: string
          updated_at?: string
        }
        Update: {
          blocks_xml?: string
          class_level?: number
          created_at?: string
          id?: string
          module_id?: string | null
          project_type?: string
          student_id?: string
          thumbnail_data?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coding_projects_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "coding_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coding_projects_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      course_school_assignments: {
        Row: {
          course_id: string
          created_at: string
          id: string
          school_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          school_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_school_assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_school_assignments_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_global: boolean
          is_published: boolean
          order_index: number
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_global?: boolean
          is_published?: boolean
          order_index?: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_global?: boolean
          is_published?: boolean
          order_index?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      digital_books: {
        Row: {
          chapter_id: string
          cover_image_url: string | null
          created_at: string | null
          estimated_reading_time: number | null
          id: string
          is_published: boolean | null
          learning_objectives: Json | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          chapter_id: string
          cover_image_url?: string | null
          created_at?: string | null
          estimated_reading_time?: number | null
          id?: string
          is_published?: boolean | null
          learning_objectives?: Json | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          chapter_id?: string
          cover_image_url?: string | null
          created_at?: string | null
          estimated_reading_time?: number | null
          id?: string
          is_published?: boolean | null
          learning_objectives?: Json | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "digital_books_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: true
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      institution_accounts: {
        Row: {
          address: string | null
          city: string
          contact_person: string
          created_at: string | null
          email: string
          expected_student_count: number | null
          id: string
          institution_name: string
          institution_type: Database["public"]["Enums"]["institution_type"]
          is_active: boolean | null
          logo_url: string | null
          password_hash: string
          phone: string
          state: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city: string
          contact_person: string
          created_at?: string | null
          email: string
          expected_student_count?: number | null
          id?: string
          institution_name: string
          institution_type?: Database["public"]["Enums"]["institution_type"]
          is_active?: boolean | null
          logo_url?: string | null
          password_hash: string
          phone: string
          state: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string
          contact_person?: string
          created_at?: string | null
          email?: string
          expected_student_count?: number | null
          id?: string
          institution_name?: string
          institution_type?: Database["public"]["Enums"]["institution_type"]
          is_active?: boolean | null
          logo_url?: string | null
          password_hash?: string
          phone?: string
          state?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      institution_course_access: {
        Row: {
          amount_paid: number | null
          course_id: string
          created_at: string | null
          id: string
          institution_id: string
          payment_status: string | null
          student_count: number
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          amount_paid?: number | null
          course_id: string
          created_at?: string | null
          id?: string
          institution_id: string
          payment_status?: string | null
          student_count?: number
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          amount_paid?: number | null
          course_id?: string
          created_at?: string | null
          id?: string
          institution_id?: string
          payment_status?: string | null
          student_count?: number
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institution_course_access_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institution_course_access_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institution_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      institution_payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          institution_id: string
          invoice_number: string | null
          notes: string | null
          payment_method: string | null
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          institution_id: string
          invoice_number?: string | null
          notes?: string | null
          payment_method?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          institution_id?: string
          invoice_number?: string | null
          notes?: string | null
          payment_method?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institution_payments_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institution_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      institution_students: {
        Row: {
          created_at: string | null
          id: string
          institution_id: string
          student_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          institution_id: string
          student_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          institution_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "institution_students_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institution_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institution_students_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      page_content_blocks: {
        Row: {
          block_type: Database["public"]["Enums"]["content_block_type"]
          class_level_max: number | null
          class_level_min: number | null
          content: Json
          created_at: string | null
          id: string
          order_index: number | null
          page_id: string
        }
        Insert: {
          block_type: Database["public"]["Enums"]["content_block_type"]
          class_level_max?: number | null
          class_level_min?: number | null
          content?: Json
          created_at?: string | null
          id?: string
          order_index?: number | null
          page_id: string
        }
        Update: {
          block_type?: Database["public"]["Enums"]["content_block_type"]
          class_level_max?: number | null
          class_level_min?: number | null
          content?: Json
          created_at?: string | null
          id?: string
          order_index?: number | null
          page_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_content_blocks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "book_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      quiz_options: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean
          option_text: string
          order_index: number
          question_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct?: boolean
          option_text: string
          order_index?: number
          question_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean
          option_text?: string
          order_index?: number
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          created_at: string
          id: string
          order_index: number
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          quiz_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_index?: number
          question_text: string
          question_type?: Database["public"]["Enums"]["question_type"]
          quiz_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_index?: number
          question_text?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "chapter_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          city: string
          contact_email: string
          contact_person: string
          contact_phone: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          school_code: string
          state: string
          updated_at: string
        }
        Insert: {
          city: string
          contact_email: string
          contact_person: string
          contact_phone: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          school_code?: string
          state: string
          updated_at?: string
        }
        Update: {
          city?: string
          contact_email?: string
          contact_person?: string
          contact_phone?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          school_code?: string
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_achievements: {
        Row: {
          achievement_id: string
          completed: boolean
          completed_at: string | null
          id: string
          progress: number
          student_id: string
        }
        Insert: {
          achievement_id: string
          completed?: boolean
          completed_at?: string | null
          id?: string
          progress?: number
          student_id: string
        }
        Update: {
          achievement_id?: string
          completed?: boolean
          completed_at?: string | null
          id?: string
          progress?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_achievements_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          student_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          student_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_badges_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_course_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          id: string
          started_at: string
          student_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          id?: string
          started_at?: string
          student_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          id?: string
          started_at?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_course_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_points: {
        Row: {
          current_level: number
          id: string
          last_activity_date: string | null
          streak_days: number
          student_id: string
          total_points: number
          updated_at: string
        }
        Insert: {
          current_level?: number
          id?: string
          last_activity_date?: string | null
          streak_days?: number
          student_id: string
          total_points?: number
          updated_at?: string
        }
        Update: {
          current_level?: number
          id?: string
          last_activity_date?: string | null
          streak_days?: number
          student_id?: string
          total_points?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_points_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_quiz_answers: {
        Row: {
          attempt_id: string
          created_at: string
          id: string
          is_correct: boolean
          question_id: string
          selected_option_id: string | null
        }
        Insert: {
          attempt_id: string
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id: string
          selected_option_id?: string | null
        }
        Update: {
          attempt_id?: string
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          selected_option_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_quiz_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "student_quiz_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_quiz_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_quiz_answers_selected_option_id_fkey"
            columns: ["selected_option_id"]
            isOneToOne: false
            referencedRelation: "quiz_options"
            referencedColumns: ["id"]
          },
        ]
      }
      student_quiz_attempts: {
        Row: {
          attempted_at: string
          id: string
          passed: boolean
          quiz_id: string
          score: number
          student_id: string
        }
        Insert: {
          attempted_at?: string
          id?: string
          passed?: boolean
          quiz_id: string
          score?: number
          student_id: string
        }
        Update: {
          attempted_at?: string
          id?: string
          passed?: boolean
          quiz_id?: string
          score?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "chapter_quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_quiz_attempts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_video_progress: {
        Row: {
          id: string
          is_completed: boolean
          student_id: string
          video_id: string
          watch_duration_seconds: number
          watched_at: string
        }
        Insert: {
          id?: string
          is_completed?: boolean
          student_id: string
          video_id: string
          watch_duration_seconds?: number
          watched_at?: string
        }
        Update: {
          id?: string
          is_completed?: boolean
          student_id?: string
          video_id?: string
          watch_duration_seconds?: number
          watched_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_video_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_video_progress_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "chapter_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          activated_at: string | null
          activated_by: string | null
          activation_status: string
          class: string
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          is_trial_active: boolean | null
          mobile_number: string
          school_id: string | null
          section: string | null
          student_name: string
          student_type: string
          subscription_status: string | null
          temp_password: string
          trial_end_date: string | null
          trial_start_date: string | null
          updated_at: string
          username: string
        }
        Insert: {
          activated_at?: string | null
          activated_by?: string | null
          activation_status?: string
          class: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          is_trial_active?: boolean | null
          mobile_number: string
          school_id?: string | null
          section?: string | null
          student_name: string
          student_type?: string
          subscription_status?: string | null
          temp_password: string
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          activated_at?: string | null
          activated_by?: string | null
          activation_status?: string
          class?: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          is_trial_active?: boolean | null
          mobile_number?: string
          school_id?: string | null
          section?: string | null
          student_name?: string
          student_type?: string
          subscription_status?: string | null
          temp_password?: string
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      worksheet_progress: {
        Row: {
          answer_data: Json | null
          attempted_at: string | null
          chapter_id: string
          id: string
          is_correct: boolean | null
          question_id: string
          student_id: string
        }
        Insert: {
          answer_data?: Json | null
          attempted_at?: string | null
          chapter_id: string
          id?: string
          is_correct?: boolean | null
          question_id: string
          student_id: string
        }
        Update: {
          answer_data?: Json | null
          attempted_at?: string | null
          chapter_id?: string
          id?: string
          is_correct?: boolean | null
          question_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "worksheet_progress_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worksheet_progress_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "worksheet_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worksheet_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      worksheet_questions: {
        Row: {
          chapter_id: string
          created_at: string | null
          difficulty_level: string | null
          id: string
          is_published: boolean | null
          order_index: number | null
          question_data: Json
          question_type: Database["public"]["Enums"]["worksheet_question_type"]
          updated_at: string | null
          xp_reward: number | null
        }
        Insert: {
          chapter_id: string
          created_at?: string | null
          difficulty_level?: string | null
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          question_data: Json
          question_type: Database["public"]["Enums"]["worksheet_question_type"]
          updated_at?: string | null
          xp_reward?: number | null
        }
        Update: {
          chapter_id?: string
          created_at?: string | null
          difficulty_level?: string | null
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          question_data?: Json
          question_type?: Database["public"]["Enums"]["worksheet_question_type"]
          updated_at?: string | null
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "worksheet_questions_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "admin"
      content_block_type:
        | "text"
        | "image"
        | "callout"
        | "block_visual"
        | "video_embed"
        | "activity"
        | "divider"
        | "step_by_step"
        | "key_term"
        | "comparison"
      institution_type: "school" | "corporate" | "coaching" | "other"
      question_type: "multiple_choice" | "true_false"
      worksheet_question_type:
        | "fill_blank"
        | "true_false"
        | "match_column"
        | "short_answer"
        | "ordering"
        | "block_reasoning"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "admin"],
      content_block_type: [
        "text",
        "image",
        "callout",
        "block_visual",
        "video_embed",
        "activity",
        "divider",
        "step_by_step",
        "key_term",
        "comparison",
      ],
      institution_type: ["school", "corporate", "coaching", "other"],
      question_type: ["multiple_choice", "true_false"],
      worksheet_question_type: [
        "fill_blank",
        "true_false",
        "match_column",
        "short_answer",
        "ordering",
        "block_reasoning",
      ],
    },
  },
} as const

/**
 * This file defines the complete database schema for your GymTrack project.
 * It improves type inference by explicitly outlining the structure of your tables,
 * views, functions, and enums.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      exercises: {
        Row: {
          id: number;
          name: string;
          muscle_group: string; // Ensure this matches your DB column exactly
          image_url: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          muscle_group: string;
          image_url?: string | null;
        };
        Update: {
          id?: number;
          name?: string;
          muscle_group?: string;
          image_url?: string | null;
        };
      };
      muscle_groups: {
        Row: {
          id: number;
          name: string;
          description: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

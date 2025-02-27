// app/api/routines/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/** 
 * Adjust type definitions if your 'exercises' schema differs.
 */
type Database = {
  public: {
    Tables: {
      exercises: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          muscle_group_id: number | null;
          user_id: string | null;
          instructions: string | null;
          video_url: string | null;
          is_custom: boolean | null;
          created_at: string; // timestamp
          updated_at: string; // timestamp
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          muscle_group_id?: number | null;
          user_id?: string | null;
          instructions?: string | null;
          video_url?: string | null;
          is_custom?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          muscle_group_id?: number | null;
          user_id?: string | null;
          instructions?: string | null;
          video_url?: string | null;
          is_custom?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

// You must have these env variables in .env.local
// NEXT_PUBLIC_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
// NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR-ANON-KEY"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient<Database, "public">(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ejercicios = searchParams.get("ejercicios");

    if (!ejercicios) {
      return NextResponse.json(
        { error: "Missing or invalid 'ejercicios' parameter" },
        { status: 400 }
      );
    }

    // e.g. "Press banca, Curl" => ["Press banca", "Curl"]
    const exerciseNames = ejercicios.split(",").map((name) => name.trim());

    let query = supabase.from("exercises").select("*");

    if (exerciseNames.length === 1) {
      // Single name => partial match
      query = query.ilike("name", `%${exerciseNames[0]}%`);
    } else {
      // Multiple => OR condition
      const conditions = exerciseNames.map((nm) => `name.ilike.%${nm}%`).join(",");
      query = query.or(conditions);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Error fetching exercises", details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      console.log("No exercises found for:", ejercicios);
      return NextResponse.json({ error: "No exercises found" }, { status: 404 });
    }

    console.log("Fetched exercises:", data);

    // Build a default 'routine' for each exercise
    const routines = data.map((ex) => ({
      exercise: {
        id: ex.id,
        name: ex.name,
        // If your muscle_group is stored differently, adjust
        muscleGroup: ex.muscle_group_id?.toString() || "Unspecified",
        imageUrl: "/placeholder.svg",
      },
      series: [
        {
          category: "calentamiento",
          reps: 10,
          weight: 20,
          rir: 3,
          maxTime: 30,
          restTime: 60,
        },
        {
          category: "hipertrofia",
          reps: 8,
          weight: 30,
          rir: 2,
          maxTime: 40,
          restTime: 90,
        },
        {
          category: "fuerza",
          reps: 6,
          weight: 40,
          rir: 1,
          maxTime: 50,
          restTime: 120,
        },
      ],
    }));

    console.log("Sending routine objects:", routines);
    return NextResponse.json(routines);
  } catch (err: any) {
    console.error("Unhandled /api/routines error:", err);
    return NextResponse.json(
      { error: "Unhandled error in /api/routines", details: err.message },
      { status: 500 }
    );
  }
}

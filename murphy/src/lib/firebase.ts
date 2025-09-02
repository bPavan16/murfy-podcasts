import { MongoClient, Db, Collection } from "mongodb";

const uri = process.env.MONGODB_URI as string; 
if (!uri) throw new Error("Missing MONGODB_URI env var");

export interface Podcast {
  _id: string;                  
  description: string;
  idea: string;
  podcastTextContent: string;
  urls: {
    bengali: string;
    english: string;
    french: string;
    german: string;
    hindi: string;
    italian: string;
    tamil: string;
  };
  userId: string;
  createdAt: Date;
}

let client: MongoClient | null = null;
let db: Db;
let podcasts: Collection<Podcast>;

export async function connectDB() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db("murf");
    podcasts = db.collection<Podcast>("podcasts");
  }
  return { db, podcasts };
}

export async function addPodcast(
  description: string,
  idea: string,
  podcastId: string,
  podcastTextContent: string,
  userEmail: string,
  urls: Record<string, string> = {}
) {
  try {
    const { podcasts } = await connectDB();

    const doc: Podcast = {
      _id: podcastId, 
      description: description || "",
      idea: idea || "",
      podcastTextContent: podcastTextContent || "",
      urls: {
        bengali: urls.bengali || "",
        english: urls.english || "",
        french: urls.french || "",
        german: urls.german || "",
        hindi: urls.hindi || "",
        italian: urls.italian || "",
        tamil: urls.tamil || "",
      },
      userId: userEmail || "", // storing email as userId for consistency with existing schema
      createdAt: new Date(),
    };

    await podcasts.updateOne(
      { _id: podcastId },
      { $set: doc },
      { upsert: true }
    );

    console.log("Podcast written with ID:", podcastId, "for user:", userEmail);
  } catch (e) {
    console.error("Error adding podcast:", e);
  }
}

export async function getAllPodcasts(userId?: string): Promise<Podcast[]> {
  try {
    const { podcasts } = await connectDB();
    const query = userId ? { userId } : {};
    const allPodcasts = await podcasts.find(query).sort({ createdAt: -1 }).toArray();
    return allPodcasts;
  } catch (e) {
    console.error("Error fetching podcasts:", e);
    return [];
  }
}

export async function getPodcastById(podcastId: string): Promise<Podcast | null> {
  try {
    const { podcasts } = await connectDB();
    const podcast = await podcasts.findOne({ _id: podcastId });
    return podcast;
  } catch (e) {
    console.error("Error fetching podcast:", e);
    return null;
  }
}

export async function getPodcastsByUserId(userId: string): Promise<Podcast[]> {
  try {
    const { podcasts } = await connectDB();
    const userPodcasts = await podcasts.find({ userId }).sort({ createdAt: -1 }).toArray();
    return userPodcasts;
  } catch (e) {
    console.error("Error fetching user podcasts:", e);
    return [];
  }
}

export async function deletePodcast(podcastId: string, userEmail: string): Promise<{ success: boolean; message: string }> {
  try {
    const { podcasts } = await connectDB();
    
    // First verify the podcast exists and belongs to the user
    const podcast = await podcasts.findOne({ _id: podcastId });
    
    if (!podcast) {
      return { success: false, message: "Podcast not found" };
    }
    
    if (podcast.userId !== userEmail) {
      return { success: false, message: "Unauthorized: You can only delete your own podcasts" };
    }
    
    // Delete the podcast
    const result = await podcasts.deleteOne({ _id: podcastId });
    
    if (result.deletedCount === 1) {
      console.log("Podcast deleted with ID:", podcastId, "by user:", userEmail);
      return { success: true, message: "Podcast deleted successfully" };
    } else {
      return { success: false, message: "Failed to delete podcast" };
    }
  } catch (e) {
    console.error("Error deleting podcast:", e);
    return { success: false, message: "Error deleting podcast" };
  }
}
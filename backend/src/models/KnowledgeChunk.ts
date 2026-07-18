import { Schema, model, Document, Types } from "mongoose";

export type KnowledgeSourceType = "resume" | "bio" | "note" | "image" | "pastPost";

export interface IKnowledgeChunk extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  sourceType: KnowledgeSourceType;
  sourceRefId?: Types.ObjectId;
  text: string;
  faissVectorId: number;
  faissIndexNamespace: string;
  createdAt: Date;
}

const knowledgeChunkSchema = new Schema<IKnowledgeChunk>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  sourceType: { type: String, enum: ["resume", "bio", "note", "image", "pastPost"], required: true },
  sourceRefId: { type: Schema.Types.ObjectId },
  text: { type: String, required: true },
  faissVectorId: { type: Number, required: true },
  faissIndexNamespace: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

knowledgeChunkSchema.index({ userId: 1, sourceType: 1 });

export const KnowledgeChunk = model<IKnowledgeChunk>("KnowledgeChunk", knowledgeChunkSchema);

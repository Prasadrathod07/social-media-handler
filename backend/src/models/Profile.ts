import { Schema, model, Document, Types } from "mongoose";

export interface IRawUpload {
  type: "resume" | "note" | "image";
  fileUrl: string;
  uploadedAt: Date;
}

export interface IProfile extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  resumeText?: string;
  bio?: string;
  aboutMe?: string;
  tone: string[];
  focusAreas: string[];
  rawUploads: IRawUpload[];
  updatedAt: Date;
}

const rawUploadSchema = new Schema<IRawUpload>(
  {
    type: { type: String, enum: ["resume", "note", "image"], required: true },
    fileUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const profileSchema = new Schema<IProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    resumeText: { type: String },
    bio: { type: String },
    aboutMe: { type: String },
    tone: { type: [String], default: [] },
    focusAreas: { type: [String], default: [] },
    rawUploads: { type: [rawUploadSchema], default: [] },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export const Profile = model<IProfile>("Profile", profileSchema);

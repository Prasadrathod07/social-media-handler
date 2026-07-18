import { Schema, model, Document, Types } from "mongoose";

export interface IMessage extends Document {
  _id: Types.ObjectId;
  conversationId: Types.ObjectId;
  role: "user" | "agent";
  text: string;
  imageUrls: string[];
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true, index: true },
  role: { type: String, enum: ["user", "agent"], required: true },
  text: { type: String, required: true },
  imageUrls: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export const Message = model<IMessage>("Message", messageSchema);

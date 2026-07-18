import { Schema, model, Document, Types } from "mongoose";

export interface IConversation extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  lastMessageAt: Date;
}

const conversationSchema = new Schema<IConversation>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  lastMessageAt: { type: Date, default: Date.now },
});

export const Conversation = model<IConversation>("Conversation", conversationSchema);

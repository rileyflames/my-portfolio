import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * Message entity represents contact form messages from portfolio visitors
 * Uses MongoDB/Mongoose for storage with soft deletion capability
 * 
 * @ObjectType() - Makes this class available in GraphQL schema
 * @Schema() - Creates a MongoDB schema using Mongoose
 */
@ObjectType()
@Schema({ 
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  collection: 'messages' // Specify collection name in MongoDB
})
export class Message extends Document {
  // MongoDB automatically creates _id, we expose it as id in GraphQL
  @Field(() => ID)
  declare id: string;

  // Sender's full name
  @Field()
  @Prop({ 
    required: true, 
    trim: true, // Remove whitespace from beginning and end
    maxlength: 100 // Limit name length
  })
  fullName: string;

  // Sender's email address
  @Field()
  @Prop({ 
    required: true, 
    trim: true,
    lowercase: true, // Convert to lowercase for consistency
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Basic email validation regex
  })
  email: string;

  // Sender's city/location
  @Field()
  @Prop({ 
    required: true, 
    trim: true,
    maxlength: 100 // Limit city name length
  })
  city: string;

  // Message subject/title
  @Field()
  @Prop({ 
    required: true, 
    trim: true,
    maxlength: 200 // Limit subject length
  })
  subject: string;

  // Main message content/description
  @Field()
  @Prop({ 
    required: true, 
    trim: true,
    maxlength: 2000 // Limit message length (2000 characters)
  })
  messageDescription: string;

  // Soft deletion flag - when true, message is considered "deleted"
  // We don't expose this in GraphQL for security (only admins should see deleted status)
  @Prop({ 
    default: false,
    index: true // Create database index for faster queries
  })
  isDeleted: boolean;

  // When the message was soft deleted (null if not deleted)
  @Prop({ 
    default: null,
    type: Date
  })
  deletedAt: Date | null;

  // Message read status - helps track which messages have been viewed
  @Field()
  @Prop({ 
    default: false,
    index: true // Create index for faster filtering by read status
  })
  isRead: boolean;

  // When the message was marked as read
  @Field(() => Date, { nullable: true })
  @Prop({ 
    default: null,
    type: Date
  })
  readAt: Date | null;

  // Automatically managed timestamps by Mongoose
  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

// Create and export the Mongoose schema
export const MessageSchema = SchemaFactory.createForClass(Message);

// Add indexes for better query performance
MessageSchema.index({ isDeleted: 1, createdAt: -1 }); // For listing non-deleted messages
MessageSchema.index({ email: 1 }); // For finding messages by email
MessageSchema.index({ isRead: 1 }); // For filtering by read status
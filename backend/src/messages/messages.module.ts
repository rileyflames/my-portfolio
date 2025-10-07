import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './entities/message.entity';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';

/**
 * Messages Module
 * Handles contact form messages using MongoDB/Mongoose with soft deletion
 * This module manages messages from portfolio visitors
 */
@Module({
  imports: [
    // Register the Message schema with Mongoose
    // This creates the MongoDB collection and enables dependency injection
    MongooseModule.forFeature([
      { 
        name: Message.name, // Use the class name as the model name
        schema: MessageSchema // Use the generated schema
      }
    ]),
  ],
  providers: [
    MessagesService,  // Service containing business logic
    MessagesResolver  // GraphQL resolver for handling queries/mutations
  ],
  exports: [
    MessagesService   // Export service so other modules can use it if needed
  ],
})
export class MessagesModule {}
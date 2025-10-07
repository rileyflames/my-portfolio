import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { MessageFiltersInput } from './dto/message-filters.input';

/**
 * MessagesService handles all message-related business logic
 * This service manages contact form messages with soft deletion capability
 */
@Injectable()
export class MessagesService {
  constructor(
    // Inject the Mongoose model for the Message entity
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>
  ) {}

  /**
   * Creates a new message (used by contact form submissions)
   * @param createMessageInput - Message data from the contact form
   * @returns Promise<Message> - The created message object
   */
  async create(createMessageInput: CreateMessageInput): Promise<Message> {
    // Create new message document
    const newMessage = new this.messageModel({
      ...createMessageInput,
      isDeleted: false, // Ensure new messages are not marked as deleted
      isRead: false,    // New messages start as unread
    });

    // Save to MongoDB and return the result
    return newMessage.save();
  }

  /**
   * Retrieves all non-deleted messages with optional filtering
   * @param filters - Optional filters to apply to the query
   * @returns Promise<Message[]> - Array of messages matching the criteria
   */
  async findAll(filters?: MessageFiltersInput): Promise<Message[]> {
    // Build the query object
    const query: any = { 
      isDeleted: false // Only get non-deleted messages
    };

    // Apply filters if provided
    if (filters) {
      // Filter by read status
      if (filters.isRead !== undefined) {
        query.isRead = filters.isRead;
      }

      // Filter by email (exact match, case-insensitive)
      if (filters.email) {
        query.email = filters.email.toLowerCase();
      }

      // Filter by city (case-insensitive partial match)
      if (filters.city) {
        query.city = { $regex: filters.city, $options: 'i' };
      }

      // Search in subject and message description (case-insensitive)
      if (filters.searchTerm) {
        query.$or = [
          { subject: { $regex: filters.searchTerm, $options: 'i' } },
          { messageDescription: { $regex: filters.searchTerm, $options: 'i' } }
        ];
      }
    }

    // Execute query and sort by creation date (newest first)
    return this.messageModel
      .find(query)
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Finds a single non-deleted message by its ID
   * @param id - The message's unique identifier
   * @returns Promise<Message> - The message object
   * @throws NotFoundException if message doesn't exist or is deleted
   */
  async findOne(id: string): Promise<Message> {
    const message = await this.messageModel
      .findOne({ 
        _id: id, 
        isDeleted: false // Only find non-deleted messages
      })
      .exec();

    if (!message) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }

    return message;
  }

  /**
   * Marks a message as read
   * @param id - The message's ID to mark as read
   * @returns Promise<Message> - The updated message object
   * @throws NotFoundException if message doesn't exist or is deleted
   */
  async markAsRead(id: string): Promise<Message> {
    const message = await this.findOne(id); // This will throw if not found

    // Update read status and timestamp
    message.isRead = true;
    message.readAt = new Date();

    // Save and return the updated message
    return message.save();
  }

  /**
   * Marks a message as unread
   * @param id - The message's ID to mark as unread
   * @returns Promise<Message> - The updated message object
   * @throws NotFoundException if message doesn't exist or is deleted
   */
  async markAsUnread(id: string): Promise<Message> {
    const message = await this.findOne(id); // This will throw if not found

    // Update read status and clear read timestamp
    message.isRead = false;
    message.readAt = null;

    // Save and return the updated message
    return message.save();
  }

  /**
   * Soft deletes a message (marks as deleted without removing from database)
   * @param id - The message's ID to soft delete
   * @returns Promise<boolean> - True if successfully deleted
   * @throws NotFoundException if message doesn't exist or is already deleted
   */
  async softDelete(id: string): Promise<boolean> {
    const message = await this.findOne(id); // This will throw if not found

    // Mark as deleted with timestamp
    message.isDeleted = true;
    message.deletedAt = new Date();

    // Save the changes
    await message.save();

    return true;
  }

  /**
   * Restores a soft-deleted message
   * @param id - The message's ID to restore
   * @returns Promise<Message> - The restored message object
   * @throws NotFoundException if message doesn't exist
   */
  async restore(id: string): Promise<Message> {
    const message = await this.messageModel
      .findOne({ _id: id }) // Find even if deleted
      .exec();

    if (!message) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }

    // Restore the message
    message.isDeleted = false;
    message.deletedAt = null;

    // Save and return the restored message
    return message.save();
  }

  /**
   * Permanently deletes a message from the database
   * WARNING: This cannot be undone!
   * @param id - The message's ID to permanently delete
   * @returns Promise<boolean> - True if successfully deleted
   * @throws NotFoundException if message doesn't exist
   */
  async permanentDelete(id: string): Promise<boolean> {
    const result = await this.messageModel
      .deleteOne({ _id: id })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }

    return true;
  }

  /**
   * Gets count of messages by status
   * @returns Promise<object> - Object with counts of different message statuses
   */
  async getMessageStats(): Promise<{
    total: number;
    unread: number;
    read: number;
    deleted: number;
  }> {
    const [total, unread, read, deleted] = await Promise.all([
      this.messageModel.countDocuments({ isDeleted: false }),
      this.messageModel.countDocuments({ isDeleted: false, isRead: false }),
      this.messageModel.countDocuments({ isDeleted: false, isRead: true }),
      this.messageModel.countDocuments({ isDeleted: true }),
    ]);

    return { total, unread, read, deleted };
  }

  /**
   * Gets all soft-deleted messages (admin only)
   * @returns Promise<Message[]> - Array of deleted messages
   */
  async findDeleted(): Promise<Message[]> {
    return this.messageModel
      .find({ isDeleted: true })
      .sort({ deletedAt: -1 })
      .exec();
  }
}
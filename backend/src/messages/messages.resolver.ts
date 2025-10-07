import { Resolver, Query, Mutation, Args, ObjectType, Field, Int } from '@nestjs/graphql';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';
import { CreateMessageInput } from './dto/create-message.input';
import { MessageFiltersInput } from './dto/message-filters.input';

/**
 * MessagesResolver handles GraphQL queries and mutations for contact messages
 * This manages all message-related GraphQL operations with soft deletion support
 */
@Resolver(() => Message)
export class MessagesResolver {
    constructor(
        private readonly messagesService: MessagesService
    ) { }

    /**
     * GraphQL Query: Get all non-deleted messages with optional filtering
     * Query: { 
     *   messages(filters: { isRead: false, searchTerm: "portfolio" }) { 
     *     id fullName email subject isRead createdAt
     *   } 
     * }
     */
    @Query(() => [Message], {
        name: 'messages',
        description: 'Get all messages with optional filtering (admin only)'
    })
    async getAllMessages(
        @Args('filters', { nullable: true }) filters?: MessageFiltersInput
    ): Promise<Message[]> {
        return this.messagesService.findAll(filters);
    }

    /**
     * GraphQL Query: Get a single message by ID
     * Query: { 
     *   message(id: "message-id") { 
     *     id fullName email city subject messageDescription isRead readAt createdAt
     *   } 
     * }
     */
    @Query(() => Message, {
        name: 'message',
        description: 'Get a single message by ID (admin only)',
        nullable: true
    })
    async getMessage(@Args('id') id: string): Promise<Message> {
        return this.messagesService.findOne(id);
    }

    /**
     * GraphQL Query: Get message statistics
     * Query: { 
     *   messageStats { 
     *     total unread read deleted 
     *   } 
     * }
     */
    @Query(() => MessageStatsType, {
        name: 'messageStats',
        description: 'Get message count statistics (admin only)'
    })
    async getMessageStats(): Promise<{
        total: number;
        unread: number;
        read: number;
        deleted: number;
    }> {
        return this.messagesService.getMessageStats();
    }

    /**
     * GraphQL Query: Get all soft-deleted messages
     * Query: { 
     *   deletedMessages { 
     *     id fullName email subject deletedAt
     *   } 
     * }
     */
    @Query(() => [Message], {
        name: 'deletedMessages',
        description: 'Get all soft-deleted messages (admin only)'
    })
    async getDeletedMessages(): Promise<Message[]> {
        return this.messagesService.findDeleted();
    }

    /**
     * GraphQL Mutation: Create a new message (public - used by contact form)
     * Mutation: { 
     *   createMessage(input: { 
     *     fullName: "John Doe", 
     *     email: "john@example.com",
     *     city: "New York",
     *     subject: "Portfolio Inquiry",
     *     messageDescription: "I love your work! Let's collaborate."
     *   }) {
     *     id fullName subject createdAt
     *   }
     * }
     */
    @Mutation(() => Message, {
        description: 'Create a new message (public endpoint for contact form)'
    })
    async createMessage(
        @Args('input') createMessageInput: CreateMessageInput
    ): Promise<Message> {
        return this.messagesService.create(createMessageInput);
    }

    /**
     * GraphQL Mutation: Mark a message as read
     * Mutation: {
     *   markMessageAsRead(id: "message-id") {
     *     id isRead readAt
     *   }
     * }
     */
    @Mutation(() => Message, {
        description: 'Mark a message as read (admin only)'
    })
    async markMessageAsRead(@Args('id') id: string): Promise<Message> {
        return this.messagesService.markAsRead(id);
    }

    /**
     * GraphQL Mutation: Mark a message as unread
     * Mutation: {
     *   markMessageAsUnread(id: "message-id") {
     *     id isRead readAt
     *   }
     * }
     */
    @Mutation(() => Message, {
        description: 'Mark a message as unread (admin only)'
    })
    async markMessageAsUnread(@Args('id') id: string): Promise<Message> {
        return this.messagesService.markAsUnread(id);
    }

    /**
     * GraphQL Mutation: Soft delete a message
     * Mutation: { softDeleteMessage(id: "message-id") }
     */
    @Mutation(() => Boolean, {
        description: 'Soft delete a message (admin only)'
    })
    async softDeleteMessage(@Args('id') id: string): Promise<boolean> {
        return this.messagesService.softDelete(id);
    }

    /**
     * GraphQL Mutation: Restore a soft-deleted message
     * Mutation: {
     *   restoreMessage(id: "message-id") {
     *     id fullName subject isDeleted
     *   }
     * }
     */
    @Mutation(() => Message, {
        description: 'Restore a soft-deleted message (admin only)'
    })
    async restoreMessage(@Args('id') id: string): Promise<Message> {
        return this.messagesService.restore(id);
    }

    /**
     * GraphQL Mutation: Permanently delete a message
     * WARNING: This cannot be undone!
     * Mutation: { permanentDeleteMessage(id: "message-id") }
     */
    @Mutation(() => Boolean, {
        description: 'Permanently delete a message - WARNING: Cannot be undone! (admin only)'
    })
    async permanentDeleteMessage(@Args('id') id: string): Promise<boolean> {
        return this.messagesService.permanentDelete(id);
    }
}

/**
 * GraphQL ObjectType for message statistics
 * This is used to return message count data
 */
@ObjectType()
class MessageStatsType {
    @Field(() => Int)
    total: number;

    @Field(() => Int)
    unread: number;

    @Field(() => Int)
    read: number;

    @Field(() => Int)
    deleted: number;
}
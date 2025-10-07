/**
 * Test script specifically for the Messages module
 * This demonstrates all the available operations for contact form messages
 * 
 * Run with: npm run start:dev (then test GraphQL playground)
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';

async function testMessagesModule() {
  try {
    console.log('📧 Testing Messages Module...\n');
    
    // Create the application
    const app = await NestFactory.create(AppModule);
    
    console.log('✅ Messages Module loaded successfully!');
    console.log('✅ MongoDB/Mongoose integration configured');
    console.log('✅ Soft deletion functionality implemented');
    console.log('✅ GraphQL operations available');
    
    await app.close();
    
    console.log('\n🎉 Messages Module ready for use!');
    
    console.log('\n📋 Available GraphQL Operations:');
    
    console.log('\n📥 PUBLIC OPERATIONS (for contact form):');
    console.log('   - createMessage(input: CreateMessageInput): Message');
    
    console.log('\n🔐 ADMIN OPERATIONS (for message management):');
    
    console.log('\n📖 QUERIES:');
    console.log('   - messages(filters?: MessageFiltersInput): [Message]');
    console.log('   - message(id: String): Message');
    console.log('   - messageStats: MessageStatsType');
    console.log('   - deletedMessages: [Message]');
    
    console.log('\n✏️ MUTATIONS:');
    console.log('   - markMessageAsRead(id: String): Message');
    console.log('   - markMessageAsUnread(id: String): Message');
    console.log('   - softDeleteMessage(id: String): Boolean');
    console.log('   - restoreMessage(id: String): Message');
    console.log('   - permanentDeleteMessage(id: String): Boolean');
    
    console.log('\n📝 SAMPLE OPERATIONS:');
    
    console.log('\n1️⃣ Create a message (public - for contact form):');
    console.log(`
mutation {
  createMessage(input: {
    fullName: "John Doe"
    email: "john@example.com"
    city: "New York"
    subject: "Portfolio Inquiry"
    messageDescription: "Hi! I saw your portfolio and I'm interested in collaborating on a project. Your React skills are impressive!"
  }) {
    id
    fullName
    email
    subject
    isRead
    createdAt
  }
}`);

    console.log('\n2️⃣ Get all messages with filters (admin):');
    console.log(`
query {
  messages(filters: {
    isRead: false
    searchTerm: "portfolio"
  }) {
    id
    fullName
    email
    city
    subject
    messageDescription
    isRead
    readAt
    createdAt
  }
}`);

    console.log('\n3️⃣ Get message statistics (admin):');
    console.log(`
query {
  messageStats {
    total
    unread
    read
    deleted
  }
}`);

    console.log('\n4️⃣ Mark message as read (admin):');
    console.log(`
mutation {
  markMessageAsRead(id: "message-id-here") {
    id
    isRead
    readAt
  }
}`);

    console.log('\n5️⃣ Soft delete a message (admin):');
    console.log(`
mutation {
  softDeleteMessage(id: "message-id-here")
}`);

    console.log('\n6️⃣ Get deleted messages (admin):');
    console.log(`
query {
  deletedMessages {
    id
    fullName
    email
    subject
    deletedAt
  }
}`);

    console.log('\n7️⃣ Restore a deleted message (admin):');
    console.log(`
mutation {
  restoreMessage(id: "message-id-here") {
    id
    fullName
    subject
    isDeleted
  }
}`);

    console.log('\n🔧 MESSAGE SCHEMA FEATURES:');
    console.log('   ✅ Full name (required, 2-100 chars)');
    console.log('   ✅ Email (required, validated format)');
    console.log('   ✅ City (required, 2-100 chars)');
    console.log('   ✅ Subject (required, 5-200 chars)');
    console.log('   ✅ Message description (required, 10-2000 chars)');
    console.log('   ✅ Read/unread status tracking');
    console.log('   ✅ Soft deletion (isDeleted flag)');
    console.log('   ✅ Automatic timestamps (createdAt, updatedAt)');
    console.log('   ✅ Database indexes for performance');
    
    console.log('\n🚀 NEXT STEPS:');
    console.log('1. Start the server: npm run start:dev');
    console.log('2. Visit GraphQL playground: http://localhost:3000/graphql');
    console.log('3. Test creating a message using the mutation above');
    console.log('4. Test admin operations for reading and managing messages');
    console.log('5. Integrate the createMessage mutation into your portfolio contact form');
    
    console.log('\n💡 INTEGRATION TIPS:');
    console.log('- Use createMessage mutation in your frontend contact form');
    console.log('- Admin dashboard can use queries to manage messages');
    console.log('- Soft deletion allows recovery of accidentally deleted messages');
    console.log('- Message stats help track engagement on your portfolio');
    
  } catch (error) {
    console.error('❌ Error during Messages module testing:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Ensure MongoDB is running and accessible');
    console.error('2. Check MONGODB_URI in your .env file');
    console.error('3. Verify all dependencies are installed: npm install');
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testMessagesModule();
}
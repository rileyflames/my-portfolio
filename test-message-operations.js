// Test message operations (mark as read, filtering, etc.)
const fetch = require('node-fetch');

const GRAPHQL_URL = 'http://localhost:3000/graphql';

async function makeGraphQLRequest(query, variables = {}) {
  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('GraphQL request failed:', error);
    return { error: error.message };
  }
}

async function testMessageOperations() {
  console.log('📧 Testing Message Operations...\n');

  // 1. Get all messages first
  console.log('1. Getting all messages...');
  const allMessages = await makeGraphQLRequest(`
    query {
      messages {
        id
        fullName
        email
        subject
        isRead
        readAt
        createdAt
      }
    }
  `);
  
  console.log('All Messages:', JSON.stringify(allMessages.data, null, 2));
  
  const messageId = allMessages.data?.messages?.[0]?.id;
  console.log(`\nUsing message ID: ${messageId}\n`);

  if (messageId) {
    // 2. Mark a message as read
    console.log('2. Marking message as read...');
    const markAsRead = await makeGraphQLRequest(`
      mutation {
        markMessageAsRead(id: "${messageId}") {
          id
          fullName
          subject
          isRead
          readAt
          createdAt
        }
      }
    `);
    console.log('Marked as read:', JSON.stringify(markAsRead.data, null, 2));
    console.log('\n---\n');

    // 3. Get message statistics after marking as read
    console.log('3. Getting updated message statistics...');
    const stats = await makeGraphQLRequest(`
      query {
        messageStats {
          total
          unread
          read
          deleted
        }
      }
    `);
    console.log('Updated Stats:', JSON.stringify(stats.data, null, 2));
    console.log('\n---\n');

    // 4. Filter messages by read status
    console.log('4. Getting only unread messages...');
    const unreadMessages = await makeGraphQLRequest(`
      query {
        messages(filters: { isRead: false }) {
          id
          fullName
          subject
          isRead
          createdAt
        }
      }
    `);
    console.log('Unread Messages:', JSON.stringify(unreadMessages.data, null, 2));
    console.log('\n---\n');

    // 5. Filter messages by email
    console.log('5. Getting messages from specific email...');
    const emailMessages = await makeGraphQLRequest(`
      query {
        messages(filters: { email: "john.doe@example.com" }) {
          id
          fullName
          email
          subject
          isRead
          createdAt
        }
      }
    `);
    console.log('Messages from john.doe@example.com:', JSON.stringify(emailMessages.data, null, 2));
    console.log('\n---\n');

    // 6. Search messages by term
    console.log('6. Searching messages by term "collaboration"...');
    const searchMessages = await makeGraphQLRequest(`
      query {
        messages(filters: { searchTerm: "collaboration" }) {
          id
          fullName
          subject
          messageDescription
          isRead
          createdAt
        }
      }
    `);
    console.log('Search Results:', JSON.stringify(searchMessages.data, null, 2));
    console.log('\n---\n');

    // 7. Mark message as unread again
    console.log('7. Marking message as unread...');
    const markAsUnread = await makeGraphQLRequest(`
      mutation {
        markMessageAsUnread(id: "${messageId}") {
          id
          fullName
          subject
          isRead
          readAt
          createdAt
        }
      }
    `);
    console.log('Marked as unread:', JSON.stringify(markAsUnread.data, null, 2));
  }

  console.log('\n✅ Message operations testing completed!');
}

// Run the message operations tests
testMessageOperations().catch(console.error);
// Simple Node.js script to test GraphQL endpoints
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

// Test queries
async function testEndpoints() {
  console.log('🚀 Testing GraphQL Endpoints...\n');

  // 1. Test getting all users
  console.log('1. Testing users query...');
  const usersResult = await makeGraphQLRequest(`
    query {
      users {
        id
        name
        email
        role
        createdAt
      }
    }
  `);
  console.log('Users:', JSON.stringify(usersResult, null, 2));
  console.log('\n---\n');

  // 2. Test getting all technologies
  console.log('2. Testing technologies query...');
  const techResult = await makeGraphQLRequest(`
    query {
      technologies {
        id
        name
        icon
        level
        createdAt
      }
    }
  `);
  console.log('Technologies:', JSON.stringify(techResult, null, 2));
  console.log('\n---\n');

  // 3. Test getting all projects
  console.log('3. Testing projects query...');
  const projectsResult = await makeGraphQLRequest(`
    query {
      projects {
        id
        name
        description
        progress
        githubLink
        createdAt
      }
    }
  `);
  console.log('Projects:', JSON.stringify(projectsResult, null, 2));
  console.log('\n---\n');

  // 4. Test getting messages
  console.log('4. Testing messages query...');
  const messagesResult = await makeGraphQLRequest(`
    query {
      messages {
        id
        fullName
        email
        subject
        messageDescription
        isRead
        createdAt
      }
    }
  `);
  console.log('Messages:', JSON.stringify(messagesResult, null, 2));
  console.log('\n---\n');

  // 5. Test creating a message (contact form)
  console.log('5. Testing create message mutation...');
  const createMessageResult = await makeGraphQLRequest(`
    mutation {
      createMessage(input: {
        fullName: "John Doe"
        email: "john.doe@example.com"
        city: "New York"
        subject: "Test Message"
        messageDescription: "This is a test message from the API test script."
      }) {
        id
        fullName
        email
        subject
        isRead
        createdAt
      }
    }
  `);
  console.log('Created Message:', JSON.stringify(createMessageResult, null, 2));
  console.log('\n---\n');

  // 6. Test getting aboutMe
  console.log('6. Testing aboutMe query...');
  const aboutMeResult = await makeGraphQLRequest(`
    query {
      aboutMe {
        id
        fullName
        dob
        startedCoding
        bio
        imageUrl
        createdAt
      }
    }
  `);
  console.log('About Me:', JSON.stringify(aboutMeResult, null, 2));
}

// Run the tests
testEndpoints().catch(console.error);
// Comprehensive GraphQL API test with data creation
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

async function runComprehensiveTests() {
  console.log('🚀 Comprehensive GraphQL API Testing...\n');

  // 1. Create a user first
  console.log('1. Creating a user...');
  const createUserResult = await makeGraphQLRequest(`
    mutation {
      createUser(createUserInput: {
        name: "John Smith"
        email: "john.smith@example.com"
        password: "password123"
        role: "ADMIN"
      }) {
        id
        name
        email
        role
        createdAt
      }
    }
  `);
  console.log('Created User:', JSON.stringify(createUserResult, null, 2));
  
  const userId = createUserResult.data?.createUser?.id;
  console.log('\n---\n');

  // 2. Create some technologies
  console.log('2. Creating technologies...');
  const techResults = [];
  
  const technologies = [
    { name: "React", icon: "⚛️", level: "ADVANCED" },
    { name: "Node.js", icon: "🟢", level: "ADVANCED" },
    { name: "TypeScript", icon: "🔷", level: "INTERMEDIATE" },
    { name: "GraphQL", icon: "🔗", level: "INTERMEDIATE" }
  ];

  for (const tech of technologies) {
    const result = await makeGraphQLRequest(`
      mutation {
        createTechnology(input: {
          name: "${tech.name}"
          icon: "${tech.icon}"
          level: ${tech.level}
        }) {
          id
          name
          icon
          level
          createdAt
        }
      }
    `);
    techResults.push(result);
    console.log(`Created ${tech.name}:`, result.data?.createTechnology?.id);
  }
  console.log('\n---\n');

  // 3. Create a contributor
  console.log('3. Creating a contributor...');
  const createContributorResult = await makeGraphQLRequest(`
    mutation {
      createContributor(input: {
        name: "Jane Developer"
        email: "jane@example.com"
        github: "https://github.com/jane-dev"
      }) {
        id
        name
        email
        github
        createdAt
      }
    }
  `);
  console.log('Created Contributor:', JSON.stringify(createContributorResult, null, 2));
  
  const contributorId = createContributorResult.data?.createContributor?.id;
  console.log('\n---\n');

  // 4. Create a project (if we have a user)
  if (userId) {
    console.log('4. Creating a project...');
    const techIds = techResults
      .filter(r => r.data?.createTechnology?.id)
      .map(r => r.data.createTechnology.id)
      .slice(0, 2); // Use first 2 technologies

    const createProjectResult = await makeGraphQLRequest(`
      mutation {
        createProject(input: {
          name: "Portfolio Website"
          githubLink: "https://github.com/user/portfolio"
          liveUrl: "https://myportfolio.com"
          progress: "COMPLETED"
          description: "A modern portfolio website built with React and GraphQL"
          technologyIds: ${JSON.stringify(techIds)}
          tags: ["portfolio", "web", "frontend"]
          contributorIds: ${contributorId ? `["${contributorId}"]` : '[]'}
          createdById: "${userId}"
        }) {
          id
          name
          description
          progress
          githubLink
          liveUrl
          tags
          createdAt
        }
      }
    `);
    console.log('Created Project:', JSON.stringify(createProjectResult, null, 2));
    console.log('\n---\n');
  }

  // 5. Create AboutMe profile (if we have technologies)
  const techIds = techResults
    .filter(r => r.data?.createTechnology?.id)
    .map(r => r.data.createTechnology.id);

  if (techIds.length > 0) {
    console.log('5. Creating AboutMe profile...');
    const createAboutMeResult = await makeGraphQLRequest(`
      mutation {
        createAboutMe(input: {
          fullName: "John Smith"
          dob: "1990-01-15"
          startedCoding: "2015-06-01"
          bio: "Passionate full-stack developer with 8+ years of experience building modern web applications."
          technologyIds: ${JSON.stringify(techIds)}
          imageUrl: "https://example.com/profile.jpg"
        }) {
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
    console.log('Created AboutMe:', JSON.stringify(createAboutMeResult, null, 2));
    console.log('\n---\n');
  }

  // 6. Create social media links
  console.log('6. Creating social media links...');
  const socialMediaLinks = [
    { name: "GitHub", link: "https://github.com/johnsmith", icon: "🐙" },
    { name: "LinkedIn", link: "https://linkedin.com/in/johnsmith", icon: "💼" },
    { name: "Twitter", link: "https://twitter.com/johnsmith", icon: "🐦" }
  ];

  for (const social of socialMediaLinks) {
    const result = await makeGraphQLRequest(`
      mutation {
        createSocialMediaLink(input: {
          name: "${social.name}"
          link: "${social.link}"
          icon: "${social.icon}"
        }) {
          id
          name
          link
          icon
          createdAt
        }
      }
    `);
    console.log(`Created ${social.name}:`, result.data?.createSocialMediaLink?.id);
  }
  console.log('\n---\n');

  // 7. Create some messages
  console.log('7. Creating contact messages...');
  const messages = [
    {
      fullName: "Alice Johnson",
      email: "alice@example.com",
      city: "San Francisco",
      subject: "Collaboration Opportunity",
      messageDescription: "Hi! I'd love to discuss a potential collaboration on a React project."
    },
    {
      fullName: "Bob Wilson",
      email: "bob@example.com", 
      city: "New York",
      subject: "Job Opportunity",
      messageDescription: "We have an exciting full-stack developer position that might interest you."
    }
  ];

  for (const message of messages) {
    const result = await makeGraphQLRequest(`
      mutation {
        createMessage(input: {
          fullName: "${message.fullName}"
          email: "${message.email}"
          city: "${message.city}"
          subject: "${message.subject}"
          messageDescription: "${message.messageDescription}"
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
    console.log(`Created message from ${message.fullName}:`, result.data?.createMessage?.id);
  }
  console.log('\n---\n');

  // 8. Now query all the data we created
  console.log('8. Querying all data...\n');

  // Get all users
  console.log('📋 All Users:');
  const allUsers = await makeGraphQLRequest(`
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
  console.log(JSON.stringify(allUsers.data, null, 2));
  console.log('\n');

  // Get all technologies
  console.log('🛠️ All Technologies:');
  const allTech = await makeGraphQLRequest(`
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
  console.log(JSON.stringify(allTech.data, null, 2));
  console.log('\n');

  // Get all projects with relations
  console.log('🚀 All Projects:');
  const allProjects = await makeGraphQLRequest(`
    query {
      projects {
        id
        name
        description
        progress
        githubLink
        liveUrl
        tags
        technologies {
          name
          icon
          level
        }
        contributors {
          name
          email
        }
        createdBy {
          name
          email
        }
        createdAt
      }
    }
  `);
  console.log(JSON.stringify(allProjects.data, null, 2));
  console.log('\n');

  // Get AboutMe with relations
  console.log('👤 About Me Profile:');
  const aboutMe = await makeGraphQLRequest(`
    query {
      aboutMe {
        id
        fullName
        dob
        startedCoding
        bio
        imageUrl
        technologies {
          name
          icon
          level
        }
        social {
          name
          link
          icon
        }
        createdAt
      }
    }
  `);
  console.log(JSON.stringify(aboutMe.data, null, 2));
  console.log('\n');

  // Get all messages
  console.log('📧 All Messages:');
  const allMessages = await makeGraphQLRequest(`
    query {
      messages {
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
    }
  `);
  console.log(JSON.stringify(allMessages.data, null, 2));
  console.log('\n');

  // Get message statistics
  console.log('📊 Message Statistics:');
  const messageStats = await makeGraphQLRequest(`
    query {
      messageStats {
        total
        unread
        read
        deleted
      }
    }
  `);
  console.log(JSON.stringify(messageStats.data, null, 2));
  console.log('\n');

  console.log('✅ Comprehensive API testing completed!');
}

// Run the comprehensive tests
runComprehensiveTests().catch(console.error);
// Simple test for image upload functionality
const fetch = require('node-fetch');

const GRAPHQL_URL = 'http://localhost:3000/graphql';

async function testUploadEndpoints() {
  console.log('🖼️ Testing Image Upload Endpoints...\n');

  // Test that upload mutations are available in the schema
  const introspectionQuery = `
    query {
      __schema {
        mutationType {
          fields {
            name
            description
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: introspectionQuery,
      }),
    });

    const result = await response.json();
    
    if (result.data) {
      const mutations = result.data.__schema.mutationType.fields;
      const uploadMutations = mutations.filter(field => 
        field.name.toLowerCase().includes('upload') || 
        field.description?.toLowerCase().includes('upload')
      );

      console.log('📋 Available Upload Mutations:');
      uploadMutations.forEach(mutation => {
        console.log(`  • ${mutation.name}: ${mutation.description || 'No description'}`);
      });

      console.log(`\n✅ Found ${uploadMutations.length} upload mutations in the schema!`);
    } else {
      console.log('❌ Failed to get schema information:', result.errors);
    }

  } catch (error) {
    console.error('❌ Error testing upload endpoints:', error.message);
  }
}

// Test the upload endpoints
testUploadEndpoints();
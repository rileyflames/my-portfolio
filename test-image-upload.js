// Test image upload functionality
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const GRAPHQL_URL = 'http://localhost:3000/graphql';

// Create a simple test image (1x1 pixel PNG)
function createTestImage() {
  // Base64 encoded 1x1 transparent PNG
  const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==';
  const buffer = Buffer.from(base64Data, 'base64');
  
  const testImagePath = path.join(__dirname, 'test-image.png');
  fs.writeFileSync(testImagePath, buffer);
  
  return testImagePath;
}

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

async function uploadFile(mutation, filePath, variables = {}) {
  try {
    const form = new FormData();
    
    // Add the GraphQL operation
    form.append('operations', JSON.stringify({
      query: mutation,
      variables: variables
    }));
    
    // Add the file map
    form.append('map', JSON.stringify({
      '0': ['variables.file']
    }));
    
    // Add the actual file
    form.append('0', fs.createReadStream(filePath));

    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      body: form,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('File upload failed:', error);
    return { error: error.message };
  }
}

async function testImageUploads() {
  console.log('🖼️ Testing Image Upload Functionality...\n');

  // Create a test image
  const testImagePath = createTestImage();
  console.log(`Created test image: ${testImagePath}\n`);

  try {
    // 1. Test general image upload
    console.log('1. Testing general image upload...');
    const uploadResult = await uploadFile(`
      mutation($file: Upload!) {
        uploadImage(file: $file, folder: "test") 
      }
    `, testImagePath);
    
    console.log('Upload Result:', JSON.stringify(uploadResult, null, 2));
    console.log('\n---\n');

    // 2. Test profile image upload
    console.log('2. Testing profile image upload...');
    const profileUploadResult = await uploadFile(`
      mutation($file: Upload!) {
        uploadProfileImage(file: $file)
      }
    `, testImagePath);
    
    console.log('Profile Upload Result:', JSON.stringify(profileUploadResult, null, 2));
    console.log('\n---\n');

    // 3. Test project image upload
    console.log('3. Testing project image upload...');
    const projectUploadResult = await uploadFile(`
      mutation($file: Upload!) {
        uploadProjectImage(file: $file)
      }
    `, testImagePath);
    
    console.log('Project Upload Result:', JSON.stringify(projectUploadResult, null, 2));
    console.log('\n---\n');

    // 4. Test technology icon upload
    console.log('4. Testing technology icon upload...');
    const techUploadResult = await uploadFile(`
      mutation($file: Upload!) {
        uploadTechnologyIcon(file: $file)
      }
    `, testImagePath);
    
    console.log('Technology Upload Result:', JSON.stringify(techUploadResult, null, 2));
    console.log('\n---\n');

    // 5. Test uploading and setting profile image for AboutMe
    console.log('5. Testing upload and set profile image...');
    const setProfileResult = await uploadFile(`
      mutation($file: Upload!) {
        uploadAndSetProfileImage(file: $file) {
          id
          fullName
          imageUrl
          updatedAt
        }
      }
    `, testImagePath);
    
    console.log('Set Profile Result:', JSON.stringify(setProfileResult, null, 2));
    console.log('\n---\n');

    // 6. Create a technology first, then upload icon for it
    console.log('6. Creating technology and uploading icon...');
    
    // First create a technology
    const createTechResult = await makeGraphQLRequest(`
      mutation {
        createTechnology(input: {
          name: "Test Framework"
          icon: "🧪"
          level: INTERMEDIATE
        }) {
          id
          name
          icon
        }
      }
    `);
    
    console.log('Created Technology:', JSON.stringify(createTechResult, null, 2));
    
    const techId = createTechResult.data?.createTechnology?.id;
    
    if (techId) {
      // Now upload an icon for this technology
      const techIconResult = await uploadFile(`
        mutation($file: Upload!, $technologyId: String!) {
          uploadTechnologyIcon(technologyId: $technologyId, file: $file) {
            id
            name
            icon
            updatedAt
          }
        }
      `, testImagePath, { technologyId: techId });
      
      console.log('Technology Icon Upload Result:', JSON.stringify(techIconResult, null, 2));
    }

    console.log('\n✅ Image upload testing completed!');

  } finally {
    // Clean up test image
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
      console.log(`\n🧹 Cleaned up test image: ${testImagePath}`);
    }
  }
}

// Run the image upload tests
testImageUploads().catch(console.error);
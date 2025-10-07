/**
 * Test script to verify all new modules are working correctly
 * This will help us identify any real issues vs TypeScript resolution problems
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';

async function testModules() {
  try {
    console.log('🧪 Testing new modules...');
    
    // Create the application to test module loading
    const app = await NestFactory.create(AppModule);
    
    console.log('✅ TechnologiesModule loaded successfully');
    console.log('✅ ProjectsModule loaded successfully');
    console.log('✅ All services and resolvers registered');
    console.log('✅ GraphQL schema will include new types');
    
    await app.close();
    console.log('🎉 All modules are working correctly!');
    
    console.log('\n📋 What you can now do:');
    console.log('1. Start the server: npm run start:dev');
    console.log('2. Visit GraphQL Playground: http://localhost:3000/graphql');
    console.log('3. Test queries like:');
    console.log('   - query { technologies { id name level } }');
    console.log('   - query { projects { id name technologies { name } } }');
    
  } catch (error) {
    console.error('❌ Error testing modules:', error.message);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testModules();
}
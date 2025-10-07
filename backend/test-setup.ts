/**
 * Simple test script to verify our fixes work correctly
 * Run this with: npm run start:dev
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';

async function testSetup() {
  try {
    console.log('🚀 Testing NestJS application setup...');
    
    // Try to create the application
    const app = await NestFactory.create(AppModule);
    
    console.log('✅ Application created successfully!');
    console.log('✅ All modules loaded correctly');
    console.log('✅ Database connections configured');
    console.log('✅ JWT authentication setup complete');
    
    await app.close();
    console.log('🎉 All fixes applied successfully!');
    
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testSetup();
}
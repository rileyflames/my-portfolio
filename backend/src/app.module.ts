import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'

// GraphQL imports
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

// DataBase Imports
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

// App Parts will go here
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // load the .ev
    ConfigModule.forRoot({
      isGlobal : true
    }),

    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver : ApolloDriver,
      autoSchemaFile : join(process.cwd(), 'src/schema.gql'),
      playground : true
    }),

    // PostgreSQL TypeORM
    TypeOrmModule.forRootAsync({
      imports : [ConfigModule],
      inject : [ConfigService],
      // important
      name: process.env.POSTGRES_CONNECTION_NAME, // NEEDED for working with multiple DBs
      useFactory : (configService : ConfigService) => ({
        type: 'postgres',
        host : configService.get<string>('POSTGRES_HOST'),
        port : parseInt(configService.get<string>('POSTGRES_PORT') ?? '5432'),
        username : configService.get<string>('POSTGRES_USER'),
        password : configService.get<string>('POSTGRES_PASSWORD'),
        database : configService.get<string>('POSTGRES_DB'),

        // ENTITIES

        entities : [__dirname + '/../**/*.entity{.ts,.}'],

        synchronize : true // in dev : false in prod
      }),
    }),

    // MongoDB (Mongoose)
    MongooseModule.forRootAsync({
      imports : [ConfigModule],
      inject : [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),

    // all my other modules
    UserModule,

    AuthModule,
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

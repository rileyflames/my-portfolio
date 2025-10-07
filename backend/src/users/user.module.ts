import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
// create and import user resolver and service


@Module({
    imports: [
        // Import the User entity so typeorm is aware of it
        TypeOrmModule.forFeature([User]),
    ],
    providers: []
})
export class UserModule {}
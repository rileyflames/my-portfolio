import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UserService } from './user.service'
import { UserResolver } from './user.resolver'


@Module({
    imports: [
        // Import the User entity so typeorm is aware of it
        TypeOrmModule.forFeature([User]),
    ],
    providers: [UserService, UserResolver],
    exports: [UserService],
})
export class UserModule {}
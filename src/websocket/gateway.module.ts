import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { clientSchema } from 'src/user/user.schema';
import { ClientService } from 'src/user/user.services';
import { AppGateway } from './gateway.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'client', schema: clientSchema }])],
  controllers: [],
  providers: [ ClientService , AppGateway ]
})
export class gatewayModule {}

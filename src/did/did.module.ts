import { Module } from '@nestjs/common';
import { DidService } from './services/did.service';
import { DidController } from './controllers/did.controller';
import { EdvService } from 'src/edv/services/edv.service';
import { EdvModule } from 'src/edv/edv.module';
import { DidRepository } from './repository/did.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Did, DidSchema } from './schemas/did.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Did.name, schema: DidSchema }]),
    EdvModule,
  ],
  controllers: [DidController],
  providers: [DidService, EdvService, DidRepository],
})
export class DidModule {}

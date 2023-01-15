import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppDto {
    @ApiProperty({
        description: "User DID",
        example: "did:hid:testnet:123123"
    })
    @IsNotEmpty()
    userId: string;
    

    @ApiProperty({
        description: "Application Name",
        example: "demo app"
    })
    @IsNotEmpty()
    appName: string;
}

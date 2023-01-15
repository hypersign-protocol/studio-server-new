import { IsNotEmpty } from "class-validator";

export class CreateAppDto {
    @IsNotEmpty()
    userId: string;
    
    @IsNotEmpty()
    appName: string;
}

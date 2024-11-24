import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description: string;
    
    @IsNumber({
        maxDecimalPlaces: 4,
    })
    @IsNotEmpty()
    @IsPositive()
    @Type(() => Number)
    price: number;
}

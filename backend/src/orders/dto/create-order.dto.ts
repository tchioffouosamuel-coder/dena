import { ArrayMinSize, IsArray, IsInt, IsPhoneNumber, IsString, Min, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemInput {
  @ApiProperty()
  @IsString()
  dishId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  customerName: string;

  @ApiProperty({ example: '+237655063419' })
  @IsString()
  @MinLength(8)
  customerPhone: string;

  @ApiProperty({ type: [OrderItemInput] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  items: OrderItemInput[];
}

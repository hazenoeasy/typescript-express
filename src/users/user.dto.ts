import { IsString, IsOptional, ValidateNested } from 'class-validator';
import CreateAddressDto from './address.dto';
class createUserDto {
	@IsString()
	public name: string;

	@IsString()
	public email: string;

	@IsString()
	public password: string;

	@IsOptional()
	@ValidateNested()
	public address: CreateAddressDto;
}
export default createUserDto;

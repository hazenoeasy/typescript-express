import { IsString } from 'class-validator';
class createUserDto {
	@IsString()
	public name: string;

	@IsString()
	public email: string;

	@IsString()
	public password: string;
}
export default createUserDto;

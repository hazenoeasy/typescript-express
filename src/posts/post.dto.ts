import { IsString } from 'class-validator';
class createPostDto {
	@IsString()
	public content: string;

	@IsString()
	public title: string;
}
export default createPostDto;

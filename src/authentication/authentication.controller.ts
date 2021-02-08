import * as bcrypt from 'bcrypt';
import * as express from 'express';
import { Router } from 'express';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../users/user.dto';
import userModel from '../users/user.model';
import LogInDto from './login.dto';
class AuthenticationController implements Controller {
	public path = '/auth';
	public router = express.Router();
	private user = userModel;

	constructor() {
		this.initializeRouter();
	}
	private initializeRouter() {
		this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
		this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
	}
	private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const userData: CreateUserDto = request.body;
		if (await this.user.findOne({ email: userData.email })) {
			next(new UserWithThatEmailAlreadyExistsException(userData.email));
		} else {
			const hashPassword = await bcrypt.hash(userData.password, 10);
			const user = await this.user.create({ ...userData, password: hashPassword }); //..可以展开多个对象并赋值，如果多个对象中存在相同属性，则后边的会覆盖前面展开的属性。
			console.log({ ...userData, password: hashPassword });
			user.password = undefined;
			response.send(user);
		}
	};
	private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const LogInData: LogInDto = request.body;
		const user = await this.user.findOne({ email: LogInData.email });
		if (user) {
			const isPasswordMatching = await bcrypt.compare(LogInData, user.password);
			if (isPasswordMatching) {
				user.password = undefined;
				response.send(user);
			} else {
				next(new WrongCredentialsException());
			}
		} else {
			next(new WrongCredentialsException());
		}
	};
}
export default AuthenticationController;

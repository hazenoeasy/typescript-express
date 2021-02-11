import * as bcrypt from 'bcrypt';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import Controller from '../interfaces/controller.interface';
import TokenData from '../interfaces/tokenData.interface';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../users/user.dto';
import userModel from '../users/user.model';
import LogInDto from './login.dto';
import User from '../users/user.interface';
import { NextFunction } from 'express';
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
		this.router.post(`${this.path}/logout`, this.loggingOut);
	}
	private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const userData: CreateUserDto = request.body;
		if (await this.user.findOne({ email: userData.email })) {
			next(new UserWithThatEmailAlreadyExistsException(userData.email));
		} else {
			const hashPassword = await bcrypt.hash(userData.password, 10);
			const user = await this.user.create({ ...userData, password: hashPassword }); //..可以展开多个对象并赋值，如果多个对象中存在相同属性，则后边的会覆盖前面展开的属性。
			// console.log({ ...userData, password: hashPassword });
			user.password = undefined;
			const tokenData = this.createToken(user);
			response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
			response.send(user);
		}
	};
	private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const LogInData: LogInDto = request.body;
		const user = await this.user.findOne({ email: LogInData.email });
		if (user) {
			const isPasswordMatching = await bcrypt.compare(LogInData.password, user.password);
			if (isPasswordMatching) {
				user.password = undefined;
				const tokenData = this.createToken(user);
				response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
				response.send(user);
			} else {
				next(new WrongCredentialsException());
			}
		} else {
			next(new WrongCredentialsException());
		}
	};
	private loggingOut = (request: express.Request, response: express.Response) => {
		response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
		response.sendStatus(200);
	};

	private createToken(user: User): TokenData {
		const expiresIn = 60 * 60; //hour
		const secret = process.env.JWT_SECRET;
		const dataStoredInToken: DataStoredInToken = {
			_id: user._id,
		};
		return {
			expiresIn,
			token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
		};
	}
	private createCookie(tokenData: TokenData) {
		return `Authorization=${tokenData.token};HttyOnly;Max-Age=${tokenData.expiresIn}`;
	}
}
export default AuthenticationController;

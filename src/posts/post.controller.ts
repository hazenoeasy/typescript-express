import * as express from 'express';
import Post from './post.interfaces';
import postModel from './post.model';
import PostException from '../exceptions/PostException';
import createPostDto from './post.dto';
import validationMiddleware from '../middleware/validation.middleware';
import authMiddleware from '../middleware/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
class PostsController {
	public path: string = '/posts';
	public router = express.Router();
	private post = postModel;
	constructor() {
		this.intializeRoutes();
	}
	public intializeRoutes() {
		this.router.get(this.path, this.getAllPosts);
		this.router.get(`${this.path}/:id`, this.getPostById);

		this.router
			.all(`${this.path}*`, authMiddleware) // /*只通配 /posts/xxxx
			.patch(`${this.path}/:id`, validationMiddleware(createPostDto, true), this.modifyPost)
			.delete(`${this.path}/:id`, this.deletePost)
			.post(this.path, validationMiddleware(createPostDto), this.createPost);
	}
	private getAllPosts = (request: express.Request, response: express.Response) => {
		this.post
			.find()
			.populate('author', '-password')
			.then((posts) => {
				response.send(posts);
			});
	};

	private getPostById = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const id = request.params.id;
		this.post
			.findById(id)
			.then((post) => response.send(post))
			.catch((err) => next(new PostException(id)));
	};

	private modifyPost = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const id = request.params.id;
		const postData: Post = request.body;
		this.post
			.findByIdAndUpdate(id, postData, { new: true })
			.then(function (post) {
				response.send(post);
			})
			.catch(function (err) {
				next(new PostException(id)); // 带参数的 根据函数重载  处理为err
			});
	};

	private createPost = async (request: RequestWithUser, response: express.Response) => {
		const postData: createPostDto = request.body;
		console.log('request:', request.user);
		const createdPost = new this.post({ ...postData, author: request.user._id });
		// createdPost.save().then((savedPost) => {
		// 	response.send(savedPost);
		// 	console.log(savedPost);
		// });
		const savedPost = await createdPost.save();
		console.log('savedPost:', savedPost);
		await savedPost.populate('author', '-password').execPopulate();
		response.send(savedPost);
	};

	private deletePost = (request: express.Request, response: express.Response, next: express.NextFunction) => {
		const id = request.params.id;
		this.post
			.findByIdAndDelete(id)
			.then((successResponse) => {
				response.send(200);
			})
			.catch(function (err) {
				next(new PostException(id));
			});
	};
}
export default PostsController;

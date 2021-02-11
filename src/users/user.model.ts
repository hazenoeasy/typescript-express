import * as mongoose from 'mongoose';
import User from './user.interface';

const addressSchema = new mongoose.Schema({
	city: String,
	street: String,
});
const userSchema = new mongoose.Schema({
	name: String,
	address: addressSchema,
	email: String,
	password: String,
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);
//https://github.com/Appsilon/styleguide/wiki/mongoose-typescript-models
/*
This is needed, even though it seems like it's redundant - TypeScript does not preserve runtime type information,
 so it's lost in the transpiling phase. On the other hand, the object model in a database does not need to match
  an in-memory representation exactly - we may want to add some other, "technical" properties.
  So now let's declare our schema:*/
// interface UserModel extends User, mongoose.Document {}
/*we've got all parts together, we'll want to have an actual implementation of our interface.
Fortunately, all we have to do is call the mongoose.model<T> method, passing the schema.
 Please note that the T type argument must derive from mongoose.Document
  - that's why we'll pass our mixin:
*/

export default userModel;

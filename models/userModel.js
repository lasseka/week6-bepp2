const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: { type: String, required: true },
    gender: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    membership_status: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// static signup function
//Reflection on the usage of this and static login:
//This is done to provide an understandable structure for creation + authentication
//and lessens repetition when creating and authenticating users
//The pros of this approach as I mentioned are for example the code clarity + understandability,
//as well as centralizing makes this approach less vulnerable to errors/vulnerabilities in the code for having to repeat
//One of the downsides of this method is that by tieing logic into the model,you in a way go against the MVC model opening yourself up to potential problems later
//You could alternatively handle these methods inside the controller or through middleware
userSchema.statics.signup = async function (name, email, password, phone_number, gender, date_of_birth, membership_status) {
  // validation
  if ((!name || !email || !password || !phone_number || !gender || !date_of_birth || !membership_status)) {
    throw Error("Please add all fields");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  const userExists = await this.findOne({ email });

  if (userExists) {
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await this.create({
    name,
    email,
    password: hashedPassword,
    phone_number,
    gender,
    date_of_birth,
    membership_status
  });

  return user;
};

// static login function
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);

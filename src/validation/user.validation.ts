import Joi from 'joi'

type TLoginParams = {
    username: string;
    password: string;
}
export const LoginValidationSchema = Joi.object<TLoginParams>({
    username: Joi.string().required().messages({username:"Username is required"}),
    password: Joi.string().required().messages({password:"Password is required"}) 
})

type TRegisterParams = {
    username: string;
    fullname: string;
    email: string;
    password: string;
    confirmpassword: string;
    role?: string
}

export const RegisterValidationSchema = Joi.object<TRegisterParams>({
    username: Joi.string().required().messages({ username: "Username is required" }),
    fullname: Joi.string().required().messages({ fullname: "Fullname is required" }),
    email: Joi.string().email().required().messages({ email: "Email is required" }),
    password: Joi.string().required().messages({ password: "Password is required" }),
    role: Joi.string().optional(),
    confirmpassword: Joi.string().required()
      .valid(Joi.ref('password')) 
      .messages({ 'any.only': 'Passwords must match' }), 
  });


export const UpdateUserAccountValidationSchema = Joi.object({
    username: Joi.string(),
    fullname: Joi.string(),
    email: Joi.string().email(),
}).min(1).messages({ "object.min": "At least one field is required" })


export const VideoBodyUrlCreate = Joi.object({
    title: Joi.string().required().messages({title: 'title is required'}),
    url: Joi.string().uri()

})
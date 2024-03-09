import  { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import { User } from '../models/user.model';
import UserProfile from '../models/profile.model';


export default passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.OAUTH_CLIENTID!,
            clientSecret: process.env.OAUTH_CLIENTSECRET!,
            callbackURL: 'http://localhost:3000/api/v1/auth/google/callback'
        },
        async (accessToken,refreshToken,profile,callback) => {
            try {
                const email = profile.emails && profile.emails[0].value;
                const avatar = profile.photos && profile.photos[0].value
                let user = await User.findOne({ email: email });
                if (!user) {
                    user = await UserProfile.findOne({ id: profile.id, provider: profile.provider });
                }
                 if (user) {
                    return callback(null,user)
                 }
                 const newUser = new UserProfile({
                    provider: profile.provider,
                    fullname: profile.displayName,
                    email,
                    id:profile.id,
                    username:profile.username,
                    avatar,
                    refreshToken: refreshToken,
                });
                await newUser.save()
                callback(null, newUser);
            } catch (error:any) {
                callback(error, false)
            }
        }
    )
)

passport.serializeUser((user:any,done) => {
    console.log(user)
    done(null,user._id)
})

passport.deserializeUser(async (_id,done) => {
   await UserProfile.findById(_id, (err:any, user:any) => {
        done(err, user);
    });
})
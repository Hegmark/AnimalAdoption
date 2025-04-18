import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../models/User';

export const configurePassport = (passport: PassportStatic): PassportStatic => {

    passport.serializeUser((user: any, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
          const user = await User.findById(id);
          if (!user) return done(new Error('User not found'));
          done(null, user);
        } catch (err) {
          done(err);
        }
      });

    passport.use('local', new Strategy({usernameField: "email"},(email, password, done) => {
        const query = User.findOne({ email: email });
        query.then(user => {
            if (user) {
                user.comparePassword(password, (err, isMatch) => {
                    if (err || !isMatch) {
                      return done(null, false);
                    }
          
                    return done(null, user);
                  });
            } else {
                done(null, undefined);
            }
        }).catch(error => {
            done(error);
        })
    }));

    return passport;
}
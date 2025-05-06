"use strict";

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import db from './db.js'; 

passport.use(new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
        try {
            const user = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
                    if (err) reject(err);
                    resolve(user);
                });
            });

            if (!user) {
                return done(null, false, { message: 'Email non trovata.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            
            if (isMatch) {
                return done(null, user); 
            } else {
                return done(null, false, { message: 'Password errata.' }); 
            }

        } catch (err) {
            return done(err); 
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id); 
});

passport.deserializeUser((id, done) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
        done(err, user);
    });
});

export default passport;

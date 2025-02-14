import { Router } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user in your database
        const user = await prisma.user.upsert({
          where: { email: profile.emails![0].value },
          update: {},
          create: {
            email: profile.emails![0].value,
            passwordHash: '', // Since using Google auth
            role: 'customer', // Default role
            phoneNumber: null,
            balance: 0,
          },
        });
        done(null, user);
      } catch (error) {
        done(error as Error);
      }
    }
  )
);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

export default router;
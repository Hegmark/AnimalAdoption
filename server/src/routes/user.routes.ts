import { Router, Request, Response, NextFunction } from 'express';
import { PassportStatic } from 'passport';
import { IUser, User } from '../models/User';
import { requireRole } from '../middlewares/auth';
import { Animal } from '../models/Animal';
import mongoose from 'mongoose';


export const userRoutes = (passport: PassportStatic, router: Router): Router => {

    router.get('/', (req: Request, res: Response) => {
        res.status(200).send('Hello, World!');
    });


    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (error: string | null, user: typeof User) => {
            if (error) {
                console.log(error);
                return res.status(500).send(error);
            } else {
                if (!user) {
                    return res.status(400).send('User not found.');
                } else {
                    req.login(user, (err: string | null) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send('Internal server error.');
                        } else {
                            return res.status(200).send(user.name);
                        }
                    });
                }
            }
        })(req, res, next);
    });

    router.post('/register', (req: Request, res: Response) => {
        const { username, email, password } = req.body;
        const user = new User({
            username: username,
            email: email,
            passwordHash: password,
            role: 'adopter',
            favorites: []
        });
        user.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        })
    });

    router.post('/logout', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.get('/checkAuth', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const user = req.user as IUser;
            res.status(200).json({ authenticated: true , user: user});
        } else {
            res.status(401).json({ authenticated: false });
        }
    });

    router.post('/favorites/:animalId', requireRole('adopter'), (req: Request, res: Response) => {
        const user = req.user as IUser;
        const userId = user._id;
        const animalId = req.params.animalId;

        Animal.findOne({animalId: animalId}).then(animal => {
            if (!animal) return res.status(404).send('Animal not found.');
    
            User.findById(userId).then(user => {
                if (!user) return res.status(404).send('User not found.');
    
                const alreadyFavorited = user.favorites.some(favId =>
                    favId.toString() === animal._id.toString()
                );
    
                if (!alreadyFavorited) {
                    user.favorites.push(animal._id as unknown as mongoose.Types.ObjectId);
                    user.save().then(() => {
                        res.status(200).send({
                            message: 'Animal added to favorites.',
                            favorites: user.favorites
                        });
                    });
                } else {
                    res.status(200).send({
                        message: 'Animal already in favorites.',
                        favorites: user.favorites
                    });
                }
            });
        }).catch(error => {
            console.error(error);
            res.status(500).send('Internal server error.');
        });
    });

    router.get('/favorites', requireRole("adopter"), (req: Request, res: Response) => {
        const user = req.user as IUser;
        const userId = user._id;

        User.findById(userId).populate('favorites')
            .then(user => {
                if (!user) return res.status(404).send('User not found.');
                res.status(200).send(user.favorites);
            })
            .catch(error => {
                console.error(error);
                res.status(500).send('Internal server error.');
            });
    });

    router.delete('/favorites/:animalId', requireRole("adopter"), (req: Request, res: Response) => {
        const user = req.user as IUser;
        const userId = user._id;
        const animalId = req.params.animalId;

        User.findById(userId).then(user => {
            if (!user) return res.status(404).send('User not found.');
            Animal.findOne({ animalId: animalId }).then(animal => {
                const index = user.favorites.findIndex(
                    fav => fav.toString() === animal?._id.toString()
                );
                if (index === -1) return res.status(404).send('Animal not in favorites.');
                user.favorites.splice(index, 1);
                user.save().then(() => {
                    res.status(200).send({ message: 'Animal removed from favorites.', favorites: user.favorites });
                });
            })
        }).catch(error => {
            console.error(error);
            res.status(500).send('Internal server error.');
        })
    });

    return router;
}
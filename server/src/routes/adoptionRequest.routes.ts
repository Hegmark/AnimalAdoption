import { Router, Request, Response } from 'express';
import { requireAuthentication, requireRole } from '../middlewares/auth';
import { AdoptionRequest } from '../models/AdoptionRequest';
import { IUser } from '../models/User';
import mongoose from 'mongoose';
import { Animal } from '../models/Animal';


const router = Router();

router.post('/create', requireRole("adopter"), (req: Request, res: Response) => {
    const { animalId, message, adoptionDate } = req.body;
    const user = req.user as IUser;
    const userId = user._id;

    Animal.findOne({ animalId: animalId })
        .then(animal => {
            if (!animal) return res.status(404).send('Animal not found.');

            AdoptionRequest.findOne({ animalId: animal._id, userId: userId, status: 'pending' })
                .then(existingRequest => {
                    if (existingRequest) {
                        return res.status(400).send('Már van függő örökbefogadási kérelmed ennél az állatnál.');
                    }

                    const newRequest = new AdoptionRequest({
                        animalId: animal._id as unknown as mongoose.Types.ObjectId,
                        userId,
                        message,
                        adoptionDate,
                        status: 'pending',
                        createdAt: new Date()
                    });

                    newRequest.save()
                        .then(data => res.status(201).send(data))
                        .catch(err => {
                            console.error(err);
                            res.status(500).send('Error creating adoption request.');
                        });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send('Error checking existing adoption requests.');
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error finding animal.');
        });
});

router.get('/', requireRole('admin'), (req: Request, res: Response) => {
    AdoptionRequest.find()
        .populate('animalId')
        .populate('userId', 'username email')
        .then(data => res.status(200).send(data))
        .catch(err => {
            console.error(err);
            res.status(500).send('Error fetching adoption requests.');
        });
});


router.delete('/:id', requireRole("admin"), (req: Request, res: Response) => {
    const id = req.params.id;

    AdoptionRequest.findOneAndDelete({ adReId: id })
        .then(deleted => {
            if (!deleted) return res.status(404).send('Request not found.');
            res.status(200).send({ message: 'Adoption request deleted.' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error deleting request.');
        });
});



router.get('/my-requests', requireRole('adopter'), (req: Request, res: Response) => {
    const user = req.user as IUser;
    const userId = user._id;

    AdoptionRequest.find({ userId: userId })
        .populate('animalId')
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error fetching your adoption requests.');
        });
});

router.put('/update/:id', requireRole('admin'), (req: Request, res: Response) => {
    const id = req.params.id;
    const { status } = req.body;

    AdoptionRequest.findOneAndUpdate({ adReId: id }, { status }, { new: true })
        .then(data => {
            if (!data) return res.status(404).send('Adoption request not found.');

            const availability = !(status === 'approved')
            Animal.findByIdAndUpdate(data.animalId, { available: availability })
                .then(() => {
                    res.status(200).send(data);
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send('Error updating animal availability.');
                });
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal server error.');
        });
});

router.get('/:id', requireAuthentication(), (req: Request, res: Response) => {
    const id = req.params.id;

    AdoptionRequest.findOne({ adReId: id })
        .then(adoptionRequest => {
            if (!adoptionRequest) return res.status(404).send('Request not found.');
            const user = req.user as IUser;
            if (!(adoptionRequest.userId.toString() === user._id.toString()) && user.role !== 'admin') {
                return res.status(403).send('You do not have permission to view this request.');
            }
            res.status(200).send(adoptionRequest);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error finding request.');
        });
});

export default router;
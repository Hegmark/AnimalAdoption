import { Router, Request, Response } from 'express';
import { Animal } from '../models/Animal';
import { requireRole } from '../middlewares/auth';

const router = Router();

router.post('/create', requireRole('admin'), (req: Request, res: Response) => {
    const { name, species, breed, age, description, temperament, healthInfo, images, available } = req.body;
    const animal = new Animal({
        name,
        species,
        breed,
        age,
        description,
        temperament,
        healthInfo,
        images,
        available,
        createdAt: new Date()
    });

    animal.save()
        .then(data => res.status(200).send(data))
        .catch(error => res.status(500).send(error));
});

router.get('/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    Animal.findOne({ animalId: id })
        .then(data => {
            if (!data) return res.status(404).send('Animal not found.');
            res.status(200).send(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send('Internal server error.');
        });
});

router.get('/', (req: Request, res: Response) => {
    Animal.find()
        .then(data => res.status(200).send(data))
        .catch(error => {
            console.log(error);
            res.status(500).send('Internal server error.');
        });
});

router.put('/update/:id', requireRole('admin'), (req: Request, res: Response) => {
    const id = req.params.id;
    const update = req.body;

    Animal.findOneAndUpdate({ animalId: id }, update, { new: true })
        .then(data => {
            if (!data) return res.status(404).send('Animal not found.');
            res.status(200).send(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send('Internal server error.');
        });
});

router.delete('/:id', requireRole('admin'), (req: Request, res: Response) => {
    const id = req.params.id;

    Animal.findOneAndDelete({ animalId: id })
        .then(data => {
            if (!data) return res.status(404).send('Animal not found.');
            res.status(200).send('Animal deleted successfully.');
        })
        .catch(error => {
            console.log(error);
            res.status(500).send('Internal server error.');
        });
});

export default router;

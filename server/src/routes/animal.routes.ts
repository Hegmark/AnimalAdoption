import { Router, Request, Response, NextFunction } from 'express';
import { Animal } from '../models/Animal';
import { requireRole } from '../middlewares/auth';
import { upload } from "../multer";
import fs from 'fs/promises';
import path from 'path';

const router = Router();

router.post('/create', requireRole('admin'), upload.single('image'), (req, res) => {
    const {
        name,
        species,
        breed,
        age,
        description,
        temperament,
        healthInfo,
        available
    } = req.body;

    const a = new Animal({
        name,
        species,
        breed,
        age: parseInt(age, 10),
        description,
        temperament,
        healthInfo,
        available: available === 'true',
        createdAt: new Date(),
        images: []
    });

    if (req.file) {
        if (a.images) {
            a.images.push(`/uploads/${req.file.filename}`);
        } else {
            a.images = [`/uploads/${req.file.filename}`];
        }
    }

    a.save()
        .then(doc => res.status(201).json(doc))
        .catch(err => res.status(500).json({ error: err.message }));
}
);

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

router.delete('/:animalId', requireRole('admin'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const id = Number(req.params.animalId);
  
      try {
        const animal = await Animal.findOneAndDelete({ animalId: id });
        if (!animal) {
          res.status(404).send('Animal not found.');
          return;
        }
  
        const uploadsDir = path.resolve(__dirname, '../../uploads');
        const deletePromises = (animal.images || []).map(imgUrl => {
          const filename = path.basename(imgUrl);
          const filePath = path.join(uploadsDir, filename);
          return fs.unlink(filePath).catch(err => {
            console.warn(`Could not delete ${filePath}:`, err.message);
          });
        });
        await Promise.all(deletePromises);
  
        res.status(200).send('Animal and images deleted.');
      } catch (err) {
        next(err);
      }
    }
  );

export default router;

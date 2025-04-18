import { News } from '../models/News';
import { Router, Request, Response } from 'express';
import { requireRole } from '../middlewares/requireRole';

const router = Router();

router.post('/create', requireRole('admin'), (req: Request, res: Response) => {
    const { title, content } = req.body;
    const news = new News({
        title: title,
        content: content,
        date: new Date()
    });
    news.save().then(data => {
        res.status(200).send(data);
    }).catch(error => {
        res.status(500).send(error);
    })
});

router.get('/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const query = News.findOne({ newsId: id });
    query.then(data => {
        res.status(200).send(data);
    }).catch(error => {
        console.log(error);
        res.status(500).send('Internal server error.');
    })
});

router.get('/', (req: Request, res: Response) => {
    const query = News.find();
    query.then(data => {
        res.status(200).send(data);
    }).catch(error => {
        console.log(error);
        res.status(500).send('Internal server error.');
    })
});

router.put('/update/:id', requireRole('admin'), (req: Request, res: Response) => {
    const id = req.params.id;
    const { title, content } = req.body;

    News.findOneAndUpdate(
        { newsId: id },
        { title, content },
        { new: true }
    ).then(data => {
        if (!data) return res.status(404).send('News not found.');
        res.status(200).send(data);
    }).catch(error => {
        console.log(error);
        res.status(500).send('Internal server error.');
    });
});

router.delete('/:id', requireRole('admin'), (req: Request, res: Response) => {
    const id = req.params.id;

    News.findOneAndDelete({ newsId: id })
        .then(data => {
            if (!data) return res.status(404).send('News not found.');
            res.status(200).send('News deleted successfully.');
        })
        .catch(error => {
            console.log(error);
            res.status(500).send('Internal server error.');
        });
});




export default router;
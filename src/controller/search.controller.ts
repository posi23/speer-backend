import { Response } from 'express';
import { SearchService } from '../service';
import { CustomRequest } from '../types';

const searchNotes = async (req: CustomRequest, res: Response) => {
    const { q } = req.query;
    const userId = req.user.id;
    try {
        const result = await SearchService.searchNotes(userId, q as string);
        res.status(200).json(result);
    } catch (err: any) {
        console.error(err);
        res.status(err.status).send(err.message);
    }
}

export default { searchNotes };
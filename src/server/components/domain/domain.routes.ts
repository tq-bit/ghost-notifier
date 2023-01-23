import { Router, Request, Response } from 'express';
import Validator from '../../middleware/validator.middleware';

const router: Router = Router();

router.post('/create', Validator.validateDomainEntry, (req: Request, res: Response) => {
	console.log(req);

	res.redirect('/my-domains?status=success');
});

export default router;

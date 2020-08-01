import { ErrorRouter } from '../error';

import * as userController from '../controllers/user.controller';

const router = new ErrorRouter();

router.route('/').get(userController.getUsers).post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

export default router.router;

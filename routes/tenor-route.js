// Controller for this route
import tenorController from '../controllers/pages/tenor-controller';

// Express Route
const express = require('express');

const router = express.Router();

// The '/' is the root for your homepage
// So if user visits index, this router will call the pages controller for home
router.get('/', tenorController.renderTenor);

export default router;

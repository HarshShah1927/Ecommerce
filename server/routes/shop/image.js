const express = require('express');
const router = express.Router();
const Image = require('../models/Image'); // your MongoDB model
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary (use your real credentials here or from environment variables)
cloudinary.config({
  cloud_name: "dm700djba",
  api_key: "197158717287625",
  api_secret: "ZCpwhs6wRNowUlrBwpmInL-pQ-Y",
});

// DELETE image by ID
router.delete('/:id', async (req, res) => {
  try {
    // Find the image in MongoDB
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    // Delete from Cloudinary using public_id
    const result = await cloudinary.uploader.destroy(image.public_id);
    if (result.result !== 'ok' && result.result !== 'not found') {
      return res.status(500).json({ message: 'Cloudinary deletion failed', result });
    }

    // Delete from MongoDB
    await Image.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Image deleted from Cloudinary and database' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;

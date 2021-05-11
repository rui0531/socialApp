/**
 * Validates uploaded file formats
 * @author 200030212
 * @module js/media
 * @version 1.0
 */
(function() {
    /**
     * Validates uploaded file format
     * @param {Object} req - The request to the server
     * @param {Object} file - The file received from Multer
     * @param {Object} cb - Call back function to accept/reject file
     * @returns {Error} - Thrown error if file is rejected
     */
    const fileFilter = function(req, file, cb) {
        // Throw an error if file type does not match
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|mp4|MP4)$/)) {
            req.fileValidationError = 'Only image or MP4 video files are allowed!';
            return cb(new Error('Only image or MP4 video files are allowed!'), false);
        }
        cb(null, true);
    };

    module.exports = { fileFilter: fileFilter };
})();
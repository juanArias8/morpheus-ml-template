class ImageNotProvidedError(Exception):
    """Raised when image is not provided"""

    def __init__(self, message="Image not provided"):
        self.message = message
        super().__init__(self.message)


class ModelNotFoundError(Exception):
    """Raised when model is not found"""

    def __init__(self, message="Model not found"):
        self.message = message
        super().__init__(self.message)

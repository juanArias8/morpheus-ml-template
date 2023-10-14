class GenerationNotFoundError(Exception):
    """ Raised when a generation is not found in the database """

    def __init__(self, msg=None):
        self.msg = msg if msg else "The requested generation could not be found."

    def __str__(self):
        return self.msg


class RayCapacityExceededError(Exception):
    """ Raised when the Ray backend is at full capacity """

    def __init__(self, msg=None):
        self.msg = (
            msg
            if msg
            else "There is no capacity at the moment. Please try again later."
        )

    def __str__(self):
        return self.msg


class ImageTooLargeError(Exception):
    """ Raised when the image is too large to be processed """

    def __init__(self, msg=None):
        self.msg = msg if msg else "The image is too large to be processed."

    def __str__(self):
        return self.msg


class WorkerNotAvailableError(Exception):
    """
    No worker available: The system could not find any worker to process the task.
    """

    def __init__(self, msg=None):
        self.msg = msg if msg else "No worker available at this moment."

    def __str__(self):
        return self.msg
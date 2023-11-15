class UserNotFoundError(Exception):
    """ Raised when a user is not found in the database """

    def __init__(self, msg=None):
        self.msg = msg if msg else "The requested user could not be found."

    def __str__(self):
        return self.msg


class UserIsNotOwnerError(Exception):
    """ Raised when a user is not the owner of a resource """

    def __init__(self, msg=None):
        self.msg = msg if msg else "The user is not the owner of the resource."

    def __str__(self):
        return self.msg

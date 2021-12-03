class Reservation:
    type = None
    confirmation_num = None
    organization = None
    notes = ''

    def __init__(self, type="NA", organization="NA", confirmation_num="NA") -> None:
        self.type = type
        self.confirmation_num = confirmation_num
        self.organization = organization

    def toJSON(self) -> dict:
        """ Returns all parameters to JSON"""
        pass

from models.Reservation import Reservation


class Flight(Reservation):
    date = None
    location = None

    def __init__(self, organization="NA", confirmation_num="NA", date="NA", location="NA", ) -> None:
        super().__init__(type='Flight', organization=organization,
                         confirmation_num=confirmation_num)
        self.date = date
        self.location = location

    def toJSON(self) -> dict:
        return {
            "res_type": self.type,
            "res_org": self.organization,
            "res_confirmation_num": self.confirmation_num,
            "res_date": self.date,
            "res_location": self.location
        }

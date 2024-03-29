from models.Reservation import Reservation


class Flight(Reservation):
    date = None
    from_location = None
    to_location = None

    def __init__(self, organization="NA", confirmation_num="NA", date="NA", location="NA", ) -> None:
        super().__init__(type='Flight', organization=organization,
                         confirmation_num=confirmation_num)
        self.date = date

        locations = location.split(",")
        if (len(locations) == 1):
            self.from_location = location
            self.to_location = location
        else:
            self.from_location = locations[0]
            self.to_location = locations[1]

    def toJSON(self) -> dict:
        return {
            "res_type": self.type,
            "res_org": self.organization,
            "res_confirmation_num": self.confirmation_num,
            "res_date": self.date,
            "res_from_location": self.from_location,
            "res_to_location": self.to_location,
            "res_notes": self.notes
        }

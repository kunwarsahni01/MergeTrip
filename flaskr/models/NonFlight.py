from models.Reservation import Reservation


class NonFlight(Reservation):
    checkin = None
    checkout = None
    address = None

    def __init__(self, organization="NA", confirmation_num="NA", checkin="NA", checkout="NA", address="NA") -> None:
        super().__init__(type='NonFlight', organization=organization,
                         confirmation_num=confirmation_num)
        self.checkin = checkin
        self.checkout = checkout
        self.address = address

    def toJSON(self) -> dict:
        return {
            "res_type": self.type,
            "res_org": self.organization,
            "res_confirmation_num": self.confirmation_num,
            "res_address": self.address,
            "res_checkin": self.checkin,
            "res_checkout": self.checkout,
            "res_notes": self.notes
        }

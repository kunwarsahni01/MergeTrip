import en_core_web_sm
import spacy
import re
from transformers import AutoTokenizer, AutoModelForTokenClassification
from transformers import pipeline
from models.NonFlight import NonFlight
from models.Flight import Flight
from typing import Union


class Extractor:
    nlp = None
    nlp_spacy = None

    def __init__(self) -> None:
        tokenizer = AutoTokenizer.from_pretrained("dslim/bert-large-NER")
        model = AutoModelForTokenClassification.from_pretrained(
            "dslim/bert-large-NER")

        self.nlp = pipeline("ner", model=model, tokenizer=tokenizer,
                            aggregation_strategy="average")

        self.nlp_spacy = en_core_web_sm.load()

    def extract(self, email_body: str, email_sender: str, email_subject: str) -> Union[Flight, NonFlight]:
        ner_results = self.nlp(email_body)
        spacy_results = self.nlp_spacy(email_body)

        # print(ner_results)
        # print(spacy_results)

        # we need to add confirmation number and date
        address = self.extract_address(ner_results)
        org = self.extract_organization(ner_results)

        if self.is_flight_email(email_body, email_sender, email_subject):
            # change address to location
            return Flight(organization=org, location=address).toJSON()
        else:
            return NonFlight(organization=org, address=address).toJSON()

    def extract_address(self, ner_results: object) -> str:
        locations = []
        for result in ner_results:
            if result['entity_group'] == 'LOC':
                print(result)
                locations.append(result['word'])

        return ', '.join(locations)

    def extract_organization(self, ner_results: object) -> str:
        org = {'word': '', 'score': 0.8}
        for result in ner_results:
            if result['entity_group'] == 'ORG' and result['score'] > org['score']:
                print(result)
                org = result

        return org['word']

    def extract_date(self, spacy_results: object) -> str:
        matches = []
        dates = []

        # filters for date parsing, works in format Month(3 char) day or DOTW, Month Day
        regex_date_filter_1 = "[A-Z][a-z]+, [A-Z][a-z]+ [1-9]|[12][0-9]|3[01]"
        regex_date_filter_2 = "[A-Z][a-z][a-z] [1-9]|[12][0-9]|3[01]"

        for i in spacy_results.ents:
            if i.label_ == 'DATE' and i.text not in matches:
                matches.append(i.text)

        for match in matches:
            if re.match(regex_date_filter_1, match) != None or re.match(regex_date_filter_2, match) != None:
                dates.append(match)

        print(dates[0])
        return dates[0]

    def is_flight_email(self, email_body: str, email_sender: str, email_subject: str):
        email_body = email_body.lower()
        email_sender = email_sender.lower()
        email_subject = email_subject.lower()

        if ("american airlines" in email_sender or "delta" in email_sender):
            return True

        if ("airbnb" in email_sender or "marriott" in email_sender):
            return False

        if ("american airlines" in email_body or "delta" in email_body):
            return True

        if ("airbnb" in email_body or "marriott" in email_body):
            return False

        return False


# example = "My name is Wolfgang and I live in Berlin"
# example = "          Your reservation is confirmed        \n          You\n          Modern 2BR Apartment with Laundry        \n          Entire home/apt hosted by Frontdesk        \n        Friday,      \n\n\n        Sunday,      \n\n\n          View full itinerary        \n      Address    \n      917 Locust St, St. Louis, MO 63101, USA    \n        Get directions      \n      Guests    \n      4    \n        Invite guests      \n      Cancellation policy    \n      Cancel before 3:00 PM on Oct 7 and get a full refund. After that, cancel before 3:00 PM on Oct 8 and get a full refund, minus the first night and service fee.    \n      Cutoff times are based on the listing\n        More details      \n      Payments    \n                Payment 1 of 1              \n                $573.99              \n                Oct 07, 2021 \n                VISA \n                Amount paid (USD)              \n                $573.99              \n      Reservation code    \n      HMYWPPWRFD    \n          Change reservation        \n        House rules      \n            Check-in: After 3:00 PM          \n            Checkout: 11:00 AM          \n            Self check-in with lockbo\n          Show all        \n        Safety & Property Info      \n            Security camera/recording device          \n            Carbon mono\n            Smoke alarm          \n          Show all        \n      Frontdesk is your host    \n      Contact Frontdesk to coordinate arrival time and key e\n        Message host      \n                  +1 (314) 530-3306              \n      Know what to e\n      Make sure to review the House Rules and amenities.    \n        Go to House Rules      \n      Customer support    \n      Contact our support team 24/7 from anywhere in the world.    \n        Visit Help Center      \n        Contact Airbnb      \nConsidering travel insurance?            \nGet information on how to protect your trip.Learn more \nCheck for local travel advisories            \nMany places around the world are issuing new restrictions on lodging and travel each day. Before you travel, please check the latest from the local government in order to keep everyone safe and healthy.Learn more \nRefer a host, earn $15 cash                        \n                            Learn more                          \nRefer a host, earn $15 cash                        \n                            Learn more                          \n        Get a friend to start hosting on Airbnb and make e\n        \n          Sent with \n\n        "
# example = "\n\nFrom: Courtyard By Marriott Reservations <reservations@res-marriott.com>Sent: Friday, November 15, 2019 5:49 AMTo: yogbansal@hotmail.comSubject: Reservation Confirmation #71109099 for Courtyard Chicago Glenview/Northbrook\n\n\n\nENHANCE YOUR STAY\n|\nSUMMARY OF CHARGES\n|\nCONTACT US\n\n\nCourtyard Chicago Glenview/Northbrook\n\n1801 Milwaukee Avenue Glenview Illinois 60025 USA\n\n+1-847-803-2500\n\nThank you for booking directly with us, Yogesh Bansal.\n\nYou're ready to move forward.\n\nMon, Nov 18, 2019 \n\nConfirmation Number: 71109099\n\n\n\n\nCheck-In:\nMonday, November 18, 2019\n03:00 PM\n\nCheck-Out:\nWednesday, November 20, 2019\n12:00 PM\n\nNumber of rooms\n1 Room\n\nGuests per room\n1 Adult\n\nGuarantee Method\nCredit Card Guarantee, Visa\n\n\n\nTotal for Stay (all rooms)\n244.62 USD\n\nRoom 1\n\n\n\nRoom Type\n\nGuest room, 2 Queen\n\nGuaranteed Requests:\n\nNon-Smoking Room\n\n\nALL REQUESTS\n\n\nModify or Cancel Reservation\n\nEnhance your stay\n\n\nEarn a $250 Statement Credit\nGet the Marriott Bonvoy Boundless Credit Card and receive a $250 statement credit after first purchase.\nLearn More\n\n\nSave on base rates\nPlus earn up to 2,000 points.\nLearn More\n\n\nFind Things to Do\nView recommended activities and earn points\nBook Activities\n\n\nVacation Up To 70% OFF\n4 days, 3 nights at Marriott\nGet Offer\n\n\nClassic Cocktails & Food\nSip a cocktail. Share a meal. Join us for classics with a twist at the Bistro Bar.\nSee our Menu\n\n\nStream on a Big TV\nAccess Netfli\nLearn More\n\n\nWant anything, anytime?\nSend a request for services, amenities and more before, during and after your stay with the Marriott Bonvoy\nDownload our app\n\n\nWork & Play Hard.\nAt Courtyard you\n\n\n\nMy Account\nYogesh Bansal\nYour Stay: 2 Nights\nView Account\n\nXXXXX1272\nAccount\n127,514\nPoints\nTitanium Elite\nStatus\n\nEnjoy these Titanium Elite benefits* during your stay.\nLearn More\n\n\n75% Bonus on Base Points Earned\n\n\nElite Welcome Gift\n\n\nComplimentary Room Upgrade\n\n*Benefits vary by brand and hotel. Select benefits are subject to availability. Please see fullterms and conditions.\n\n\n\n\nSummary Of Charges\n\nMonday, November 18, 2019 \n\n\n\n2 Nights at 108.00 USD per night per room\n\nAllstate rate, 0.8 miles to office, includes breakfast, wireless internet, self parking, office transportation, 500 Bonus Points per stay, see Rate details\n\n\nTa\n\n\n\nEstimated Government Ta\n14.31 USD\n\nTotals\n\n\n\nTotal for Stay (all rooms)\n244.62 USD\n\nOther Charges\n\nComplimentary on-site parking\n\nRate Details & Cancellation Policy\n\nYou may cancel your reservation for no charge until 06:00 PM hotel time on Monday, November 18, 2019.Please note we will assess a fee if you must cancel after this deadline.\n\n\nPlease note that we will assess a fee of 122.31 USD if you must cancel after this deadline.\n\n\nPlease be prepared to show proof of eligibility for your rate (such as a membership card, corporate or government identification card, or proof of your age).\n\n\nPlease note that a change in the length or dates of your reservation may result in a rate change.\n\nRate Guarantee Limitation(s)\n\n\nChanges in ta\n\nAdditional Information\n\n\nUpon check-in an authorization request will be placed on your credit/debit card in an amount equal to the cost of the room, ta\n\nEnjoy instant benefits because you booked directly with us\n\nMember Rates\n\nFree Wi-Fi\n\nMobile Check-In\nLearn More\n\n\nContact Us\nPhone Numbers\n\nCall 1-800-321-2211 in the US and Canada\n\nFor everywhere else, call our Worldwide Telephone Numbers\n\nFREQUENTLY ASKED QUESTIONS\n\n\n\n\n\n\nTerms of Use\n\nPrivacy Policy\n\nAbout Us\n\nFind a Hotel\nContact Us\nThis email confirmation is an auto-generated message. Replies to automated messages are not monitored. OurInternet Customer Care team is available to assist you 24 hours per day, 7 days per week.\n\nConfirmation Authenticity\nWe're sending you this confirmation notice electronically for your convenience. Marriott keeps an official record of all electronic reservations. We honor our official record only and will disregard any alterations to this confirmation that may have been made after we sent it to you.\n\nEmail Unsubscribe\nYou may opt out of promotional emails at any timehere. Each email also includes a link to unsubscribe. Please note: should you unsubscribe, you will continue to receive emails such as reservation confirmations, hotel stay receipts and changes to program terms and conditions.\n\n\n"
# example = "b'\n---------- Forwarded message ---------\nFrom:\nDelta Air Lines\nDeltaAirLines@t.delta.com\nDate: Tue, Jan 12, 2021 at 1:21 PM\nSubject: Your SFO > IND Trip Details\nTo:  <\nWILLKAO21@gmail.com\nEverything you need to know for your upcoming flight.\nView as a Web Page\n\\t\\t\\t\n\\t\\t\\t\n\\t\\t\\t\\t\n\\t\\t\\t\\t\\tDEPARTURE\n\\t\\t\\t\n\\t\\t\\t\\t\n\\t\\t\\t\\t\\tSFO\n\\t\\t\\t\n\\t\\t\\t\\t\n\\t\\t\\t\\t\\t6:30 AM\n\\t\\t\\t\n\\t\\t\\t\n\\t\\t\\t\n\\t\\t\\t\n\\t\\t\\t\n\\t\\t\\t\\t\n\\t\\t\\t\\t\\t\nMSP\n12:55 PM\n\\t\\t\\t\n\\t\\t\\t\n\\t\\t\\t\n\\t\\t\\t\n\\t\\t\\t\n\\t\\t\\t\\t\n\\t\\t\\t\\t\\tDESTINATION\n\\t\\t\\t\n\\t\\t\\t\\t\n\\t\\t\\t\\t\\tIND\n\\t\\t\\t\n\\t\\t\\t\\t\n\\t\\t\\t\\t\\t 3:40 PM\n\\t\nCONFIRMATION #: GRW98F\nWe've Got You Covered\nAs always, your safety is our top priority. That\nDelta CareStandard\nfocuses on keeping surfaces clean, giving you more space, and offering safer service and personal care at every point in your journey.\nStay In Control Of Your Travel Plans\nWe\ndelta.com\nand the Fly Delta app. You can cancel or modify your itinerary via\nMyTrips\nprior to departure without any change fees. This helps ensure those traveling can be seated further apart while also meeting weight and balance guidelines. You can also check the seat map on\nMyTrips\nprior to departure to see if seats adjacent to yours are occupied or available for sale.\nGovernment-Issued COVID-19 Travel Requirements\nSeveral countries/states have issued travel mandates that may affect your trip. We strongly encourage all customers to review the\nCOVID-19 Travel Requirements\nbefore arriving at the airport. You may check your eligibility to change or cancel your flight\nhere\nMasks Required For Everyone\nPer CDC recommendations, all employees and customers are required to wear masks or face coverings throughout the travel journey. Customers requiring medical-based e\nLearn\nModifications To The Delta Sky Club\nE\nWhile the majority of our Delta Sky Club network remains open, we are temporarily consolidating Club operations and focusing on keeping your safety top of mind. To find an open Club or learn more about the e\nhere\nGet Ready To Go\nArrive On Time\nPlan to arrive at SFO at least 2 hours before your scheduled departure time.\nSee\nGet The Fly Delta App For A Touchless E\nAccess your digital boarding pass, flight status alerts, message Delta for help, track bags and more.\nDownload\nOne Or More Of Your Flights\nIs In Basic Economy\nYour seat is assigned after check-in. Checked bag fees and other restrictions apply.\nWhat\nTSA Security Tips\nReview\nTSA's Checklist\nbefore packing to see what you can bring. Passengers are allowed a 12oz bottle of liquid hand sanitizer, through U.S. checkpoints. International security allowances may vary.\nMore\nTravel With Ease\nGet Connected In The Air\nStay on top of it all with onboard Wi-Fi and Free Messaging.\nCalculate your Baggage Estimate\nUse the baggage calculator to get an estimate of the baggage allowance and fees for your upcoming trip. Visit the\nMy Trips\npage and select an upcoming trip.\nRide Rewarded With Lyft\nYou can earn miles with every ride in the US. Terms apply.\nGet\nBenefit information in this email is only applicable to the primary ticket holder.\nWe're Here To Help\nWheelchair\nAssistance\nBaby\nBoard\n\\t\n\\t\\t\nMore\nMore\nFly Delta App\nTravel less stressed with easy check in and access to airport\nJoin SkyMiles\nEarn miles that don\nDelta\nEarn miles faster with the Delta SkyMiles American E\nLet Us Know\nWe love hearing from you.\nHow helpful was this\n1\n2\n3\n4\n5\nNeed Help?\nFlight Deals\nEarn Miles\nGive Back\nEmail Preferences\nPrivacy Policy\n*Available on all wi-fi enabled flights.\nTerms\nGeneral: All SkyMiles program rules apply. To review the rules, please visit\nMembership Guide & Program Rules\n. Prices and rules are subject to change without notice. Delta, SkyMiles, and the Delta logo are registered service marks of Delta Air Lines, Inc. Delta is not responsible for goods or services offered by any companies participating in miles promotions. Partner offers subject to the terms and conditions of each individual offer. See individual offers for details. Partners subject to change. Offers void where prohibited by law. Other restrictions may apply.\nThis email was sent to:\nWILLKAO21@GMAIL.COM\nDelta Blvd. P.O. Bo\nAtlanta, GA 30320-6001\n---------- Forwarded message ---------From: Delta Air Lines\nDate: Tue, Jan 12, 2021 at 1:21 PMSubject: Your SFO > IND Trip DetailsTo:\nEverything you need to know for your upcoming flight.  View as a Web Page\n[image: DELTA]\nDEPARTURESFO6:30 AM Fri, Jan 15 DL931MSP 12:55 PM DL5114DESTINATIONIND3:40 PM Fri, Jan 15*CONFIRMATION #: GRW98F*We\\'ve Got You CoveredAs always, your safety is our top priority. That\nfocuses on keeping surfaces clean, giving you more space, and offeringsafer service and personal care at every point in your journey.Stay In Control Of Your Travel PlansWe\nprior to departure without any change fees. This helps ensure thosetraveling can be seated further apart while also meeting weight and balanceguidelines. You can also check the seat map on MyTrips\nprior to departure to see if seats adjacent to yours are occupied oravailable for sale.Government-Issued COVID-19 Travel RequirementsSeveral countries/states have issued travel mandates that may affect yourtrip. We strongly encourage all customers to review the COVID-19 TravelRequirements\nbefore arriving at the airport. You may check your eligibility to change orcancel your flight here\n.Masks Required For Everyone\nModifications To The Delta Sky Club\n.Get Ready To Go[image: Airplane icon]Arrive On TimePlan to arrive at SFO at least 2 hours before your scheduled departuretime.See Details\n[image: Mobile phone icon]Get The Fly Delta App For A Touchless E\n[image: Seated passenger icon]One Or More Of Your FlightsIs In Basic EconomyYour seat is assigned after check-in. Checked bag fees and otherrestrictions apply.What Else To E\n[image: Shield icon]TSA Security TipsReview TSA\\'s Checklist\nbefore packing to see what you can bring. Passengers are allowed a 12ozbottle of liquid hand sanitizer, through U.S. checkpoints. Internationalsecurity allowances may vary.More Tips\nTravel With Ease[image: 1]Get Connected In The AirStay on top of it all with onboard Wi-Fi and Free Messaging. See How\n[image: 2]Calculate your Baggage EstimateUse the baggage calculator to get an estimate of the baggage allowance andfees for your upcoming trip. Visit the My Trips\npage and select an upcoming trip.[image: 2]Ride Rewarded With LyftYou can earn miles with every ride in the US. Terms apply.Get Started\nBenefit information in this email is only applicable to the primary ticketholder.We\\'re Here To Help[image: Wheelchair icon]WheelchairAssistance\n[image: Baby icon]Baby OnBoard\n[image: Person with hand raised icon]More Help\nMore Help\n[image: SMARTER TRAVEL IS WAITING][image: Mobile phone icon]Fly Delta AppTravel less stressed with easy check in and access to airport maps\n[image: Baggage tag icon]Join SkyMiles\n[image: Credit card icons]Delta SkyMiles Ame\nLet Us KnowWe love hearing from you.How helpful was this message?[image: star icon]\n[image: star icon]\n[image: star icon]\n[image: star icon]\n[image: star icon]\n1 2 3 4 5[image: DELTA logo]Need Help?\n[image: Facebook logo]\n[image:Twitter logo]\n[image:Instagram logo]\nEmail Preferences\n|  Privacy Policy\n*Available on all wi-fi enabled flights. Terms apply\n.General: All SkyMiles program rules apply. To review the rules, pleasevisit Membership Guide & Program Rules\n.Prices and rules are subject to change without notice. Delta, SkyMiles, andthe Delta logo are registered service marks of Delta Air Lines, Inc. Deltais not responsible for goods or services offered by any companiesparticipating in miles promotions. Partner offers subject to the terms andconditions of each individual offer. See individual offers for details.Partners subject to change. Offers void where prohibited by law. Otherrestrictions may apply.This email was sent to: WILLKAO21@GMAIL.COM"
# example = 'MO 63101'
# Extractor().extract_address()
Extractor()
print('done')

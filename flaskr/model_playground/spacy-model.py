import spacy

nlp = spacy.load("en_core_web_sm")
example = "          Your reservation is confirmed        \n          You\n          Modern 2BR Apartment with Laundry        \n          Entire home/apt hosted by Frontdesk        \n        Friday,      \n\n\n        Sunday,      \n\n\n          View full itinerary        \n      Address    \n      917 Locust St, St. Louis, MO 63101, USA    \n        Get directions      \n      Guests    \n      4    \n        Invite guests      \n      Cancellation policy    \n      Cancel before 3:00 PM on Oct 7 and get a full refund. After that, cancel before 3:00 PM on Oct 8 and get a full refund, minus the first night and service fee.    \n      Cutoff times are based on the listing\n        More details      \n      Payments    \n                Payment 1 of 1              \n                $573.99              \n                Oct 07, 2021 \n                VISA \n                Amount paid (USD)              \n                $573.99              \n      Reservation code    \n      HMYWPPWRFD    \n          Change reservation        \n        House rules      \n            Check-in: After 3:00 PM          \n            Checkout: 11:00 AM          \n            Self check-in with lockbo\n          Show all        \n        Safety & Property Info      \n            Security camera/recording device          \n            Carbon mono\n            Smoke alarm          \n          Show all        \n      Frontdesk is your host    \n      Contact Frontdesk to coordinate arrival time and key e\n        Message host      \n                  +1 (314) 530-3306              \n      Know what to e\n      Make sure to review the House Rules and amenities.    \n        Go to House Rules      \n      Customer support    \n      Contact our support team 24/7 from anywhere in the world.    \n        Visit Help Center      \n        Contact Airbnb      \nConsidering travel insurance?            \nGet information on how to protect your trip.Learn more \nCheck for local travel advisories            \nMany places around the world are issuing new restrictions on lodging and travel each day. Before you travel, please check the latest from the local government in order to keep everyone safe and healthy.Learn more \nRefer a host, earn $15 cash                        \n                            Learn more                          \nRefer a host, earn $15 cash                        \n                            Learn more                          \n        Get a friend to start hosting on Airbnb and make e\n        \n          Sent with \n\n        "

example_arr = []
for line in example.split('\n'):
    example_arr.append(line.strip())

example = "\n".join(example_arr)

doc = nlp(example)

for ent in doc.ents:
    print(ent.text, ent.start_char, ent.end_char, ent.label_)

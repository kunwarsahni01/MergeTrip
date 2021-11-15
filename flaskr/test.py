import nltk
from pprint import pprint
import spacy
from spacy import displacy
from collections import Counter
import en_core_web_sm

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

text = """Your reservation is confirmed        
          You
          Modern 2BR Apartment with Laundry
          Entire home/apt hosted by Frontdesk
        Friday,


        Sunday,


          View full itinerary
      Address
      917 Locust St, St. Louis, MO 63101, USA
        Get directions
      Guests
      4
        Invite guests
      Cancellation policy
      Cancel before 3:00 PM on Oct 7 and get a full refund. After that, cancel before 3:00 PM on Oct 8 and get a full 
refund, minus the first night and service fee.
      Cutoff times are based on the listing
        More details
      Payments
                Payment 1 of 1
                $573.99
                Oct 07, 2021
                VISA
                Amount paid (USD)
                $573.99
      Reservation code
      HMYWPPWRFD
          Change reservation
        House rules
            Check-in: After 3:00 PM
            Checkout: 11:00 AM
            Self check-in with lockbo
          Show all
        Safety & Property Info
            Security camera/recording device
            Carbon mono
            Smoke alarm
          Show all
      Frontdesk is your host
      Contact Frontdesk to coordinate arrival time and key e
        Message host
                  +1 (314) 530-3306
      Know what to e
      Make sure to review the House Rules and amenities.
        Go to House Rules
      Customer support
      Contact our support team 24/7 from anywhere in the world.
        Visit Help Center
        Contact Airbnb
Considering travel insurance?
Get information on how to protect your trip.Learn more
Check for local travel advisories
Many places around the world are issuing new restrictions on lodging and travel each day. Before you travel, please check the latest from the local government in order to keep everyone safe and healthy.Learn more
Refer a host, earn $15 cash
                            Learn more
Refer a host, earn $15 cash
                            Learn more
        Get a friend to start hosting on Airbnb and make e

          Sent with"""

def preprocess_email(text):
    text = nltk.word_tokenize(text)
    text = nltk.pos_tag(text)

    return text

sent = preprocess_email(text)

pattern = 'NP: {<DT>?<JJ>*<NN>}'
cp = nltk.RegexpParser(pattern)
cs = cp.parse(sent)
#pprint(cs)
#cs.draw()

iot_tags = nltk.tree2conlltags(cs)
#pprint(iot_tags)

# using spacy to extract and classify data from text
nlp = en_core_web_sm.load()
doc = nlp(text)
pprint([(X.text, X.label_) for X in doc.ents])

# Using BILUO tagging
# spaces and other clutter is included
pprint([(X, X.ent_iob_, X.ent_type_) for X in doc])
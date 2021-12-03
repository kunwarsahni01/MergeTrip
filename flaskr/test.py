import re
import spacy
from spacy import displacy
from spacy.matcher import Matcher
from spacy.tokenizer import Tokenizer
from collections import Counter
from pprint import pprint
import en_core_web_sm
import nltk
from pprint import pprint
from pathlib import Path

from transformers import AutoTokenizer, AutoModelForTokenClassification
from transformers import pipeline

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

path = "C:\\Users\\yashy\\Documents\\MergeTrip\\flaskr\\marriott.txt"
text = "b'\nView as a Web Page\n\\t\\t\\t\n\\t\\t\\t\n\\t\\t\\t\\t\n\\t\\t\\t\\t\\tDEPARTURE\n\\t\\t\\t\n\\t\\t\\t\\t\n\\t\\t\\t\\t\\tSFO\n\\t\\t\\t\n\\t\\t\\t\\t\n\\t\\t\\t\\t\\t6:30 AM\n\\t\\t\\t\n\\t\\t\\t\n\\t\\t\\t\n\\t\\t\\t\n\\t\\t\\t\n\\t\\t\\t\\t\n\\t\\t\\t\\t\\t\nMSP\n12:55 PM\n\\t\\t\\t\n\\t\\t\\t\n\\t\\t\\t\n\\t\\t\\t\n\\t\\t\\t\n\\t\\t\\t\\t\n\\t\\t\\t\\t\\tDESTINATION\n\\t\\t\\t\n\\t\\t\\t\\t\n\\t\\t\\t\\t\\tIND\n\\t\\t\\t\n\\t\\t\\t\\t\n\\t\\t\\t\\t\\t 3:40 PM\n\\t\nCONFIRMATION #: GRW98F\nWe've Got You Covered\nAs always, your safety is our top priority. That\nDelta CareStandard\nfocuses on keeping surfaces clean, giving you more space, and offering safer service and personal care at every point in your journey.\nStay In Control Of Your Travel Plans\nWe\ndelta.com\nand the Fly Delta app. You can cancel or modify your itinerary via\nMyTrips\nprior to departure without any change fees. This helps ensure those traveling can be seated further apart while also meeting weight and balance guidelines. You can also check the seat map on\nMyTrips\nprior to departure to see if seats adjacent to yours are occupied or available for sale.\nGovernment-Issued COVID-19 Travel Requirements\nSeveral countries/states have issued travel mandates that may affect your trip. We strongly encourage all customers to review the\nCOVID-19 Travel Requirements\nbefore arriving at the airport. You may check your eligibility to change or cancel your flight\nhere\nMasks Required For Everyone\nPer CDC recommendations, all employees and customers are required to wear masks or face coverings throughout the travel journey. Customers requiring medical-based e\nLearn\nModifications To The Delta Sky Club\nE\nWhile the majority of our Delta Sky Club network remains open, we are temporarily consolidating Club operations and focusing on keeping your safety top of mind. To find an open Club or learn more about the e\nhere\nGet Ready To Go\nArrive On Time\nPlan to arrive at SFO at least 2 hours before your scheduled departure time.\nSee\nGet The Fly Delta App For A Touchless E\nAccess your digital boarding pass, flight status alerts, message Delta for help, track bags and more.\nDownload\nOne Or More Of Your Flights\nIs In Basic Economy\nYour seat is assigned after check-in. Checked bag fees and other restrictions apply.\nWhat\nTSA Security Tips\nReview\nTSA's Checklist\nbefore packing to see what you can bring. Passengers are allowed a 12oz bottle of liquid hand sanitizer, through U.S. checkpoints. International security allowances may vary.\nMore\nTravel With Ease\nGet Connected In The Air\nStay on top of it all with onboard Wi-Fi and Free Messaging.\nCalculate your Baggage Estimate\nUse the baggage calculator to get an estimate of the baggage allowance and fees for your upcoming trip. Visit the\nMy Trips\npage and select an upcoming trip.\nRide Rewarded With Lyft\nYou can earn miles with every ride in the US. Terms apply.\nGet\nBenefit information in this email is only applicable to the primary ticket holder.\nWe're Here To Help\nWheelchair\nAssistance\nBaby\nBoard\n\\t\n\\t\\t\nMore\nMore\nFly Delta App\nTravel less stressed with easy check in and access to airport\nJoin SkyMiles\nEarn miles that don\nDelta\nEarn miles faster with the Delta SkyMiles American E\nLet Us Know\nWe love hearing from you.\nHow helpful was this\n1\n2\n3\n4\n5\nNeed Help?\nFlight Deals\nEarn Miles\nGive Back\nEmail Preferences\nPrivacy Policy\n*Available on all wi-fi enabled flights.\nTerms\nGeneral: All SkyMiles program rules apply. To review the rules, please visit\nMembership Guide & Program Rules\n. Prices and rules are subject to change without notice. Delta, SkyMiles, and the Delta logo are registered service marks of Delta Air Lines, Inc. Delta is not responsible for goods or services offered by any companies participating in miles promotions. Partner offers subject to the terms and conditions of each individual offer. See individual offers for details. Partners subject to change. Offers void where prohibited by law. Other restrictions may apply.\nThis email was sent to:\nWILLKAO21@GMAIL.COM\nDelta Blvd. P.O. Bo\nAtlanta, GA 30320-6001"
text = text.replace("\n","")
text = text.replace("\t","")
print(text)
          
tokenizer = AutoTokenizer.from_pretrained("dslim/bert-large-NER")
model = AutoModelForTokenClassification.from_pretrained(
            "dslim/bert-large-NER")

# nlp = pipeline("ner", model=model, tokenizer=tokenizer,
#                             aggregation_strategy="average")

# using spacy to extract and classify data from text
confirmation_code = r'[A-Z0-9]+'
matches = re.findall(text, confirmation_code)
print(matches)

nlp = en_core_web_sm.load()
doc = nlp(text)
pprint([(X.text, X.label_) for X in doc.ents]) 	

matches = []
for i in doc.ents:
  if i.label_ == 'DATE' and i.text not in matches:
    matches.append(i.text)
    print(i.text)

# filters for date parsing, works in format Month(3 char) day or DOTW, Month Day
regex_date_filter_1 = "[A-Z][a-z]+, [A-Z][a-z]+ [1-9]|[12][0-9]|3[01]"
regex_date_filter_2 = "[A-Z][a-z][a-z] [1-9]|[12][0-9]|3[01]"

dates = []
for match in matches:
    if re.match(regex_date_filter_1, match) != None or re.match(regex_date_filter_2, match) != None:
        dates.append(match)

print(dates)

if not dates:
    print("N/A")
else:
    longestDate = max(dates, key=len)
    print(longestDate)

# for the token pattern 1st, 22nd, 15th etc
#IS_REGEX_MATCH = add_regex_flag(nlp.vocab, '\d{1,2}(?:[stndrh]){2}?')

# MM/DD/YYYY and YYYY/MM/DD
#pattern_1 = [{'IS_DIGIT': True}, {'ORTH': '/'}, {'IS_DIGIT': True}, {'ORTH': '/'}, {'IS_DIGIT': True}]
# MM-DD-YYYY and YYYY-MM-DD
#pattern_2 = [{'IS_DIGIT': True}, {'ORTH': '-'}, {'IS_DIGIT': True}, {'ORTH': '-'}, {'IS_DIGIT': True}]
# dates of the form 10-Aug-2018
#pattern_3 = [{'IS_DIGIT': True}, {'ORTH': '-'}, {'IS_ALPHA': True}, {'ORTH': '-'}, {'IS_DIGIT': True}]
# dates of the form Aug-10-2018
#pattern_4 = [{'IS_ALPHA': True}, {'ORTH': '-'}, {'IS_DIGIT': True}, {'ORTH': '-'}, {'IS_DIGIT': True}]
# dates of the form 10th August, 2018
#pattern_5 = [{IS_REGEX_MATCH: True}, {'IS_ALPHA': True}, {'ORTH': ',', 'OP': '?'}, {'IS_DIGIT': True}]
# dates of the form August 10th, 2018
#pattern_6 = [{'IS_ALPHA': True}, {IS_REGEX_MATCH: True}, {'ORTH': ',', 'OP': '?'}, {'IS_DIGIT': True}]
#matcher = Matcher(nlp.vocab)
#patterns = [pattern_1, pattern_2, pattern_3, pattern_4]
#matcher.add("Date patterns", patterns)

#doc = nlp('Today is 06/11/2018 yesterday was 10-Jun-2018 and tomorrow is 06-12-2018 and I will go home on 7-Jul-2018 but clearly not on 39/02/2011 and some dates are of the form 12th February,2017')
#matches = matcher(doc)


#for match in matches:
  #print(match)  
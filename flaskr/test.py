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
text = "b'\nSave on hotel and car bookings, too.\nIssued:\nOctober 15, 2021\nYour trip confirmation and receipt\nRecord Locator:\nJAPJFI\nWe charged $171.20\nto your card ending in 1910\nfor your ticket purchase.\nA face covering is required while flying on American, e\nRead more about travel requirements\nYou'll need your record locator to find your trip at the kiosk and when you call Reservations.\nManage your trip\nFriday, January 7, 2022\nSJC\nORD\n7:00\nAM\n1:25\nPM\nSan Jose\nChicago O'Hare\nAA 1096\nSeat:\n23A\nClass:\nEconomy\n(Q)\nMeals:\nFriday, January 7, 2022\nORD\nIND\n3:02\nPM\n5:11\nPM\nChicago O'Hare\nIndianapolis\nAA 3235\nOperated by Skywest Airlines\nas American Eagle\nSeat:\n14B\nClass:\nEconomy\n(Q)\nMeals:\nYour payment\nCredit Card\nVisa\nending 1910\n$171.20\nTotal paid\n$171.20\nYour purchase\nWILLIAM\nKAO\nJoin the AAdvantage\nProgram\nNew ticket\n$171.20\nTicket #:\n0012305528992\n$137.67\n+ Ta\nTotal\n$171.20\nTotal cost\n(all passengers)\n$171.20\nBag information\nChecked bags\nOnline*\n1\nst\nbag\n2\nnd\nbag\n$30.00\n$40.00\nAirport\n1\nst\nbag\n2\nnd\nbag\n$30.00\n$40.00\nMa\n62\ninches or\n158\ncentimeters\ncalculated as (length + width + height)\nMa\n50\npounds or\n23\nkilograms\nBag fees apply at each Check-in location. Additional allowances and/or discounts may apply.\nBag and optional fees\nIf your flight is operated by a partner airline, see the\nother airline\nwebsite for carry-on and checked bag policies.\n*Online payment available beginning 24 hours (and up to 4 hours) before departure.\nCarry-on bags\n1\nst\ncarry-on:\nIncludes purse, briefcase, laptop bag, or similar item that must fit under the seat in front of you.\n2\nnd\ncarry-on:\nMa\nBook a hotel\nBook a car\nBuy trip insurance\nThings to do\nContact us\nPrivacy policy\nGet the American Airlines app\nAdditional Services are subject to credit card approval at time of ticketing. Additional Services may appear on multiple accompanied documents as a matter of reference.\nIf you have purchased a NON-REFUNDABLE fare, the itinerary must be canceled before the ticketed departure time of the first unused coupon or the ticket has NO VALUE. If the fare allows changes, a fee may be assessed for changes and restrictions may apply.\nYou have up to 24 hours from the time of ticket purchase to receive a full refund if you booked at least 2 days before departure. You must\nlog in\non\naa.com\nor\nContact Reservations\nto cancel. Once cancelled, your refund will be processed automatically.\nRefunds\nSome American Airlines check-in counters do not accept cash as a form of payment. For more information, visit our\nAirport Information\npage.\nThe policy for traveling with Emotional Support and Service animals has changed. Visit\nTraveling with Service Animals\nfor more information.\nSome everyday products, like e-cigarettes and aerosol spray starch, can be dangerous when transported on the aircraft in carry-on and/or checked baggage.  Changes in temperature or pressure can cause some items to leak, generate to\nSome Lithium batteries (e.g. spares in checked baggage, batteries over a certain size), E\nThere are special e\nCertain items are required to be carried with you onboard the aircraft. For e\nTraveling with medical o\nTo change your reservation, please call 1-800-433-7300 and refer to your record locator.\nNOTICE OF INCORPORATED TERMS OF CONTRACT\nAir Transportation, whether it is domestic or international (including domestic portions of international journeys), is subject to the individual terms of the transporting air carriers, which are herein incorporated by reference and made part of the contract of carriage.  Other carriers on which you may be ticketed may have different conditions of carriage.  International air transportation, including the carrier's liability, may also be governed by applicable tariffs on file with the U.S. and other governments and by the Warsaw Convention, as amended, or by the Montreal Convention.  Incorporated terms may include, but are not restricted to: 1. Rules and limits on liability for personal injury or death, 2. Rules and limits on liability for baggage, including fragile or perishable goods, and availability of e\nYou can obtain additional information on items 1 through 6 above at any U.S. location where the transporting air carrier's tickets are sold.  You have the right to inspect the full te\nAir transportation on American Airlines and the American Eagle carriers\nconditions of carriage.\nFor more on Canada passenger protection regulations visit\naa.com/CanadaPassengers.\nPlease do not reply to this email address as it is not monitored.\nNOTICE: This email and any information, files or attachments are for the e\nprivacy@aa.com\nwith an e\none\nworld is a registered trademark of\none\nworld Alliance, LLC.\nSave on hotel and car bookings, too.\nIssued: October 15, 2021Your trip confirmation and receiptRecord Locator: JAPJFIWe charged $171.20 to your card ending in 1910 for your ticket purchase.A face covering is required while flying on American, e\n.You\\'ll need your record locator to find your trip at the kiosk and when youcall Reservations.Manage your trip\nFriday, January 7, 2022SJC       ORD7:00 AM     1:25 PMSan Jose       Chicago O\\'HareAA 1096Seat:23AClass: Economy (Q)Meals:Friday, January 7, 2022ORD       IND3:02 PM     5:11 PMChicago O\\'Hare       IndianapolisAA 3235Operated by Skywest Airlines as American EagleSeat:14BClass: Economy (Q)Meals:Your paymentCredit Card (Visa ending 1910) $171.20Total paid $171.20Your purchaseWILLIAM KAOJoin the AAdvantage\nNew ticket $171.20Ticket #: 0012305528992[$137.67 + Ta\nIf your flight is operated by a partner airline, see the other airline\nwebsite for carry-on and checked bag policies.*Online payment available beginning 24 hours (and up to 4 hours) beforedeparture.Carry-on bags*1st carry-on:* Includes purse, briefcase, laptop bag, or similar item thatmust fit under the seat in front of you.*2nd carry-on:* Ma\nBooka car\nBuy trip insurance\nThingsto do\nContact us\n|      Privacy policy\nGet the American Airlines app\nAdditional Services are subject to credit card approval at time ofticketing. Additional Services may appear on multiple accompanied documentsas a matter of reference.If you have purchased a NON-REFUNDABLE fare, the itinerary must be canceledbefore the ticketed departure time of the first unused coupon or the tickethas NO VALUE. If the fare allows changes, a fee may be assessed for changesand restrictions may apply.You have up to 24 hours from the time of ticket purchase to receive a fullrefund if you booked at least 2 days before departure. You must log in\non aa.com or ContactReservations\nto cancel. Once cancelled, your refund will be processed automatically.Refunds\n.Some American Airlines check-in counters do not accept cash as a form ofpayment. For more information, visit our Airport Information\npage.The policy for traveling with Emotional Support and Service animals haschanged. Visit Traveling with Service Animals\nfor more information.Some everyday products, like e-cigarettes and aerosol spray starch, can bedangerous when transported on the aircraft in carry-on and/or checkedbaggage. Changes in temperature or pressure can cause some items to leak,generate to\nFor more on Canada passenger protection regulations visitaa.com/CanadaPassengers.\nPlease do not reply to this email address as it is not monitored.NOTICE: This email and any information, files or attachments are for thee"
text = text.replace("\n","")
text = text.replace("\t","")
print(text)
          
tokenizer = AutoTokenizer.from_pretrained("dslim/bert-large-NER")
model = AutoModelForTokenClassification.from_pretrained(
            "dslim/bert-large-NER")

# nlp = pipeline("ner", model=model, tokenizer=tokenizer,
#                             aggregation_strategy="average")

# using spacy to extract and classify data from text
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
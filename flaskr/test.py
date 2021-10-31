
import re
import dateparser
import spacy
from spacy import displacy
from spacy.matcher import Matcher
from spacy.tokenizer import Tokenizer
from collections import Counter
from pprint import pprint
import en_core_web_sm

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

def custom_tokenizer(nlp, infix_reg):
	"""
	Function to return a customized tokenizer based on the infix regex
	PARAMETERS
	----------
	nlp : Language
	A Spacy language object with loaded model
	infix_reg : relgular expression object
	The infix regular expression object based on which the tokenization is to be 
	carried out.
	RETURNS
	-------
	Tokenizer : Tokenizer object
	The Spacy tokenizer obtained based on the infix regex.
	"""
	return Tokenizer(nlp.vocab, infix_finditer = infix_reg.finditer)


def is_valid_date(matcher, doc, i, matches):
	"""
	on match function to validate whether a matched instance is an actual date or not
	PARAMETERS
	----------
	matcher : Matcher
	The Matcher instance
	doc : Doc
	The document the matcher was used on 
	i : int
	Index of the current match
	matches : list
	A list of (match_ic, start, end) tuples, describing the matches. A matched
	tuple describe the span doc[start:end]
	RETURNS:
	-------
	The function doesn't return a value, it just prints whether the found date instance is valid 
	if it's a valid date.
	"""
	match_id, start, end = matches[i]
	if dateparser.parse(doc[start:end].text):
		print (doc[start:end].text, 'valid')

def add_regex_flag(vocab, pattern_str):
	"""
	Function to create a custom regex based flag for token pattern matching
	Parameters
	----------
	vocab : Vocab
	The nlp model's vocabulary, which is simply a lookup to access Lexeme objects as well as
	StringStore
	pattern_str : String
	The string regular expression pattern we want to create the flag for
	RETURNS
	-------
	flag_id : int
	The integer ID by which the flag value can be checked.
	"""
	flag_id = vocab.add_flag(re.compile(pattern_str).match)
	return flag_id

  #Regex testing for items not picked up by Spacy

# AirBNB testing (regex)
def reservation_code_airbnb_regex(text):
    pattern = r'[A-Z][A-Z][A-Z][A-Z][A-Z][A-Z][A-Z][A-Z][A-Z][A-Z]'
    check = re.search(pattern, text)
    code = re.findall(pattern, text)

    for i in code:
        print(i)

    if check:
        return ("found a match")
    else:
        return ("none found")

# 8 digit confirmation codes for hotels
def confirmation_code_regex(text):
    pattern = r'[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
    check = re.search(pattern, text)
    code = re.findall(pattern, text)

    for i in code:
        print(i)

    if check:
        return ("found a match")
    else:
        return ("none found")


def time_regex(text):
    pattern = r'((0?[1-9]|1[0-2]):([0-5][0-9]) ?([AaPp][Mm]))'
    check = re.search(pattern, text)
    time = re.findall(pattern, text)

    for i in time:
        print(i)

    if check:
        return ("found a match")
    else:
        return ("none found")

def date_regex_no_char(text):
    pattern = r'(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d'
    check = re.search(pattern, text)
    date = re.findall(pattern, text)

    for i in date:
        print(i)

    if check:
        return ("found a match")
    else:
        return ("none found")

def date_regex_char(text):
    pattern = r'(January|February|March|April|May|June?|July|August|September|October|November|December)\s(\d\d?).+?(\d\d\d\d)'
    check = re.search(pattern, text)
    date = re.findall(pattern, text)

    for i in date:
        print(i)

    if check:
        return ("found a match")
    else:
        return ("none found")

if __name__ == '__main__':
  infix_re = re.compile(r'''[-/,]''')
  nlp = en_core_web_sm.load()
  nlp.tokenizer = custom_tokenizer(nlp, infix_re)

  DATE = nlp.vocab.strings['DATE']
 	
   	# for the token pattern 1st, 22nd, 15th etc
  IS_REGEX_MATCH = add_regex_flag(nlp.vocab, '\d{1,2}(?:[stndrh]){2}?')

  # MM/DD/YYYY and YYYY/MM/DD
  pattern_1 = [{'IS_DIGIT': True}, {'ORTH': '/'}, {'IS_DIGIT': True}, {'ORTH': '/'}, {'IS_DIGIT': True}]
  # MM-DD-YYYY and YYYY-MM-DD
  pattern_2 = [{'IS_DIGIT': True}, {'ORTH': '-'}, {'IS_DIGIT': True}, {'ORTH': '-'}, {'IS_DIGIT': True}]
  # dates of the form 10-Aug-2018
  pattern_3 = [{'IS_DIGIT': True}, {'ORTH': '-'}, {'IS_ALPHA': True}, {'ORTH': '-'}, {'IS_DIGIT': True}]
  # dates of the form Aug-10-2018
  pattern_4 = [{'IS_ALPHA': True}, {'ORTH': '-'}, {'IS_DIGIT': True}, {'ORTH': '-'}, {'IS_DIGIT': True}]
  # dates of the form 10th August, 2018
  pattern_5 = [{IS_REGEX_MATCH: True}, {'IS_ALPHA': True}, {'ORTH': ',', 'OP': '?'}, {'IS_DIGIT': True}]
  # dates of the form August 10th, 2018
  pattern_6 = [{'IS_ALPHA': True}, {IS_REGEX_MATCH: True}, {'ORTH': ',', 'OP': '?'}, {'IS_DIGIT': True}]
	
  matcher = Matcher(nlp.vocab)
  patterns = [pattern_1, pattern_2, pattern_3, pattern_4, pattern_5, pattern_6]
  matcher.add("Date patterns", patterns)
  
  doc = nlp('Today is 06/11/2018 yesterday was 10-Jun-2018 and tomorrow is 06-12-2018 and I will go home on 7-Jul-2018 but clearly not on 39/02/2011 and some dates are of the form 12th February,2017')
  matches = matcher(doc)
  for match in matches:
    print(match)
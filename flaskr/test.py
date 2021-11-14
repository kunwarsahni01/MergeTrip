import re
import dateparser
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

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

path = "C:\\Users\\yashy\\Documents\\MergeTrip\\flaskr\\marriott.txt"
text = Path(path).read_text()
text = text.replace("\n","")
text = text.replace("\t","")
print(text)
          
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
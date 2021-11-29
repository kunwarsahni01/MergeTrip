import en_core_web_sm
import spacy
import re
from transformers import AutoTokenizer, AutoModelForTokenClassification
from transformers import pipeline
from models.NonFlight import NonFlight
from models.Flight import Flight
from typing import Union

import transformers


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
            date = self.extract_date(spacy_results=spacy_results)
            return Flight(organization=org, location=address, date=date).toJSON()
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

        if not dates:
            return "N/A"
        else:
            longestDate = max(dates, key=len)
            return longestDate

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

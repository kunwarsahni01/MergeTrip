import os
import json
import base64
import re
from datetime import datetime
from flask import Flask, jsonify, request
from google.oauth2.reauth import refresh_grant
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from firebase_admin import credentials, firestore, initialize_app, auth

app = Flask(__name__)

client_secrets = json.load(open('flaskr/client_creds.json'))['installed']

cred = credentials.Certificate('flaskr/creds.json')

default_app = initialize_app(cred)
db = firestore.client()


@app.route("/")
def home():
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
    return date_regex_char(text)

@app.route("/itinerary")
def show_itinerary():
    return "This is your main itinerary."

@app.route("/gmails", methods=['GET', 'POST'])
def get_gmails():
    """
      get_gmails(): Will get access to user's gmail using refresh token in database
      and then return filtered gmail bodies from a specific date range

      Returns:

    """
    SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

    client_id = client_secrets['client_id']
    client_secret = client_secrets['client_secret']
    token_uri = client_secrets['token_uri']

    # get refresh token for the user from database here
    refresh_token = '1//04vktcBX3eskHCgYIARAAGAQSNwF-L9IrpK2j6zche9TU_eCjS5Y6dqbtEaTU8z7AEfH0PrWkdQ6arIcyMmEEK0vmuIc_e1Chczg'

    creds = Credentials(token=None, refresh_token=refresh_token, token_uri=token_uri,
                        client_id=client_id, client_secret=client_secret, scopes=SCOPES)

    # generates access token from refresh token
    creds.refresh(Request())

    service = build('gmail', 'v1', credentials=creds)

    # uses time since epoch
    test_start_date = int(datetime(2021, 9, 29).timestamp())
    test_end_date = int(datetime(2021, 10, 2).timestamp())
    date_query = "after:{0} before:{1}".format(test_start_date, test_end_date)

    # Get email Ids and ThreadIds
    results = service.users().messages().list(
        userId='me', q=date_query).execute()

    message_ids = results.get('messages', [])

    messages = []
    for ids in message_ids:
        message_response = service.users().messages().get(
            userId='me', id=ids['id']).execute()

        message = {}
        # extract From, To and Subject from response
        response_payload = message_response['payload']
        for header in response_payload['headers']:
            if (header['name'] == 'To'):
                message['To'] = header['value']
            elif (header['name'] == 'From'):
                message['From'] = header['value']
            elif (header['name'] == 'Subject'):
                message['Subject'] = header['value']

        # Decode raw abase64url encoded email body
        raw_body_bytes = ''
        if (response_payload['body'].get('data')):
            raw_body_bytes += response_payload['body']['data']
        else:
            for part in response_payload['parts']:
                if (part['body'].get('data')):
                    raw_body_bytes = part['body']['data'] + raw_body_bytes

        raw_body_bytes = bytes(str(raw_body_bytes), 'utf-8')
        decoded_body = base64.urlsafe_b64decode(raw_body_bytes)
        message['body'] = str(decoded_body)

        # TODO: EXTRACT TEXT FROM HTML BODY
        # TODO: Refactor is crap code ;-;

        messages.append(message)

    return jsonify({'results': messages}), 200


def check_valid_username(username):
    """
    userList = firestore.getUserList
    for (user in userList) {
        name = user.name
        if (name == username) {
            # Print an error message User already in system
            return -1
        }
    }
    """
    return 0

def hotel_or_flight(text):
    if "hotel" in text:
        return "hotel"
    elif "flight" in text:
        return "flight"
    else:
        return None

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
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)

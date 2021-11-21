import os
import json
import re
import time
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from google.oauth2.reauth import refresh_grant
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from firebase_admin import credentials, firestore, initialize_app, auth
from gmail_utils import get_clean_body, parse_message
from model_playground.bert_base_ner import Extractor

app = Flask(__name__)
CORS(app)

client_secrets = json.load(open('client_creds.json'))['installed']

cred = credentials.Certificate('creds.json')

default_app = initialize_app(cred)
db = firestore.client()

TRIPS = db.collection("trips")
USERS = db.collection("users")


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

    sent = preprocess_email(text)
    print(sent)
    # return a regex test to find a match
    return "success"


@app.route("/itinerary")
def show_itinerary():
    return "This is your main itinerary."


@app.route("/gmails/<userId>", methods=['GET', 'POST'])
def get_gmails(userId):
    """
      get_gmails(): Will get access to user's gmail using refresh token in database
      and then return filtered gmail bodies from a specific date range
      Returns:
    """
    SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

    client_id = client_secrets['client_id']
    client_secret = client_secrets['client_secret']
    token_uri = client_secrets['token_uri']

    # get access token for the user from database here
    access_token = USERS.document(userId).get().to_dict()['googleToken']
    creds = Credentials(token=access_token, token_uri=token_uri,
                        client_id=client_id, client_secret=client_secret, scopes=SCOPES)

    # generates access token from refresh token
    # creds.refresh(Request())

    service = build('gmail', 'v1', credentials=creds)

    # uses time since epoch
    test_start_date = int(datetime(2021, 11, 3).timestamp())
    test_end_date = int(datetime(2021, 11, 5).timestamp())
    date_query = "after:{0} before:{1}".format(test_start_date, test_end_date)

    # from_query = "from: {ibrahim.alassad001@gmail.com roymongyue@gmail.com yashyog2012@gmail.com willkao21@gmail.com}"
    from_query = "from: {ibrahim.alassad001@gmail.com}"

    gmails_query = date_query + " " + from_query
    # gmails_query = from_query

    # Get email Ids and ThreadIds
    results = service.users().messages().list(
        userId='me', q=gmails_query).execute()

    message_ids = results.get('messages', [])

    messages = []
    reservations = []
    extractor = Extractor()
    for ids in message_ids:
        message_response = service.users().messages().get(
            userId='me', id=ids['id']).execute()

        message = parse_message(message_response['payload'])

        res = extractor.extract(message['body'])

        message['address'] = res['address']
        message['organization'] = res['organization']
        messages.append(message)

        curr_res = {
            'res_name': message['From'],
            'res_location': message['address'],
            'res_time': 'NA'
        }

        reservations.append(curr_res)

    trip_doc = TRIPS.document(userId).collection('trips').document()

    for i in range(len(reservations)):
        reservations[i]['res_id'] = str(trip_doc.id) + "_" + str(i)

    trip_doc.set({
        'trip_id': trip_doc.id,
        'owner_id': userId,
        'trip_name': "Automatically Generated Trip",
        'start_date': 'NA',
        'end_date': 'NA',
        'reservations': reservations
    })

    return jsonify({'results': messages}), 200


@app.route('/trips/create', methods=['POST'])
def create_trip():
    """
      create_trip(): Creates a trip with the specified name and date range
      with empty reservations for the user.
      Returns:
    """
    try:
        data = request.json['data']
        trip_name = data['trip_name']
        start_date = data['start_date']
        end_date = data['end_date']
        uid = data['user_id']
        # CHECK If user has permission to add trip to that user (owner_id)
        # id_token = request.headers['Authorization']
        # claims = auth.verify_id_token(id_token)

        # uid = claims['uid']
        # Hardcoded for now - until we get auth flow going on frontend

        trip_doc = TRIPS.document(uid).collection('trips').document()

        # create new empty trip
        # TODO(ibrahim): Refactor into model class
        trip_doc.set({
            'trip_id': trip_doc.id,
            'owner_id': uid,
            'trip_name': trip_name,
            'start_date': start_date,
            'end_date': end_date,
            'reservations': []
        })

        return "success", 200
    except Exception as e:
        return f"An Error Occured: {e}", 400


@app.route('/trip/<trip_id>/delete', methods=['POST'])
def delete_trip(trip_id):
    """
      delete_trip(): Deletes user's trip
    """
    try:
        data = request.json['data']
        uid = data['user_id']

        trip_doc = TRIPS.document(uid).collection(
            'trips').document(trip_id)

        if (not trip_doc.get().exists):
            return "forbidden - Cannot remove trip that does not exist", 200

        trip_doc.delete()

        return "success", 200
    except Exception as e:
        return f"An Error Occured: {e}", 400


@app.route("/reservation/<trip_id>/create", methods=['POST'])
def create_reservation(trip_id):
    """
      create_reservation(): Creates and adds reservation to trip
    """
    try:
        data = request.json['data']
        res_name = data['res_name']
        res_location = data['res_location']
        res_time = data['res_time']

        uid = data['user_id']

        trip_doc = TRIPS.document(uid).collection(
            'trips').document(trip_id)

        # Check if trip exists in user's trip list
        if (not trip_doc.get().exists):
            return "forbidden - Cannot add reservation to trip that does not exist", 403

        # curr_res = res_doc.getData()
        # print('here')
        # print(curr_res)
        # appends new reservation

        # current timestamp + trip_id

        res_id = str(time.time()) + trip_id
        trip_doc.update({
            'reservations': firestore.firestore.ArrayUnion([
                {
                    'res_id': res_id,
                    'res_name': res_name,
                    'res_location': res_location,
                    'res_time': res_time
                }
            ])

        })

        return "success", 200
    except Exception as e:
        return f"An Error Occured: {e}", 400


@app.route('/reservation/<user_id>/<trip_id>/<res_id>/delete', methods=['POST'])
def delete_reservation(user_id, trip_id, res_id):
    """
      delete_reservation(): Deletes reservation in trip
    """
    try:
        uid = user_id

        trip_doc = TRIPS.document(uid).collection(
            'trips').document(trip_id)

        # Check if trip exists in user's trip list
        if (not trip_doc.get().exists):
            return "forbidden - cannot delete reservation from trip that does not exist", 403

        curr_reservations = trip_doc.get({u'reservations'}).to_dict()[
            'reservations']

        filtered_reservations = [
            res for res in curr_reservations if res['res_id'] != res_id]

        trip_doc.update({'reservations': filtered_reservations})
        return "success", 200
    except Exception as e:
        return f"An Error Occured: {e}", 400


@app.route('/reservation/<trip_id>/<res_id>/edit', methods=['POST'])
def edit_reservation(trip_id, res_id):
    """
      edit_reservation(): edits reservation in trip
    """
    try:
        data = request.json['data']
        res_name = data['res_name']
        res_location = data['res_location']
        res_time = data['res_time']

        # CHECK If user has permission to add reservation to that user (owner_id)
        # id_token = request.headers['Authorization']
        # claims = auth.verify_id_token(id_token)
        # uid = claims['uid']
        uid = '1'  # Hardcoded for now - until we get auth flow going on frontend

        trip_doc = TRIPS.document(uid).collection(
            'trips').document(trip_id)

        # Check if trip exists in user's trip list
        if (not trip_doc.get().exists):
            return "forbidden - cannot delete reservation from trip that does not exist", 403

        curr_reservations = trip_doc.get({u'reservations'}).to_dict()[
            'reservations']

        # replace reservation with the new reservation
        edited_reservations = [
            res for res in curr_reservations if res['res_id'] != res_id]

        # Ensure that reservation to be edited exists
        if (len(curr_reservations) == len(edited_reservations)):
            return "forbidden - cannot edit reservation that does not exist", 403

        edited_reservations.append(
            {
                'res_id': res_id,
                'res_name': res_name,
                'res_location': res_location,
                'res_time': res_time
            })

        trip_doc.update({'reservations': edited_reservations})
        return "success", 200
    except Exception as e:
        return f"An Error Occured: {e}", 400


@app.route('/trips/<user_id>', methods=['GET'])
def get_all_trips(user_id):
    trips_docs = TRIPS.document(user_id).collection('trips').stream()
    trips = [trip.to_dict() for trip in trips_docs]

    return jsonify({"trips": trips}), 200


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

<<<<<<< HEAD
=======

def hotel_or_flight(text):
    if "hotel" in text:
        return "hotel"
    elif "flight" in text:
        return "flight"
    else:
        return None

>>>>>>> merge_attempt1
# AirBNB testing (regex)


def reservation_code_airbnb_regex(text):
    pattern = r'[A-Z][A-Z][A-Z][A-Z][A-Z][A-Z][A-Z][A-Z][A-Z][A-Z]'
    check = re.search(pattern, text)
    code = re.findall(pattern, text)

    return "".join(code)
# for i in code:
# print(i)

# if check:
#     return ("found a match")
# else:
#     return ("none found")

# 8 digit confirmation codes for hotels


def confirmation_code_regex(text):
    pattern = r'[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
    check = re.search(pattern, text)
    code = re.findall(pattern, text)

    return "".join(code)
    # for i in code:
    #     print(i)

    # if check:
    #     return ("found a match")
    # else:
    #     return ("none found")


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

<<<<<<< HEAD
=======

def preprocess_email(text):
    text = nltk.word_tokenize(text)
    text = nltk.pos_tag(text)

    return text


>>>>>>> merge_attempt1
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)

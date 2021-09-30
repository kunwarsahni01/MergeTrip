import os
import json
from flask import Flask, jsonify, request
from google.oauth2.reauth import refresh_grant
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

app = Flask(__name__)

client_secrets = json.load(open("client_creds.json"))['installed']

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']


@app.route("/gmails", methods=['GET', 'POST'])
def get_auth_token():
    """
      get_auth_token(): Will get auth token from a refresh token which we can get
      from the firestore when we store it after the initial connecting of gmail

      Returns:

    """
    client_id = client_secrets['client_id']
    client_secret = client_secrets['client_secret']
    token_uri = client_secrets['token_uri']

    # get refresh token for the user from database here
    refresh_token = '1//047Mkf0jPxj33CgYIARAAGAQSNwF-L9Irh5ql3pn3-oWdBBCDl4JyYKviBhCW6zkUbfsRcr2usF4hQUY4381EIys7u3FAVsh6ERM'

    creds = Credentials(token=None, refresh_token=refresh_token, token_uri=token_uri,
                        client_id=client_id, client_secret=client_secret, scopes=SCOPES)

    # generates access token from refresh token
    creds.refresh(Request())

    service = build('gmail', 'v1', credentials=creds)

    # Call the Gmail API
    results = service.users().messages().list(userId='me').execute()
    messages = results.get('messages', [])
    print('length: ', len(messages))
    return jsonify({'results': messages}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)

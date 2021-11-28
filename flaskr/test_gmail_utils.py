import base64
import pytest
from gmail_utils import get_clean_body, parse_message


fake_email_payload = {
    "filename": "",
    "headers": [
        {
            "name": "Delivered-To",
            "value": "ibrahim.alassad001@gmail.com"
        },
        {
            "name": "From",
            "value": "Will Kao <willkao21@gmail.com>"
        },
        {
            "name": "To",
            "value": "ibrahim.alassad001@gmail.com"
        },
        {
            "name": "Subject",
            "value": "Fwd: Your SFO > IND Trip Details"
        }
    ],
    "body": {
        "data": ""
    }
}


def test_subject_parsing():
    message = parse_message(fake_email_payload)

    expected_message = {
        'From': 'Will Kao <willkao21@gmail.com>',
        'To': 'ibrahim.alassad001@gmail.com',
        'Subject': 'Fwd: Your SFO > IND Trip Details',
        'body': None
    }

    assert message == expected_message


def test_email_body_parsing_with_p_tags():

    fake_email_body_p_tags = """
<html>
  <head>blah blah blah</head>
  <body>
    <div>
      <p>Confirmation: #123123</p>
      <p>Checkin: 12/12/2012</p>
      <p>Address: 123 red street, IN, 40001</div>
    </div>
  </body>
</html>
"""

    encoded_body = base64.urlsafe_b64encode(
        bytes(fake_email_body_p_tags, 'utf-8'))
    # fake_email_payload['body']['data'] = encoded_body

    decoded_body = get_clean_body(encoded_body)

    # assert that all the critical information is not cut off
    assert "#123123" in decoded_body
    assert "12/12/2012" in decoded_body
    assert "123 red street, IN, 40001" in decoded_body


def test_email_body_parsing_without_p_tags():

    fake_email_body_no_p_tags = """
    <html>
      <head>blah blah blah</head>
      <body>
        <div>blah blah blahh<div>
        <div>
          <div>Confirmation: #123123</div>
          <div>Checkin: 12/12/2012</div>
          <div>Address: 123 red street, IN, 40001</div>
        </div>
      </body>
    </html>
    """

    encoded_body = base64.urlsafe_b64encode(
        bytes(fake_email_body_no_p_tags, 'utf-8'))
    # fake_email_payload['body']['data'] = encoded_body

    decoded_body = get_clean_body(encoded_body)

    # assert that all the critical information is not cut off
    assert "#123123" in decoded_body
    assert "12/12/2012" in decoded_body
    assert "123 red street, IN, 40001" in decoded_body

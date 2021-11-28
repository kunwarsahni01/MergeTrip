import re
import base64
from bs4 import BeautifulSoup, NavigableString


def get_clean_body(raw_body_bytes: bytes) -> str:
    # raw_body_bytes = bytes(raw_body_bytes, 'utf-8')
    decoded_body = base64.urlsafe_b64decode(raw_body_bytes)

    soup = BeautifulSoup(str(decoded_body), "html.parser")

    # blacklist = [
    #   'style',
    #   'script',
    #   # other elements,
    # ]

    # text_elements = [t for t in soup.find_all(text=True) if t.parent.name not in blacklist]
    cleaned_lines = []
    # for p in soup.find_all('p'):
    for p in soup.find_all(text=True):
        # print(f'<p>{p.text}</p>')
        # clean_line = p.text.replace(r"\r\n", "")
        text = p.text
        text = re.sub(r"\\*x.+\\*", "", text)
        text = re.sub(r"(\r\n)*(\\r\\n)*", "", text)
        text = re.sub(r"(\n)*", "", text)

        lines = []
        # line = re.split(r'[ \t\n\r\f\v]', text)

        text = text.strip()

        if re.search('[ a-zA-Z0-9$#]+', text):
            # print(f'added: <p>{p.text}</p>')
            text = re.sub("[\n]+", " ", text)
            lines.append(text)

        if (len(lines) > 0):
            cleaned_lines.append("\n".join(lines))

    # print("\n".join(cleaned_lines))
    return "\n".join(cleaned_lines)


def parse_message(response_payload: object) -> object:
    message = {}

    # extract From, To and Subject from payload
    for header in response_payload['headers']:
        if (header['name'] == 'To'):
            message['To'] = header['value']
        elif (header['name'] == 'From'):
            message['From'] = header['value']
        elif (header['name'] == 'Subject'):
            message['Subject'] = header['value']

    # Decode raw base64url encoded email body
    raw_body_bytes = ''
    if (response_payload['body'].get('data')):
        raw_body_bytes += response_payload['body']['data']
    elif response_payload.get('parts'):
        for part in response_payload['parts']:
            if (part['body'].get('data')):
                raw_body_bytes = part['body']['data'] + raw_body_bytes
    else:
        message['body'] = None
        return message

    # raw_body_bytes = bytes(str(raw_body_bytes), 'utf-8')
    # decoded_body = base64.urlsafe_b64decode(raw_body_bytes)
    # base64.b64encode()

    # message['body'] = str(decoded_body)
    message['body'] = get_clean_body(raw_body_bytes)

    return message

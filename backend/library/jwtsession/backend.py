from django.contrib.sessions.backends import signed_cookies
from django.contrib.sessions.backends.base import VALID_KEY_CHARS
from django.utils.crypto import get_random_string
from django.conf import settings
import jwt

class SessionStore(signed_cookies.SessionStore):

    def load(self):
        """
        Load the data from the key itself instead of fetching from some
        external data store. Opposite of _get_session_key().
        """
        try:
            return jwt.decode(self.session_key, settings.SECRET_KEY, algorithms="HS256")
        except Exception:
            # BadSignature, ValueError, or unpickling exceptions. If any of
            # these happen, reset the session.
            self.create()
        return {}


    def _get_session_key(self):
        """
        Instead of generating a random string, generate JWT encoded string of data as our session key.
        """
        self._session['session_key'] = get_random_string(32, VALID_KEY_CHARS)
        return jwt.encode(self._session, settings.SECRET_KEY, algorithm="HS256")
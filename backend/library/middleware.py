from django.middleware.csrf import CsrfViewMiddleware
from django.contrib.auth.middleware import AuthenticationMiddleware


def disableCSRF(getres):
    def func(request, *args, **kwargs):
        setattr(request, '_dont_enforce_csrf_checks', True)
        return getres(request, *args, **kwargs)
    return func
import os

def getDBConfig(BASE_DIR, TIME_ZONE):
    try:
        default = {}
        #Basic configuration
        default['ENGINE'] = 'django.db.backends.' + os.environ['DB_ENGINE']
        default['NAME'] = os.environ['DB_NAME']
        default['HOST'] = os.environ['DB_HOST']
        default['PORT'] = os.environ['DB_PORT']
        #Database user
        default['USER'] = os.environ['DB_USER']
        default['PASSWORD'] = os.environ['DB_PASSWORD']
        default['CONN_MAX_AGE'] = 0 if os.environ['DJANGO_ENV'] == 'dev' else None
        #Default database timezone
        default['TIME_ZONE'] = TIME_ZONE
        #Return configuration
        return {
                    'default': default
                }
    except:
        return {
                    'default': {
                        'ENGINE': 'django.db.backends.sqlite3',
                        'NAME': BASE_DIR / 'db.sqlite3',
                    }
                }
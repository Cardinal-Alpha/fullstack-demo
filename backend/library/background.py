
import time
from datetime import datetime, timedelta
from threading import Thread, Lock
import signal
from hashlib import sha256
import string 
import copy

class Future:

    def __init__(self, target, args=[], kwargs={}, return_exception = True):
        self.__target = target
        self.__args = args
        self.__kwargs = kwargs
        self.__ret_exc = return_exception
        self.__thread = Thread(target=self.__wrap_target, name=self.__getName())
        self.__thread.start()

    def __getName(self):
        return "Thread[{}][{}]".format(self.__target.__name__, datetime.now().strftime("%d-%m-Y %H:%M:%S.%f"))
    
    def __wrap_target(self):
        try:
            self.__res = self.__target(*self.__args, **self.__kwargs)
        except Exception as e:
            if self.__ret_exc:
                self.__res = e
            else:
                raise e

    def cancel(self):
        signal.pthread_kill(self.__thread.native_id, signal.SIGTERM)

    def running(self):
        return self.__thread.is_alive()

    def result(self):
        while self.__thread.is_alive():
            time.sleep(0.5)
        if self.__res != None:
            return copy.deepcopy(self.__res)
        else:
            return None


def futurable(func):
    def caller(*args, **kwargs):
        return Future(func, args, kwargs)
    caller.__name__ = func.__name__
    return caller



class schedule_task:
    """
    Repeat execution based on schedule
    """
    def __init__(self, start, interval=None, timeout=3600):
        assert isinstance(start, datetime) or isinstance(start, int)
        assert isinstance(interval, int) or not interval
        assert isinstance(timeout, int) or not interval
        #Cache creation time
        self.__created = datetime.now()
        #If number is provided, treat it as seconds count to start 
        if isinstance(start, int):
            start = self.__created + timedelta(seconds=start)
        #Make sure start isn't behind created time 
        self.__start = start if start > self.__created else self.__created
        self.__interval = interval
        self.__timeout = timeout


    def __call__(self, target):
        def scheduled(*args, **kwargs):
            thread = Thread(target=self.__start_task, args=[target, args, kwargs])
            thread.start()
        scheduled.__name__ = target.__name__
        return scheduled


    def __start_task(self, target, args, kwargs, first_loop = True):
        #If it's not first time execution, just skip delay
        if first_loop:
            delta = self.__start - self.__created
            time.sleep(delta.seconds)
        #Concurrent target execution
        task = Future(target, args, kwargs, False)
        #Waiting timeout
        count = self.__timeout
        while count > 0:
            time.sleep(1)
            #If threading is not alive break waiting
            if not task.running():
                break
            count -= 1
        #Finish waiting timeout, if thread is alive terminate it
        if task.running():
            task.cancel()
        del task
        #Waiting interval
        if self.__interval:
            time.sleep(self.__interval)
            return self.__start_task(target, args, kwargs, False)

    

class repeatable:
    """
    Repeat execution upon exception occur, until success without issue
    """
    def __init__(self, repeat_interval, debug_mode, logging):
        assert isinstance(debug_mode, bool) and \
                isinstance(repeat_interval, int) and \
                isinstance(logging, bool)
        self.__interval = repeat_interval
        self.__logmode = logging
        self.__debug = debug_mode
        self.__lock = Lock()


    def __call__(self, target):
        def repeat(*args, **kwargs):
            thread = Thread(target=self.__start_task, args=[target, args, kwargs])
            thread.start()
        repeat.__name__ = target.__name__
        return repeat


    def __start_task(self, target, args, kwargs):
        try:
            target(*args, **kwargs)
        except Exception as e:
            if self.__debug and self.__logmode:
                self.__lock.acquire()
                print(e)
                self.__lock.release()
            if self.__debug:
                raise e
            time.sleep(self.__interval)
            self.__start_task(target, args, kwargs)
        
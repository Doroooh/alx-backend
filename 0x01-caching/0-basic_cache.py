#!/usr/bin/python3
""" A Basic dictionary """
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """ A Class that WILL inherit from THE BaseCaching and is a caching system
        The caching system does not have a limit """
    def put(self, key, item):
        """ Assigning to a dictionary """
        if key and item:
            self.cache_data[key] = item

    def get(self, key):
        """ Returning a value linked """
        if key is None or self.cache_data.get(key) is None:
            return None
        return self.cache_data.get(key)

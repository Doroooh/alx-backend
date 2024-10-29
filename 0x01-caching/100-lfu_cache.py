#!/usr/bin/python3
""" LFU Caching System """
from base_caching import BaseCaching
from collections import OrderedDict


class LFUCacheSystem(BaseCaching):
    """ LFU Cache that inherits from BaseCaching """
    
    def __init__(self):
        super().__init__()
        self.access_order = OrderedDict()
        self.frequency_count = {}

    def put(self, key, item):
        """ Store item using LFU caching rules """
        if not key or not item:
            return

        if key in self.access_order:
            del self.access_order[key]

        if len(self.access_order) >= BaseCaching.MAX_ITEMS:
            min_freq = min(self.frequency_count.values())
            least_frequent_keys = [k for k, v in self.frequency_count.items() if v == min_freq]
            
            # If more than one key with minimum frequency, use FIFO rule among them
            for old_key in list(self.access_order):
                if old_key in least_frequent_keys:
                    print("DISCARD:", old_key)
                    del self.access_order[old_key]
                    del self.frequency_count[old_key]
                    break

        # Insert new key and update frequency
        self.access_order[key] = item
        self.access_order.move_to_end(key)
        self.frequency_count[key] = self.frequency_count.get(key, 0) + 1
        self.cache_data = dict(self.access_order)

    def get(self, key):
        """ Retrieve item and update frequency """
        if key in self.access_order:
            item = self.access_order[key]
            self.access_order.move_to_end(key)
            self.frequency_count[key] = self.frequency_count.get(key, 0) + 1
            return item
        return None

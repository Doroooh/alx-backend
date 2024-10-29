#!/usr/bin/python3
""" Least Recently Used (LRU) Caching System """
from base_caching import BaseCaching


class LRUCacheSystem(BaseCaching):
    """ LRU Caching System inheriting from BaseCaching """

    def __init__(self):
        super().__init__()
        self.start_marker, self.end_marker = '<<', '>>'
        self.forward_links, self.backward_links = {}, {}
        self.link_nodes(self.start_marker, self.end_marker)

    def link_nodes(self, first, second):
        """ Linking two nodes in the doubly linked list """
        self.forward_links[first] = second
        self.backward_links[second] = first

    def _unlink(self, key):
        """ Unlinking a node from the linked list """
        self.link_nodes(self.backward_links[key], self.forward_links[key])
        del self.backward_links[key], self.forward_links[key], self.cache_data[key]

    def _insert(self, key, item):
        """ Inserting a node into the linked list """
        self.cache_data[key] = item
        last_key = self.backward_links[self.end_marker]
        self.link_nodes(last_key, key)
        self.link_nodes(key, self.end_marker)

        # Evict if max capacity is reached
        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            print("DISCARD:", self.forward_links[self.start_marker])
            self._unlink(self.forward_links[self.start_marker])

    def put(self, key, item):
        """ Adding an item to the cache with LRU policy """
        if not key or not item:
            return
        if key in self.cache_data:
            self._unlink(key)
        self._insert(key, item)

    def get(self, key):
        """ Retrieving an item and update position as most recent """
        if key is None or key not in self.cache_data:
            return None
        item = self.cache_data[key]
        self._unlink(key)
        self._insert(key, item)
        return item

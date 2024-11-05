#!/usr/bin/env python3
""" a basic flask app"""
from flask import Flask, render_template, request
from flask_babel import Babel, _

app = Flask(__name__)


class Config(object):
    """ Configuring class for Babel object """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app.config.from_object(Config)
babel = Babel(app)


@app.route('/')
def hello():
    """ rendering a basic html file """
    return render_template('3-index.html')


@babel.localeselector
def get_locale():
    """ function that determines best match with supported languages """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


if __name__ == '__main__':
    app.run()

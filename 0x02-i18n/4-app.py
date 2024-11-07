#!/usr/bin/env python3
"""Simple flask app setup"""
from flask import Flask, render_template, request
from flask_babel import Babel
app = Flask(__name__)
babel = Babel(app)


class Config(object):
    """Class to set defualts for babel"""
    LANGUAGES = ["en", "fr"]
    Babel.default_locale = "en"
    Babel.default_timezone = "UTC"


app.config.from_object(Config)


@babel.localeselector
def get_locale():
    """Get best langauge for user"""
    locale = request.args.get('locale')
    if locale and locale in Config.LANGUAGES:
        return locale
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/')
def index():
    """Return simple homepage"""
    return render_template('4-index.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)

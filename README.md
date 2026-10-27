# Paisley RFC S&C app

The squad app for Paisley RFC strength and conditioning.

- Players: https://paisleyrfc-sc.github.io/
- Coaches: https://paisleyrfc-sc.github.io/coach/ (needs the coach PIN from the coach sheet)

This website is only the front page. The data and the logic live in the coach Google Sheet and its Apps Script
("Paisley RFC S&C app"), which this page talks to. Change things there, not here.

`index.html` and `coach/index.html` are built from the same page the Apps Script serves (`APP_HTML`), so the Google link
and this site always look the same.

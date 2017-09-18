### Logic

* Inject a content script that checks the tabs for forms containing a password
* If a password containing form is present, start recording requests on that tab only
* Now whichever post requests are made, record their body(even rubbish CSRF tokens and stuff)
* After the data has been recorded, end logging.
* In the manage page, the user should be able to remove certain fields or complete records


### TODO
Maybe *webRequests* are not the way to go! While we get all the data without fail, but we might get too much of the data, gmail for instance sends a shit load of data while authentication. Most of the important sites do.

We also might get hashed data, for example some banking sites hash the passwords on the front end itself.

Maybe, *logging the visible form inputs* is probably a better idea?
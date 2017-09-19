### Logic

* Inject a content script that checks the tabs for forms containing a password
* If a password containing form is present, we add a listener to the form
* Now whenevr the form is submitted, we save the **visible data** in our database
* These records will be visible to the users in the options page
* Users can even edit/delete these records.

### Why haven't I used *webRequests*
In previous commits you might find an implementation(raw) for webrequests. But I realized, webrequests get data at a very later stage. Webpage JS might have encoded the data by then, or a lot of extra data might be present, CSR tokens, oauth tokens and many other hidden fields.
The users are more interested in the visible fields(usernames, emails and passwords). That we do store.


### TODO
* Finalize and develop the options page
* Implement browser actions denoting if we have any passwords in store for the given page/domain.
* Maybe implement a way to input those passwords with 1 click?
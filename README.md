### Steps to run.
- Install Node
- Open Command prompt or Terminal, Git clone the repo
- Run inside the folder```npm install```
- Refer this blog to install [Audio player](https://thisdavej.com/node-js-playing-sounds-to-provide-notifications/)
    * Keep in mind for windows <b> MPlayer </b> is required  
- Run inside the folder ```node . <date> <districtId> <Token>```

### Notes
- Schedule runs depends on cron syntax
- Test the audio player
- Get the District id from cowin websit
- Date format ```dd-mm-yyyy```
- Token is not mandatory
- There is a change in api call. There could be a lag of 30 mins to get the latest data

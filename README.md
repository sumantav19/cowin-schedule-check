### Steps to run.
- Install Node
- Run ```npm install```
- Refer this blog to install [Audio player](https://thisdavej.com/node-js-playing-sounds-to-provide-notifications/)
    * Keep in mind for windows <b> MPlayer </b> is required  
- Update districtId and date at ```getSchedule('date','districtId')``` in src/index.js
- Run ```node .```

### Notes
- Schedule runs depends on cron syntax
- Test the audio player
- Get the District id from cowin websit
- Date format ```dd-mm-yyyy```

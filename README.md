### Steps to run.
- Install Node
- Open Command prompt or Terminal, Git clone the repo
- Run inside the folder```npm install```
- Run inside the folder```npm i --save date-and-time```
- Refer this blog to install [Audio player](https://thisdavej.com/node-js-playing-sounds-to-provide-notifications/)
    * Keep in mind for windows <b> MPlayer </b> is required  
- Run inside the folder ```node . <districtId> <week count> <Token>```
    * The date input has been removed and ``` <week count> ``` has been added. ``` <week count> ``` can have value from 1 to n. If the value is 1 it will look for slots in the next 7 days from today, similarly if value is 2 it will look for slots in the next 14 days from today.
    * Note adjust ``` <week count> ``` with <b> cronRun </b> frequency, i.e. <b>10</b> here in the code example -->  ``` cron.schedule('*/ ```<b>10</b>``` * * * * *', () ``` , to ensure not more that 100 api calls per 5 minutes. Example ```<week count>``` = 2 and <b>cronRun frequency</b> = 10 means, 300 seconds / (10 frequency / 2 api calls) = 60 api calls in 5 minutes.
    * Optimize ``` <week count> ``` and <b>cronRun frequency</b> for best results

### Notes
- Schedule runs depends on cron syntax
- Test the audio player
- Get the District id from cowin websit
- Date format ```dd-mm-yyyy``` (This input is not required at the moment)
- Token is not mandatory
- There is a change in api call. There could be a lag of 30 mins to get the latest data

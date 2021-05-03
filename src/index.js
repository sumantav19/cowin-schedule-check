const https = require("https");
const cron = require("node-cron");
const player = require("play-sound")();
const basename = 'https://cdn-api.co-vin.in';
function getSchedule(date,districtId){
    let data = '';
    https.get(`${basename}/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtId}&date=${date}`,res=>{
        res.on('data',d => {
            data+=d;
        })

        res.on('end',()=>{
            console.log("parsing...");
            data  = JSON.parse(data);
            let sessions = data.sessions;
            sessions.map((slot)=>{
                if(slot.min_age_limit === 18 && slot.available_capacity > 0){
                    console.log(`${slot.pincode}   ${slot.vaccine} ${slot.name}  ${slot.available_capacity}`)
                    player.play('./media/338.mp3', err=>{
                        if(err)console.log(`Could not play: ${err}`);
                    })
                }
            })
        })
    })
}

function cronRun(){
    console.log('starting');
    const task = cron.schedule('* * * * *',() =>{
        getSchedule('03-05-2021','294');
        console.log("+++++++++");
    });
    task.start();
}

cronRun();
// getSchedule('03-05-2021','294');

// getSchedule;

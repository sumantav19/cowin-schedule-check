const https = require("https");
const cron = require("node-cron");
const player = require("play-sound")();
const basename = 'https://cdn-api.co-vin.in';
/// 
// function postRequest(data){
//     return new Promise((resolve)=>{
//         let responseData='';
        
//         const options = {
//             hostname: basename,
//             path: '/todos',
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'Content-Length': data.length
//             }
    
//         }
//         const req = https.request(options,res=>{
//             res.on('data', d => {
//                  responseData+=d;
//               })
//             res.on('end',()=>{
    
//             })
//         })
//         req.write(data);
//         req.end();
//     })
    

// }
function getSchedule(date,districtId){
    let data = '';
    https.get(`${basename}/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtId}&date=${date}`,res=>{
        res.on('data',d => {
            data+=d;
        })

        res.on('end',()=>{
            process.stdout.write("parsing...");
            data  = JSON.parse(data);
            let sessions = data.sessions;
            sessions.map((slot)=>{
                if(slot.min_age_limit === 18 && slot.available_capacity > 0){
                    console.log(`\n ${slot.pincode}   ${slot.vaccine} ${slot.name} available ${slot.available_capacity}`)
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
    const task = cron.schedule('*/5 * * * * *',() =>{
        getSchedule('date','districtId');
    });
    task.start();
}

cronRun();
// getSchedule;

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
function getSchedule(date, districtId) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Length': data.length,
            // 'Referrer': 'https://www.cowin.gov.in/',
            // 'Origin': 'https://www.cowin.gov.in',
            // 'If-None-Match':'W/"27d3a-g+fud61pnexS4+LVM2DXyEa1ai4"',
            'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:88.0) Gecko/20100101 Firefox/88.0'
        }
    }
    let data = '';
    const req = https.request(`${basename}/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtId}&date=${date}`, options, res => {
        res.on('data', d => {
            data += d;
        })
        // console.log("Response headers",res.headers)
        // console.log("Response status",res.status)
        res.on('end', () => {
            process.stdout.write("parsing...");
            data = JSON.parse(data);
            let sessions = data.sessions;
            sessions.map((slot) => {
                if (slot.min_age_limit === 18 && slot.available_capacity > 0) {
                    console.log(`\n ${slot.pincode}   ${slot.vaccine} ${slot.name} available ${slot.available_capacity}`)
                    player.play('./media/338.mp3', err => {
                        if (err) console.log(`Could not play: ${err}`);
                    })
                }
            })
        })
        req.on('error',(e)=>{
            console.log("Error in request>>>>>", e);
        })
    })
    req.end();
}

function cronRun() {
    console.log('starting');
    const task = cron.schedule('*/5 * * * * *', () => {
        getSchedule('date', 'DistrictId');
    });
    task.start();
}

cronRun();
// getSchedule('date', 'DistrictId');

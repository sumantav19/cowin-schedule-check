const https = require("https");
const cron = require("node-cron");
const player = require("play-sound")();
const basename = 'https://cdn-api.co-vin.in';
const date = require('date-and-time')

let task;
let etag;
function getSchedule(date, districtId, token) {
    let headers = {
        'Content-Type': 'application/json',
        // 'Content-Length': data.length,
        'referrer': 'https://www.cowin.gov.in/',
        'origin': 'https://www.cowin.gov.in',
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
        ...(token && { 'authorization': `Bearer ${token}` }),
        ...(etag && {'if-none-match':etag}),
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:88.0) Gecko/20100101 Firefox/88.0'
    };

    let options = {
        method: 'GET',
        headers: headers
    }
	//${basename}/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${date}
    let data = '';
    const req = https.request(`${basename}/api/v2/appointment/sessions/calendarByDistrict?district_id=${districtId}&date=${date}`, options, res => {
        etag = res.headers['etag']
        res.on('data', d => {
            data += d;
        })
        // console.log("Response headers", res.headers)
        // console.log("Response status", res.statusCode)
        res.on('end', () => {
            if (res.statusCode === 200) {
                const dateCurr = new Date();
				console.log(`\n`);
				process.stdout.write("parsing...");
				console.log(`${date}...${dateCurr.getHours()}:${dateCurr.getMinutes()}.${dateCurr.getSeconds()}`);
                data = JSON.parse(data);
				//console.log(JSON.stringify(data))
                let centers = data.centers;
                centers.map((center) => {
                    const sessions = center.sessions;
					const date = new Date();
                    sessions.map(session => {
                        if (session.min_age_limit == 18 && session.available_capacity > 0 && session.available_capacity_dose1 > 0) {
                            console.log(`\n ${center.pincode}   ${session.vaccine} ${center.name}   AGE:${session.min_age_limit}   available:${session.available_capacity}   1st dose:${session.available_capacity_dose1} 2nd dose:${session.available_capacity_dose2} ${session.date}  ${center.fee_type}  ${dateCurr.getHours()}:${dateCurr.getMinutes()}.${dateCurr.getSeconds()}`)
                            player.play('./media/loud-alarm-tone.mp3', err => {
                                if (err) console.log(`Could not play: ${err}`);
                            })
                        }
                    })

                })
            } else if (res.statusCode == 304){
                // do nothing
                process.stdout.write(` status code ${res.statusCode} cache hit for ${date}`)
            }
            else { console.log(`response status is ${res.statusCode}, please update the token and rerun`)
                    //task.end();
					player.play('./media/Smoke Alarm.mp3', err => {
                                if (err) console.log(`Could not play: ${err}`);
                            })
				}
        })
        req.on('error', (e) => {
            console.log("Error in request>>>>>", e);
        })
    })
    req.end();
}

function cronRun(districtId, wk_ct, token) {
	console.log(`starting for ${wk_ct} weeks from today for district ID ${districtId}`);

    const task = cron.schedule('*/10 * * * * *', () => {
		let currentDate = new Date();
		//console.log(`2 starting for ${wk_ct} ${districtId} ${token}`);
        for (let i=0;i<parseInt(wk_ct);i++) {
			try{
				let runDate = currentDate;
				runDate.setDate(runDate.getDate()+(7*i));
				let dateString = date.format(runDate,"DD-MM-YYYY");
				//console.log(`starting for ${dateString} ${districtId}`);
				getSchedule(dateString, districtId, token);
				//setTimeout(() => {getSchedule(dateString, districtId, token)},5000);
			}
			catch (err){console.log(err)}
		}
    });
    task.start();
}
cronRun(process.argv[2],process.argv[3],process.argv[4]);
// getSchedule(process.argv[2], process.argv[3], process.argv[4]);

const { O_TRUNC } = require("constants");
const https = require("https");
const cron = require("node-cron");
const player = require("play-sound")();
const basename = 'https://cdn-api.co-vin.in';

function getSchedule(date, districtId, token) {
    let headers = {
        'Content-Type': 'application/json',
        // 'Content-Length': data.length,
        'Referrer': 'https://www.cowin.gov.in/',
        'Origin': 'https://www.cowin.gov.in',
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
        ...(token && { 'authorization': `Bearer ${token}` }),
        // 'If-None-Match':'W/"27d3a-g+fud61pnexS4+LVM2DXyEa1ai4"',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:88.0) Gecko/20100101 Firefox/88.0'
    };

    let options = {
        method: 'GET',
        headers: headers
    }
	//${basename}/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${date}
    let data = '';
    const req = https.request(`${basename}/api/v2/appointment/sessions/calendarByDistrict?district_id=${districtId}&date=${date}`, options, res => {
        res.on('data', d => {
            data += d;
        })
        // console.log("Response headers", res.headers)
        // console.log("Response status", res.statusCode)
        res.on('end', () => {
            process.stdout.write("parsing...");
            if (res.statusCode === 200) {
                data = JSON.parse(data);
				//console.log(JSON.stringify(data))
				// && session.vaccine != "COVAXIN"
                let centers = data.centers;
                centers.map((center) => {
                    const sessions = center.sessions;
					const date = new Date();
                    sessions.map(session => {
                        if (session.min_age_limit == 18 && session.available_capacity > 0 && session.available_capacity_dose1 > 0) {
                            console.log(`\n ${center.pincode}   ${session.vaccine} ${center.name}   AGE:${session.min_age_limit}   available ${session.available_capacity} ${session.date}  ${center.fee_type}  ${date.getHours()}:${date.getMinutes()}.${date.getSeconds()}`)
                            player.play('./media/loud-alarm-tone.mp3', err => {
                                if (err) console.log(`Could not play: ${err}`);
                            })
                        }
                    })

                })
            } else { console.log(`response status is ${res.statusCode}, please update the token and rerun`)
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

function cronRun(date, districtId, token) {
    console.log(`starting for ${date} ${districtId} ${token}`);

    const task = cron.schedule('*/10 * * * * *', () => {
        getSchedule(date, districtId, token);
    });
    task.start();
}
cronRun(process.argv[2],process.argv[3],process.argv[4]);
// getSchedule(process.argv[2], process.argv[3], process.argv[4]);

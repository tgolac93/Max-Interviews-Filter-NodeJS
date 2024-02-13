const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
app.use(bodyParser.json());

// endpoint
app.post('/maxInterviews', (req, res) => {
    const { start_times, end_times } = req.body;

    // Checks for appropriate JSON fields
    if (!start_times || !end_times) {
        return res.status(400).json({ error: 'Please include start_times and end_times in your input!' });
    }

    // Check the data input format validity
    if (!Array.isArray(start_times) || !Array.isArray(end_times)) {
        return res.status(400).json({ error: 'Invalid input format! Please use Arrays.' });
    }

    // Checks if start times and end times have the same length
    if (start_times.length !== end_times.length) {
        return res.status(400).json({ error: 'Invalid input format! Start times and end times have to have an equal amount of data' });
    }

    const interviewsCollection = [];
    //stores values in an associative array for easier sorting
    for(let i = 0; i < end_times.length; i++){
        interviewsCollection.push({start_times: start_times[i], end_times: end_times[i]});
    }
    //sort by end times
    interviewsCollection.sort((x,y) => (x.end_times - y.end_times));

    let maxInterviews = 0;
    let previousEndTime = 0;

    for(const currentInterview of interviewsCollection){
        /*
            *if the current interview starts before or at the same time as the previous end time, the number increases, by default, previousEndTime is 0 so that in most cases, the minimum value is 1, then the currentInterview end time becomes the new previousEndTime
         */
        if(currentInterview.start_times >= previousEndTime){
            maxInterviews++;
            previousEndTime = currentInterview.end_times;
        }
    }
    return res.status(200).json({ max_interviews: maxInterviews });
});

// Start server
app.listen(port, () => {
    console.log("Server is running on port " + port);
});

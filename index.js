let env=require("dotenv").config();
let api =process.env.API ;


let prompt=require("prompt-sync")();


let gitFetch = async (Owner) => {
    let response = await fetch(`https://api.github.com/users/${Owner}/events`, {
        headers: {
            'Authorization': `token ${api}`
        }
    });

    if (response.ok) {
        let data = await response.json();
        
        // Map through the events and return a formatted string
        let formattedEvents = data.map(event => {
            let eventType = event.type;
            let repoName = event.repo.name;
            
            

            if (eventType === "PushEvent") {
                let commitCount = event.payload.commits.length;
                return `Pushed ${commitCount} commit(s) to ${repoName}`;
            } else if (eventType === "IssuesEvent" && event.payload.action === "opened") {
                return `Opened a new issue in ${repoName}`;
            } else if (eventType === "WatchEvent") {
                return `Starred ${repoName}`;
            } else {
                return `${eventType} in ${repoName}`;
            }
        }
       
    ); 
    

        // Log the formatted events
        formattedEvents.forEach(event => console.log(event));

    } else {
        console.error('Error:', response.status, response.statusText);
    }
    

};

let user=prompt("enter the login id")
gitFetch(user);






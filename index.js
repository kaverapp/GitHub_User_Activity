let env = require("dotenv").config({ error_handling: true });
if (env.error) {
    console.log("cannot find env or cused some issue");

}
let api = process.env.API;


let prompt = require("prompt-sync")();


let gitFetch = async (Owner) => {
    if(!Owner || Owner.trim()===""){
        throw new Error("owner cannot be empty");
    }
    try {
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

                const EVENT_TYPES={
                    PushEvent: 'PushEvent',
                    PullRequestEvent: 'Pull Request',
                    IssueCommentEvent: 'Commented',
                    IssuesEvent: 'IssuesEvent',
                    PublicEvent: 'Public',
                    WATCH_EVENT: "WatchEvent"
                }

                if (eventType === EVENT_TYPES.PushEvent) {
                    let commitCount = event.payload.commits.length;
                    return `Pushed ${commitCount} commit(s) to ${repoName}`;
                } else if (eventType === EVENT_TYPES.IssuesEvent && event.payload.action === "opened") {
                    return `Opened a new issue in ${repoName}`;
                } else if (eventType === EVENT_TYPES.WATCH_EVENT) {
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
        };
    } catch (error) {
        console.log("some internal erorr", error);
        throw error; //rethrow the error
    };


};

let user = prompt("enter the login id");

console.log("fetching git...");


gitFetch(user)
    .then(() => {
        console.log("fetch success");
    })
    .catch(error => console.log(error)
    )





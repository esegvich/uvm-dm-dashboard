import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import Countdown from "react-countdown";
import Leaderboard from "./Leaderboard";
import RecentDonations from "./RecentDonations";

const TEAM_IDS = [76006, 76948, 74891, 76817, 76819, 76795, 78285, 76291, 75730, 78253, 76821];


class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            donations: [],
            pollingCount: 0,
            delay: 2000,
            teamLeaders: [],
            oldDonations: [],
            bigDonation: null
        }

    }

    componentDidMount(){
        this.interval = setInterval(this.poll, this.state.delay);
        this.teamInterval = setInterval(this.pollTeams, 30000);
        this.poll();
        this.pollTeams();

    }

    componentWillUnmount(){
        clearInterval(this.interval);
        clearInterval(this.teamInterval);
    }

    poll = () => {
        const oldDonations = this.state.donations;
        this.setState({ pollingCount: this.state.pollingCount + 1 });

        fetch('https://events.dancemarathon.com/api/events/rallython26/donations?limit=5')
            .then(response => response.json())
            .then(data => {
                const oldIDs = new Set(oldDonations.map(o => o.donationID));
                this.setState({ donations: data, oldDonations });

                data.forEach(d => {
                    if (!oldIDs.has(d.donationID) && d.amount >= 50.0) {
                        this.setState({ bigDonation: d });
                        document.getElementById('donationAlert').classList.remove("donationAlertHidden");
                        this.start();
                    }
                });
            });
    }

    pollTeams = () => {
        Promise.all(
            TEAM_IDS.map(id =>
                fetch(`https://events.dancemarathon.com/api/teams/${id}`)
                    .then(r => r.json())
            )
        ).then(teams => {
            const sorted = teams.sort((a, b) => b.sumDonations - a.sumDonations);
            this.setState({ teamLeaders: sorted });
        });
    }

    start(){
        var popup = setInterval(function() {
            document.getElementById('donationAlert').classList.add("donationAlertHidden");
            clearInterval(popup);
        },8000);
    }

    render(){
        return <><Row className="filledRow">
            <div className="donationTable">
                <div className="donationAlert donationAlertHidden" id="donationAlert">
                    <h1><strong>{this.state.bigDonation ? this.state.bigDonation.recipientName : "Someone"}</strong> is a hero and raised <strong>${this.state.bigDonation ? this.state.bigDonation.amount.toFixed(2) : 0}</strong>!</h1>
                </div>
                <RecentDonations donations={this.state.donations}/>
            </div>
        </Row>
        <Row style={{display: "inline-block"}}>
            <div className="countdown">
                <span>🐙</span>
                <Countdown date={new Date("March 29, 2026 00:00:00")} daysInHours={true}/>
                <span style={{padding: 0}}> until RALLYTHON Reveal!</span>
                <span>🐙</span>
            </div>
        </Row>
        {<Row>
            <div className="">
                <Leaderboard title={"Team Leaderboard"} leaders={this.state.teamLeaders}/>
            </div>
        </Row>}</>
    }
}

export default Dashboard;
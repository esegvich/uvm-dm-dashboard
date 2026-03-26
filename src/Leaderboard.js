function Leaderboard(props) {
    const top = props.leaders[0];

    if (!top) return null;

    return (
        <div>
            <h2>Team Leaderboard</h2>
            <h3>🏆 {top.name}</h3>
            <h4>${top.sumDonations.toFixed(2)}</h4>
        </div>
    );
}

export default Leaderboard;
interface DriverStatsProps {
    completedTrips: number;
    totalEarnings: number;
  }
  
  const DriverStats: React.FC<DriverStatsProps> = ({ completedTrips, totalEarnings }) => (
    <div>
      <h3>Stats</h3>
      <p>Completed Trips: {completedTrips}</p>
      <p>Total Earnings: ${totalEarnings.toFixed(2)}</p>
    </div>
  );
  
  export default DriverStats;
  
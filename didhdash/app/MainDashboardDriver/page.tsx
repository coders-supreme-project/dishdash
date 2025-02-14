import OrderList from '../DriverDashboard/order/page';

const DriverDashboard = ({ driverId }: { driverId: number }) => {
  return (
    <div>
      <h1>Driver Dashboard</h1>
      <OrderList driverId={driverId} />
    </div>
  );
};

export default DriverDashboard;

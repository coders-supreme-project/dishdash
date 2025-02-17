"use client";

import Dashboard from "./pages/page";
import WorkSpace from "./workspace/page";
// import Form from "./component/form"; 
import { usePathname } from "next/navigation";

const Delivery: React.FC = () => {
  const pathname = usePathname();

  const renderPage = () => {
    switch (pathname) {
      case "/delivery":
      case "/delivery/dashboard":
        return <Dashboard />;
      case "/delivery/workSpace":
        return <WorkSpace />;
      // case "/delivery/form":
      //   return <Form />;
      default:
        return <Dashboard />; // Default to Dashboard
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
    </div>
  );
};

export default Delivery;

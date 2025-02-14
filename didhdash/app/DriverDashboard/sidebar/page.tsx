import Link from 'next/link';
import styles from './sidebar.module.css';

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <h2>Driver Dashboard</h2>
      <nav>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/orders">Orders</Link></li>
          <li><Link href="/locations">Locations</Link></li>
          <li><Link href="/media">Media</Link></li>
          <li><Link href="/profile">Profile</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

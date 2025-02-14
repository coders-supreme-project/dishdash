interface HeaderProps {
    firstName: string;
    lastName: string;
    balance: string;
  }
  
  const Header: React.FC<HeaderProps> = ({ firstName, lastName, balance }) => {
    return (
      <header>
        <h1>{firstName} {lastName}</h1>
        <p>Balance: ${balance}</p>
      </header>
    );
  };
  
  export default Header;
  
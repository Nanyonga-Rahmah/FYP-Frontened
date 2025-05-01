import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between border-b py-8 px-32 bg-white">
      {/* Logo and Brand */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
        <img src="/logos/logo.png" alt="Coffee" className="h-6 w-6 object-cover" />
        <span className="text-3xl font-bold text-[#0F2A38]">coffichain</span>
      </div>

      {/* Center Navigation */}
      <nav className="flex items-center gap-8 text-lg">
        <Link to="/about" className="text-[#0F2A38] hover:font-medium">About</Link>
        <Link to="/why-coffichain" className="text-[#0F2A38] hover:font-medium">Why Coffichain</Link>
        <Link to="/coffee-journey" className="text-[#0F2A38] hover:font-medium">Coffee journey</Link>
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="border border-[#0F2A38] text-[#0F2A38] text-sm px-4 py-1.5 rounded-md hover:bg-gray-50"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-[#EDB544] text-white text-sm px-4 py-1.5 rounded-md hover:bg-[#dfa435]"
        >
          Create Account
        </Link>
      </div>
    </header>
  );
}

export default Header;

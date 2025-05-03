import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-32 py-6 flex flex-wrap items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
          <img src="/logos/logo.png" alt="Coffee" className="h-6 w-6 object-cover" />
          <span className="text-2xl sm:text-3xl font-bold text-[#0F2A38]">coffichain</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap items-center gap-6 text-base sm:text-lg">
          <Link to="/about" className="text-[#0F2A38] hover:font-medium">About</Link>
          <Link to="/why-coffichain" className="text-[#0F2A38] hover:font-medium">Why Coffichain</Link>
          <Link to="/coffee-journey" className="text-[#0F2A38] hover:font-medium">Coffee journey</Link>
        </nav>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link
            to="/login"
            className="border border-[#0F2A38] text-[#0F2A38] px-4 py-1.5 rounded-md hover:bg-gray-50"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-[#EDB544] text-white px-4 py-1.5 rounded-md hover:bg-[#dfa435]"
          >
            Create Account
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;

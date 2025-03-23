function Footer() {
  const day = new Date();
  return (
    <footer className="bg-[#112D3E]   bottom-0 w-full text-white flex gap-1 py-2 justify-center items-center">
      <span className="flex items-center gap-1">
        <span>&copy;</span>
        <span>{day.getFullYear()}</span>
        <span>Coffichain</span>
      </span>

      <span>|</span>
      <span> Empowering Sustainable Coffee Supply Chains.</span>
    </footer>
  );
}

export default Footer;

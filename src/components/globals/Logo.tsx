function Logo() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-6 w-6 object-cover">
        <img src="/logos/logo.png" alt="Coffee" />
      </div>
      <span className="text-2xl font-extrabold text-[#112D3E] mb-2">
        coffichain
      </span>
    </div>
  );
}

export default Logo;

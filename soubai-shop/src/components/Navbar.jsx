const Navbar = () => {
  return (
    <nav className="bg-black text-yellow-500 p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Soubai Shop</h1>
      <div className="space-x-4">
        <a href="#" className="hover:underline">Face Primer</a>
        <a href="#" className="hover:underline">Makeup Brushes</a>
        <a href="#" className="hover:underline">Perfumes</a>
      </div>
      <div className="flex">
        <input type="text" className="p-2 rounded-l" placeholder="Search" />
        <button className="bg-yellow-500 text-black p-2 rounded-r">Search</button>
      </div>
    </nav>
  );
};
export default Navbar;

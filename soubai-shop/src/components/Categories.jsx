const categories = [
  { id: 1, image: "image1.jpg", name: "Face Primer" },
  { id: 2, image: "image2.jpg", name: "Makeup Brushes" },
  { id: 3, image: "image3.jpg", name: "Perfumes" },
];

const Categories = () => {
  return (
    <div className="py-12">
      <h2 className="text-2xl font-bold text-center mb-6">Shop By Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        {categories.map((category) => (
          <div key={category.id} className="shadow-lg p-4 rounded-lg">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-60 object-cover rounded-md"
            />
            <h3 className="text-lg text-center mt-4">{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Categories;

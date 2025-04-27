import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import productCategory from '../helpers/productCategory';
import VerticalCard from '../components/VerticalCard';
import SummaryApi from '../common/index';

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryListinArray = urlSearch.getAll("category");

  const urlCategoryListObject = {};
  urlCategoryListinArray.forEach(el => {
    urlCategoryListObject[el] = true;
  });

  const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
  const [filterCategoryList, setFilterCategoryList] = useState([]);
  const [sortBy, setSortBy] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.filterProduct.url, {
        method: SummaryApi.filterProduct.method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          category: filterCategoryList
        })
      });
      const dataResponse = await response.json();
      setData(dataResponse?.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    setSelectCategory(prev => ({
      ...prev,
      [value]: checked
    }));
  };

  useEffect(() => {
    fetchData();
  }, [filterCategoryList]);

  useEffect(() => {
    const arrayOfCategory = Object.keys(selectCategory)
      .filter(categoryKey => selectCategory[categoryKey]);

    setFilterCategoryList(arrayOfCategory);

    const urlFormat = arrayOfCategory.map(el => `category=${el}`).join('&&');
    navigate("/product-category?" + urlFormat);
  }, [selectCategory]);

  const handleOnChangeSortBy = (e) => {
    const { value } = e.target;
    setSortBy(value);
    const sortedData = [...data];
    
    if (value === 'asc') {
      sortedData.sort((a, b) => a.sellingPrice - b.sellingPrice);
    }

    if (value === 'dsc') {
      sortedData.sort((a, b) => b.sellingPrice - a.sellingPrice);
    }

    setData(sortedData);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Grid layout: Sidebar hidden on small screens */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar (visible only on large screens) */}
        <aside className="hidden lg:block w-[250px] bg-white p-4 rounded-lg shadow-sm h-[calc(100vh-140px)] overflow-y-auto">
          {/* Sort By */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold uppercase text-slate-600 border-b pb-1">Sort By</h3>
            <form className="mt-3 flex flex-col gap-3 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sortBy"
                  value="asc"
                  checked={sortBy === 'asc'}
                  onChange={handleOnChangeSortBy}
                />
                Price - Low to High
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sortBy"
                  value="dsc"
                  checked={sortBy === 'dsc'}
                  onChange={handleOnChangeSortBy}
                />
                Price - High to Low
              </label>
            </form>
          </div>

          {/* Category */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-slate-600 border-b pb-1">Category</h3>
            <form className="mt-3 flex flex-col gap-3 text-sm">
              {productCategory.map((category, idx) => (
                <label key={idx} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="category"
                    checked={selectCategory[category.value]}
                    value={category.value}
                    onChange={handleSelectCategory}
                  />
                  {category.label}
                </label>
              ))}
            </form>
          </div>
        </aside>

        {/* Main content */}
        <section className="flex-1">
          <p className="text-lg font-semibold text-slate-700 mb-4">
            Search Results: {data.length}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
            {!loading && Array.isArray(data) && data.length > 0 ? (
              data.map((item, i) => (
                <VerticalCard key={i} data={[item]} loading={false} />
              ))
            ) : (
              !loading && <p className="text-gray-500">No products found for selected category.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CategoryProduct;
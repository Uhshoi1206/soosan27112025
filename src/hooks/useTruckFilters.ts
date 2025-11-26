import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TruckFilters, VehicleType } from '@/models/TruckTypes';

// Định nghĩa trọng lượng trực tiếp trong file này
const truckWeights = [
  { id: 1, name: "Dưới 1 tấn", minWeight: 0, maxWeight: 1 },
  { id: 2, name: "1 - 2 tấn", minWeight: 1, maxWeight: 2 },
  { id: 3, name: "2 - 3.5 tấn", minWeight: 2, maxWeight: 3.5 },
  { id: 4, name: "3.5 - 5 tấn", minWeight: 3.5, maxWeight: 5 },
  { id: 5, name: "5 - 8 tấn", minWeight: 5, maxWeight: 8 },
  { id: 6, name: "8 - 15 tấn", minWeight: 8, maxWeight: 15 },
  { id: 7, name: "15 - 20 tấn", minWeight: 15, maxWeight: 20 },
  { id: 8, name: "Trên 20 tấn", minWeight: 20, maxWeight: 100 }
];

export const useTruckFilters = (initialFilters: TruckFilters) => {
  const [filters, setFilters] = useState<TruckFilters>(initialFilters);
  const location = useLocation();
  const navigate = useNavigate();

  const getWeightRange = (categoryWeight: number): { min: number, max: number } => {
    console.log(`Tính toán phạm vi trọng lượng cho: ${categoryWeight} tấn`);
    
    // Xử lý từng phạm vi tải trọng cụ thể theo đúng danh mục
    switch (categoryWeight) {
      case 1:
        return { min: 0, max: 1 };    // Dưới 1 tấn
      case 2:
        return { min: 1, max: 2 };    // 1-2 tấn
      case 3.5:
        return { min: 2, max: 3.5 };  // 2-3.5 tấn
      case 5:
        return { min: 3.5, max: 5 };  // 3.5-5 tấn
      case 8:
        return { min: 5, max: 8 };    // 5-8 tấn
      case 15:
        return { min: 8, max: 15 };   // 8-15 tấn
      case 20:
        return { min: 15, max: 20 };  // 15-20 tấn
      case 25:
        return { min: 20, max: 100 }; // Trên 20 tấn
      default:
        // Fallback - tìm phạm vi phù hợp nhất
        const weightCategory = truckWeights.find(w => w.id === Math.round(categoryWeight));
        if (!weightCategory) return { min: 0, max: 25 };
        
        return { min: weightCategory.minWeight, max: weightCategory.maxWeight };
    }
  };

  useEffect(() => {
    console.log("useTruckFilters: URL thay đổi, đọc tham số mới");
    const queryParams = new URLSearchParams(location.search);
    const brand = queryParams.get('brand');
    const weightParam = queryParams.get('weight');
    const vehicleType = queryParams.get('type') as VehicleType | null;
    const search = queryParams.get('search');
    
    let newFilters: TruckFilters = { ...initialFilters };
    
    if (brand) {
      console.log("Đọc brand từ URL:", brand);
      newFilters.brand = brand;
    } else {
      newFilters.brand = null;
    }
    
    // Thiết lập phạm vi tải trọng dựa trên tham số weight
    if (weightParam) {
      const weight = parseFloat(weightParam);
      if (!isNaN(weight)) {
        const range = getWeightRange(weight);
        console.log(`Đọc weight từ URL: ${weight}, phạm vi: [${range.min}, ${range.max}]`);
        newFilters.minWeight = range.min;
        newFilters.maxWeight = range.max;
      } else {
        newFilters.minWeight = null;
        newFilters.maxWeight = null;
      }
    } else {
      newFilters.minWeight = null;
      newFilters.maxWeight = null;
    }

    // Thiết lập loại xe dựa trên tham số type
    if (vehicleType) {
      newFilters.vehicleType = vehicleType;
    } else {
      // Khi lọc tải trọng, không nên mặc định là truck để hiển thị tất cả xe phù hợp
      newFilters.vehicleType = null;
    }

    // Thiết lập từ khóa tìm kiếm
    if (search) {
      newFilters.search = search;
    } else {
      newFilters.search = null;
    }
    
    console.log("Cập nhật filters từ URL:", newFilters);
    setFilters(newFilters);
  }, [location.search, initialFilters]);

  const handleFilterChange = (keyOrFilters: keyof TruckFilters | TruckFilters, value?: any) => {
    let newFilters: TruckFilters;
    
    // Xử lý trường hợp truyền vào toàn bộ đối tượng filters
    if (typeof keyOrFilters === 'object') {
      newFilters = { ...keyOrFilters };
      console.log("handleFilterChange: Cập nhật toàn bộ filters:", newFilters);
    } else {
      // Xử lý trường hợp truyền vào từng cặp key/value
      newFilters = { ...filters, [keyOrFilters]: value };
      console.log(`handleFilterChange: Cập nhật filter ${keyOrFilters}:`, value);
    }
    
    setFilters(newFilters);
    updateUrl(newFilters);
  };
  
  const updateUrl = (newFilters: TruckFilters) => {
    console.log("Cập nhật URL với filters:", newFilters);
    const params = new URLSearchParams();
    
    // Thêm các tham số vào URL nếu có giá trị
    if (newFilters.brand) {
      params.set('brand', newFilters.brand);
    }
    
    // Xác định danh mục tải trọng dựa trên phạm vi đã chọn
    if (newFilters.minWeight !== null && newFilters.maxWeight !== null) {
      let weightCategory;
      
      // Xác định đúng danh mục tải trọng dựa trên phạm vi đã chọn
      if (newFilters.minWeight >= 20) {
        weightCategory = 25;      // Trên 20 tấn (giá trị biểu diễn, không phải thực tế)
      } else if (newFilters.maxWeight <= 1) {
        weightCategory = 1;       // Dưới 1 tấn
      } else if (newFilters.minWeight >= 15 && newFilters.maxWeight <= 20) {
        weightCategory = 20;      // 15-20 tấn
      } else if (newFilters.minWeight >= 8 && newFilters.maxWeight <= 15) {
        weightCategory = 15;      // 8-15 tấn
      } else if (newFilters.minWeight >= 5 && newFilters.maxWeight <= 8) {
        weightCategory = 8;       // 5-8 tấn
      } else if (newFilters.minWeight >= 3.5 && newFilters.maxWeight <= 5) {
        weightCategory = 5;       // 3.5-5 tấn
      } else if (newFilters.minWeight >= 2 && newFilters.maxWeight <= 3.5) {
        weightCategory = 3.5;     // 2-3.5 tấn
      } else if (newFilters.minWeight >= 1 && newFilters.maxWeight <= 2) {
        weightCategory = 2;       // 1-2 tấn
      } else {
        // Fallback - tìm danh mục trọng lượng phù hợp nhất
        const matchingWeight = truckWeights.find(w => 
          w.minWeight <= newFilters.maxWeight! && 
          w.maxWeight >= newFilters.minWeight!
        );
        
        weightCategory = matchingWeight ? matchingWeight.maxWeight : newFilters.maxWeight;
      }
      
      params.set('weight', String(weightCategory));
    }

    // Thêm tham số loại xe nếu có
    if (newFilters.vehicleType) {
      params.set('type', newFilters.vehicleType);
    }

    // Thêm tham số tìm kiếm nếu có
    if (newFilters.search) {
      params.set('search', newFilters.search);
    }
    
    navigate(`/danh-muc-xe?${params.toString()}`, { replace: true });
  };

  const handleResetFilters = () => {
    console.log("Đặt lại tất cả bộ lọc");
    const emptyFilters: TruckFilters = {
      brand: null,
      minPrice: null,
      maxPrice: null,
      minWeight: null,
      maxWeight: null,
      vehicleType: null,
      search: null
    };
    setFilters(emptyFilters);
    navigate('/danh-muc-xe', { replace: true });
  };

  return {
    filters,
    handleFilterChange,
    handleResetFilters,
    updateUrl
  };
};

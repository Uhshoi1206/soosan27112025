
export interface AddressRegion {
  name: string;
  addresses: AddressInfo[];
}

export interface AddressInfo {
  province: string;
  address: string;
  phone: string;
}

export const addressRegions: AddressRegion[] = [
  {
    name: "Miền Bắc",
    addresses: [
      {
        province: "Hà Nội",
        address: "456 Đường Láng, Quận Đống Đa, TP. Hà Nội",
        phone: "0764123456"
      },
      {
        province: "Hải Phòng",
        address: "789 Đường Lê Hồng Phong, Quận Ngô Quyền, TP. Hải Phòng",
        phone: "0764234567"
      },
      {
        province: "Quảng Ninh",
        address: "101 Đường Trần Hưng Đạo, TP. Hạ Long, Tỉnh Quảng Ninh",
        phone: "0764345678"
      },
      {
        province: "Bắc Ninh",
        address: "202 Đường Lý Thái Tổ, TP. Bắc Ninh, Tỉnh Bắc Ninh",
        phone: "0764456789"
      }
    ]
  },
  {
    name: "Miền Trung",
    addresses: [
      {
        province: "Đà Nẵng",
        address: "123 Đường Nguyễn Văn Linh, Quận Hải Châu, TP. Đà Nẵng",
        phone: "0764567890"
      },
      {
        province: "Huế",
        address: "456 Đường Lê Lợi, TP. Huế, Tỉnh Thừa Thiên Huế",
        phone: "0764678901"
      },
      {
        province: "Quảng Nam",
        address: "789 Đường Phan Chu Trinh, TP. Tam Kỳ, Tỉnh Quảng Nam",
        phone: "0764789012"
      }
    ]
  },
  {
    name: "Miền Nam",
    addresses: [
      {
        province: "TP. Hồ Chí Minh",
        address: "123 Đường Quốc Lộ 1A, Quận Bình Tân, TP. Hồ Chí Minh",
        phone: "0764678901"
      },
      {
        province: "Bình Dương",
        address: "456 Đại lộ Bình Dương, TP. Thủ Dầu Một, Tỉnh Bình Dương",
        phone: "0764890123"
      },
      {
        province: "Đồng Nai",
        address: "789 Đường Võ Thị Sáu, TP. Biên Hòa, Tỉnh Đồng Nai",
        phone: "0764901234"
      },
      {
        province: "Cần Thơ",
        address: "101 Đường 30/4, Quận Ninh Kiều, TP. Cần Thơ",
        phone: "0765012345"
      },
      {
        province: "Vũng Tàu",
        address: "202 Đường Hoàng Hoa Thám, TP. Vũng Tàu, Tỉnh Bà Rịa - Vũng Tàu",
        phone: "0765123456"
      }
    ]
  }
];

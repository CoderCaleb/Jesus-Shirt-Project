import { faker } from "@faker-js/faker";
const generatePlaceholder = function () {
  return faker.image.url({
    height: 200,
    width: 200,
  });
};
const bestSellingData = [
  {
    id: 339743150,
    name: "Faithful Threads Tee",
    price: 19.99,
    thumbnail_url:
      "https://files.cdn.printful.com/files/b02/b02e9cfb0aa8e697a28f7fa20b236e12_preview.png",
    product_images: [
      "https://files.cdn.printful.com/files/48d/48dd50f2c414a3c34b838ccadf2bc8d4_preview.png",
      "https://files.cdn.printful.com/files/48d/48dd50f2c414a3c34b838ccadf2bc8d4_preview.png",
      "https://files.cdn.printful.com/files/48d/48dd50f2c414a3c34b838ccadf2bc8d4_preview.png",
      "https://files.cdn.printful.com/files/48d/48dd50f2c414a3c34b838ccadf2bc8d4_preview.png",
    ],
  },
  {
    id: 339757337,
    name: "Hopeful Hearts Hoodie",
    price: 39.99,
    thumbnail_url:
      "https://files.cdn.printful.com/files/923/923f826b70c50f298fb31d43ddd6e77c_preview.png",
    product_images: [
      "https://files.cdn.printful.com/files/b02/b02e9cfb0aa8e697a28f7fa20b236e12_preview.png",
      "https://files.cdn.printful.com/files/b02/b02e9cfb0aa8e697a28f7fa20b236e12_preview.png",
      "https://files.cdn.printful.com/files/b02/b02e9cfb0aa8e697a28f7fa20b236e12_preview.png",
      "https://files.cdn.printful.com/files/b02/b02e9cfb0aa8e697a28f7fa20b236e12_preview.png",
    ],
  },
  {
    id: 339743150,
    name: "God the Father",
    bestSellingPrice: 29.99,
    thumbnail_url:
      "https://files.cdn.printful.com/files/b02/b02e9cfb0aa8e697a28f7fa20b236e12_preview.png",
    product_images: [
      "https://files.cdn.printful.com/files/b02/b02e9cfb0aa8e697a28f7fa20b236e12_preview.png",
      "https://files.cdn.printful.com/files/b02/b02e9cfb0aa8e697a28f7fa20b236e12_preview.png",
      "https://files.cdn.printful.com/files/b02/b02e9cfb0aa8e697a28f7fa20b236e12_preview.png",
      "https://files.cdn.printful.com/files/b02/b02e9cfb0aa8e697a28f7fa20b236e12_preview.png",
    ],
  },
  {
    id: 339757337,
    name: "Love Embroidered Sweatshirt",
    price: 44.99,
    thumbnail_url:
      "https://files.cdn.printful.com/files/923/923f826b70c50f298fb31d43ddd6e77c_preview.png",
    product_images: [
      "https://files.cdn.printful.com/files/b02/b02e9cfb0aa8e697a28f7fa20b236e12_preview.png",
      "https://files.cdn.printful.com/files/b02/b02e9cfb0aa8e697a28f7fa20b236e12_preview.png",
      "https://files.cdn.printful.com/files/b02/b02e9cfb0aa8e697a28f7fa20b236e12_preview.png",
      "https://files.cdn.printful.com/files/b02/b02e9cfb0aa8e697a28f7fa20b236e12_preview.png",
    ],
  },
];

export default bestSellingData;

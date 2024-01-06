import { faker } from "@faker-js/faker";
const generatePlaceholder = function(){
    return faker.image.url({
        height: 200,
        width: 200,
    })
}
const bestSellingData = [
    {
      id: 1,
      name: "Faithful Threads Tee",
      price: 19.99,
      image: "gtf-hoodie-s-khaki-psalms-46-5-14602378346571_1800x1800.png",
      image2: generatePlaceholder(),
      image3: generatePlaceholder(),
      image4: generatePlaceholder(),
    },
    {
      id: 2,
      name: "Hopeful Hearts Hoodie",
      price: 39.99,
      image: "hisloveback_1_400x.png",
      image2: generatePlaceholder(),
      image3: generatePlaceholder(),
      image4: generatePlaceholder(),
    },
    {
      id: 3,
      name: "God the Father",
      price: 29.99,
      image: "john_400x.png",
      image2: generatePlaceholder(),
      image3: generatePlaceholder(),
      image4: generatePlaceholder(),
    },
    {
      id: 4,
      name: "Love Embroidered Sweatshirt",
      price: 44.99,
      image: "WWJDBT-min_400x.png",
      image2: generatePlaceholder(),
      image3: generatePlaceholder(),
      image4: generatePlaceholder(),
    },
    
  ];
  
export default bestSellingData
import React from "react";
import "../InfiniteScroll.css";
import biblePic from "../images/bible-pic.jpg";
import churchPic from "../images/church-pic.jpg";
import natureVid from "../images/nature-vid.gif";
import dovesVid from "../images/doves-vid.gif";

import Toolip from "./Toolip";

const images = [
  { src: biblePic, msg: "Light in the Darkness" },
  { src: churchPic, msg: "Faith and Hope" },
  { src: dovesVid, msg: "Peace and Serenity" },
  { src: natureVid, msg: "God's Creation" }
];

const InfiniteScroll = () => {
  return (
    <>
      <div className="w-full overflow-x-clip relative">
        <div className="horizontal-scrolling-items hover:animate-pause">
          {[...images, ...images].map((item, index) => (
            <Toolip key={index} text={item.msg}>
              <div className="">
                <img
                  src={item.src}
                  alt={`Product ${index + 1}`}
                  className="w-full aspect-square rounded-3xl cursor-pointer"
                />
              </div>
            </Toolip>
          ))}
        </div>
      </div>
    </>
  );
};

export default InfiniteScroll;

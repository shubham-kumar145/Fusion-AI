

import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

const items = [
  <img
    key="1"
    src="/chat.jpeg"
    style={{ height: "500px" }}
    className="rounded-xl w-full object-cover"
    alt="Slide 1"
  />,
  <img
    key="2"
    src="/web.jpeg"
    style={{ height: "500px" }}
    className="rounded-xl w-full object-cover"
    alt="Slide 2"
  />,
  <img
    key="3"
    src="/code.jpeg"
    style={{ height: "500px" }}
    className="rounded-xl w-full object-cover"
    alt="Slide 3"
  />,
  <img
    key="4"
    src="/img.jpeg"
    style={{ height: "500px" }}
    className="rounded-xl w-full object-cover"
    alt="Slide 4"
  />,
  <img
    key="5"
    src="/bg.jpeg"
    style={{ height: "500px" }}
    className="rounded-xl w-full object-cover"
    alt="Slide 5"
  />,
];

export default function MainCarousel() {
  return (
    <AliceCarousel
      items={items}
      autoPlay
      autoPlayInterval={3000}
      animationDuration={1000}
      infinite
      disableButtonsControls
      disableDotsControls={false}
      touchTracking
    />
  );
}

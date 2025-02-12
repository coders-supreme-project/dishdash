"use client"
import { useState, useRef } from "react";
import styles from "./page.module.css";
import '@/styles/globals.css';
import Link from "next/link";
import Career from "@/app/career/page";
const Home = () => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedCareer, setSelectedCareer] = useState<string>("");
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const handleCareerClick = () => {
    setShowDropdown(!showDropdown); // Toggle dropdown visibility
  };

  const handleCareerSelect = (career: string) => {
    setSelectedCareer(career); // Set the selected career
    setShowDropdown(false); // Close the dropdown after selection
  };

  return (
    <div className={styles.page}>
      <Career />
    </div>
  );
};

export default Home;

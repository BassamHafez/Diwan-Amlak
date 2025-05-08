import { useState, useEffect, memo } from "react";
import styles from "./SearchField.module.css";

const SearchField = memo(({ onSearch = () => {}, text }) => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  useEffect(() => {
    if (typeof onSearch === "function") {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch]);

  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <div
      className={`${styles.search_container} ${
        isArLang ? "me-auto" : "ms-auto"
      }`}
    >
      <input
        onChange={(e) => setSearchInput(e.target.value)}
        type="search"
        placeholder={text}
        value={searchInput}
      />
    </div>
  );
});

SearchField.displayName = "SearchField";
export default SearchField;
